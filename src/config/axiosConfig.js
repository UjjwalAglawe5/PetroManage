import axios from 'axios';
import store from '../store/store';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // API Gateway URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from Redux store first
    const state = store.getState();
    let token = state.user?.user?.token;
    
    // Fallback: If token not in Redux, try localStorage
    if (!token) {
      try {
        const storedUser = localStorage.getItem('petromanage_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          token = userData.token;
          console.log("🔄 Token retrieved from localStorage (Redux was empty)");
        }
      } catch (error) {
        console.error("Error reading token from localStorage:", error);
      }
    }
    
    console.log("🔍 Axios Interceptor - Full State:", state);
    console.log("🔍 Axios Interceptor - User Object:", state.user?.user);
    console.log("🔍 Axios Interceptor - Token:", token ? "Present ✅" : "Missing ❌");
    console.log("🔍 Request URL:", config.url);
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added to Authorization header");
    } else {
      console.log("⚠️ No token found in Redux store or localStorage");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear user data from store and localStorage
      store.dispatch({ type: 'user/logout' });
      localStorage.removeItem('petromanage_user');
      
      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
