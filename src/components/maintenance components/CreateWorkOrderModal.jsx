import React,{ useState} from 'react';

// Main Modal Component
export const CreateWorkOrderModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    assetId: "",
    description: "",
    type: "",
    date: "",
    technician: "",
    priority: "",
    status: "Scheduled" // New orders start as Scheduled
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.id || !formData.assetId) return alert("Please fill ID and Asset");
    onSave(formData); // Send data to Maintanance.jsx
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-5 transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Create Work Order</h2>
          <button type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Row 1: ID and Asset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Work Order ID" placeholder="e.g. WO-000" 
          onChange={(e) => setFormData({...formData, id: e.target.value})}/>
          <Select 
            label="Asset" 
            options={["Rig", "Pipeline", "Storage"]} 
            onChange={(e) => setFormData({...formData, assetId: e.target.value})}
          />
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
          <Input label="Scheduled Date" type="date"
          onChange={(e) => setFormData({...formData, date: e.target.value})} />
        </div>

        {/* Row 4: Technician and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Assign Technician"
            placeholder="e.g. Ravi Singh"
            onChange={(e) => setFormData({...formData, technician: e.target.value})}
          />
          <Select 
            label="Priority" 
            options={["Low", "Medium", "High"]} 
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button type="submit"
            className="px-5 py-2 bg-orange-800 hover:bg-orange-900 text-white rounded-lg shadow-lg transition-all font-medium active:scale-95"
          >
            Save Work Order
          </button>
        </div>
      </form>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const Input = ({ label, placeholder, type = "text", disabled ,onChange}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-800 bg-gray-50"
    />
  </div>
);

const Select = ({ label, options, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <select 
      defaultValue="" 
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-800 bg-gray-50 cursor-pointer"
    >
      
      <option value="" disabled>Select {label}</option>
      
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);