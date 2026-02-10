import React, { useState, useEffect } from 'react';
import axios from 'axios';

const today = new Date().toISOString().split('T')[0];

// Main Modal Component
export const CreateWorkOrderModal = ({ onClose, onSave }) => {
  const [assets, setAssets] = useState([]); 
  const [formData, setFormData] = useState({
    assetId: "",
    description: "",
    type: "",
    date: "",
    technicianName: "", // Backend expects an ID, not a name
    priority: "",
    status: "Scheduled"
  });

    const TECHNICIANS = [
   "Suresh Raina", 
    "Ravi Singh", 
    "Amit Sharma", 
    "Sushma Singh", 
    "Amrita Gupta"
  ];

  const [loadingAssets, setLoadingAssets] = useState(true);
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // You might need a GET /api/assets endpoint in your backend
        // For now, if that's not ready, you can use temporary real IDs
        setLoadingAssets(true);
        
        const response = await axios.get("http://localhost:8080/api/assets"); 
        setAssets(response.data);
      } catch (err) {
      console.error("Critical Error: Could not load real assets from database.");
      setAssets([]); 
      } finally {
      setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.assetId || !formData.description || !formData.technicianName) return alert("Please fill in all required fields");

    try {
      // 2. Map frontend state to Backend RequestDTO format
      const payload = {
        assetId: Number(formData.assetId),
        description: formData.description,
        maintenanceType: formData.type ? formData.type.toUpperCase() : "PREVENTIVE", // Backend expects enum (PREVENTIVE)
        scheduledDate: formData.date || new Date().toISOString().split('T')[0],
        priority: formData.priority ? formData.priority.toUpperCase() : "MEDIUM",
        technicianName: formData.technicianName 
      };
      console.log(payload);
      
      const response = await axios.post("http://localhost:8080/api/maintenance/work-orders", payload);
      
      onSave(response.data); // Notify Maintenance.jsx to refresh table
      onClose(); 
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving to database. Check console.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-5 transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Create Work Order</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Row 1: Asset Dropdown (Dynamic) */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-gray-700">Select Asset</label>
          <select 
            required
            disabled={loadingAssets} // Disable while loading
            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            onChange={(e) => setFormData({...formData, assetId: e.target.value})}
            value={formData.assetId}
          >
            <option value="">-- Choose an Asset --</option>
            {assets.map(asset => (
              <option key={asset.assetId} value={asset.assetId}>
                {asset.name} (ID: {asset.assetId})
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: Description */}
        <Input
          label="Description"
          placeholder="e.g. Routine pressure inspection"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        {/* Row 3: Maintenance Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Maintenance Type"
            options={["Preventive", "Corrective"]}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          />
          <Input label="Scheduled Date" type="date" min={today}
          onChange={(e) => setFormData({...formData, date: e.target.value})} />
        </div>

        {/* Row 4: Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Priority" 
            options={["Low", "Medium", "High"]} 
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          />
        

        {/* Technician Dropdown */}
<div className="flex flex-col space-y-1">
  <label className="text-sm font-semibold text-gray-700">Assign Technician</label>
  <select 
    required
    className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
    onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
    value={formData.technicianName}
  >
    <option value="">-- Select Technician --</option>
    {TECHNICIANS.map(name => (
      <option key={name} value={name}>{name}</option>
    ))}
  </select>
</div>
</div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-lg shadow-lg font-medium">
            Save to Database
          </button>
        </div>
      </form>
    </div>
  );
};

// --- HELPER COMPONENTS (Keep as they are) ---
const Input = ({ label, placeholder, type = "text", onChange, min }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      min={min}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition text-gray-800 bg-gray-50"
    />
  </div>
);

const Select = ({ label, options, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <select 
      defaultValue="" 
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition text-gray-800 bg-gray-50 cursor-pointer"
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);