// components/module1/AssetUtils.js
 
export const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
 
    case "INACTIVE":
      return "bg-gray-100 text-gray-700";
 
    default:
      return "bg-gray-100 text-gray-800";
  }
};
 
export const getTypeColor = (type) => {
  switch (type) {
    case "RIG":
      return "bg-slate-100 text-slate-800";
 
    case "PIPELINE":
      return "bg-cyan-100 text-cyan-800";
 
    case "STORAGE":
      return "bg-violet-100 text-violet-800";
 
    default:
      return "bg-gray-100 text-gray-800";
  }
};
 
 