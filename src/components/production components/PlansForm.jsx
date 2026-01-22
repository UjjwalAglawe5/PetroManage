import { useState } from 'react';
import axios from 'axios'; // 1. Import Axios

export function PlansForm({ onCancel, setProductionPlans, productionPlans }) {
  const assetList = [
    { id: 'RIG-001', name: 'North Sea Rig Alpha' },
    { id: 'RIG-002', name: 'West Texas Rig Beta' },
    { id: 'RIG-008', name: 'Gulf Platform Echo' },
    { id: 'STG-012', name: 'Storage Facility B' },
  ];

  const [form, setForm] = useState({
    asset: '',
    unit: 'barrels/day',
    plannedVolume: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED'
  });

  const handleSubmit = async () => {
    // 2. Prepare the payload
    const payload = {
      asset: {
        assetId: 1 // Hardcoded as requested
      },
      plannedVolume: Number(form.plannedVolume),
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status.toUpperCase()
    };

    try {
      // 3. Send the POST request using Axios
      // Axios handles headers and JSON conversion automatically
      const response = await axios.post('http://localhost:8080/api/production-plans', payload);

      // 4. Axios stores the server response in the 'data' property
      if (response.status === 200 || response.status === 201) {
        const savedPlan = response.data;
        
        // Update local state
        setProductionPlans([...productionPlans, savedPlan]);
        
        console.log('Plan created successfully:', savedPlan);
        onCancel(); 
      }
    } catch (error) {
      // 5. Axios error handling provides detailed feedback
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Backend Error:', error.response.data);
        alert(`Server Error: ${error.response.data.message || 'Check logs'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error:', error.request);
        alert('Could not reach the server. Is it running?');
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">
        Create Production Plan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Asset Selection</label>
          <select
            value={form.asset}
            onChange={(e) => setForm({ ...form, asset: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none cursor-pointer"
          >
            <option value="">Select Asset</option>
            {assetList.map(asset => (
              <option key={asset.id} value={asset.id}>{asset.id} - {asset.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none cursor-pointer"
          >
            <option value="PLANNED">Planned</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Planned Volume</label>
          <input
            type="number"
            value={form.plannedVolume}
            onChange={(e) => setForm({ ...form, plannedVolume: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Unit</label>
          <select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none"
          >
            <option value="barrels/day">Barrels per Day</option>
            <option value="barrels">Barrels</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
        <button onClick={handleSubmit} className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
          Create Plan
        </button>
        <button onClick={onCancel} className="px-8 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
}