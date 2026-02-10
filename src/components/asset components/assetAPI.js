import axios from "axios";

const BASE_URL = "http://localhost:8080/api/assets";

// Get all assets
export const getAssets = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Create asset
export const createAsset = async (asset) => {
  const response = await axios.post(BASE_URL, asset);
  return response.data;
};

// ✅ Update asset (FIXED)
export const updateAsset = async (asset) => {
  const response = await axios.put(
    `${BASE_URL}/${asset.assetId}`,
    asset
  );
  return response.data;
};

// Delete asset
export const deleteAsset = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
