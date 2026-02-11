import axios from "axios";
 
const BASE_URL = "http://localhost:8080/api/assets";
 
/**
 * Parse backend error response and extract user-friendly message
 * @param {Error} error - Axios error object
 * @returns {string} - User-friendly error message
 */
const parseErrorMessage = (error) => {
  // Check if error response exists (backend responded with error)
  if (error.response) {
    const { data, status } = error.response;
   
    // Handle validation errors (400 with fieldErrors)
    if (data.fieldErrors) {
      const fieldMessages = Object.entries(data.fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(", ");
      return `Validation failed: ${fieldMessages}`;
    }
   
    // Handle custom error responses with message field
    if (data.message) {
      return data.message;
    }
   
    // Handle error responses with error field
    if (data.error) {
      return `${data.error}: ${data.message || "Please try again"}`;
    }
   
    // Fallback based on status code
    switch (status) {
      case 404:
        return "Asset not found";
      case 400:
        return "Invalid asset data provided";
      case 409:
        return "Asset already exists";
      case 500:
        return "Server error occurred. Please try again later";
      default:
        return `Request failed with status ${status}`;
    }
  }
 
  // Network error or request setup error
  if (error.request) {
    return "Network error: Unable to reach the server. Please check your connection.";
  }
 
  // Something else happened
  return error.message || "An unexpected error occurred";
};
 
// Get all assets
export const getAssets = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    const message = parseErrorMessage(error);
    console.error("Failed to fetch assets:", message);
    throw new Error(message);
  }
};
 
// Create asset
export const createAsset = async (asset) => {
  try {
    const response = await axios.post(BASE_URL, asset);
    return response.data;
  } catch (error) {
    const message = parseErrorMessage(error);
    console.error("Failed to create asset:", message);
    throw new Error(message);
  }
};
 
// Update asset
export const updateAsset = async (asset) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${asset.assetId}`,
      asset
    );
    return response.data;
  } catch (error) {
    const message = parseErrorMessage(error);
    console.error("Failed to update asset:", message);
    throw new Error(message);
  }
};
 
// Delete asset
export const deleteAsset = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    const message = parseErrorMessage(error);
    console.error("Failed to delete asset:", message);
    throw new Error(message);
  }
};
 