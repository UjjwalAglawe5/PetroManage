// components/module1/AssetUtils.js

export const STORAGE_KEY = "petromanage_assets";

export const loadAssets = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAssets = (assets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
};

export const getStatusColor = (status) => {
  switch (status) {
    case "OPERATIONAL": return "bg-green-100 text-green-800";
    case "MAINTENANCE": return "bg-amber-100 text-amber-800";
    case "UNDER INSPECTION ": return "bg-blue-100 text-blue-800";
    case "DECOMMISSIONED ": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getTypeColor = (type) => {
  switch (type) {
    case "RIG": return "bg-slate-100 text-slate-800";
    case "PIPELINE": return "bg-cyan-100 text-cyan-800";
    case "STORAGE": return "bg-violet-100 text-violet-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
