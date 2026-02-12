import { createSlice } from '@reduxjs/toolkit';

// Load user from localStorage if available
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('petromanage_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return null;
};

const initialState = {
  user: loadUserFromStorage(), // Load from localStorage on init
  isLoggedIn: !!loadUserFromStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      // Persist to localStorage
      try {
        localStorage.setItem('petromanage_user', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      // Clear from localStorage
      try {
        localStorage.removeItem('petromanage_user');
      } catch (error) {
        console.error('Error removing user from localStorage:', error);
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage
      try {
        localStorage.setItem('petromanage_user', JSON.stringify(state.user));
      } catch (error) {
        console.error('Error updating user in localStorage:', error);
      }
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
