import { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';

export function PlansForm({ onCancel, setProductionPlans, productionPlans }) {
  const [assetList, setAssetList] = useState([]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/assets');
      
      const activeAssets = response.data.filter(asset => asset.status === 'ACTIVE');
      setAssetList(activeAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const [form, setForm] = useState({
    asset: '',
    unit: 'barrels/day',
    plannedVolume: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED'
  });

  const handleSubmit = async () => {
    const payload = {
      assetId: Number(form.asset),
      plannedVolume: Number(form.plannedVolume),
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status.toUpperCase()
    };

    try {
      const response = await axios.post('http://localhost:8080/api/production/plans', payload);
      if (response.status === 200 || response.status === 201) {
        const savedPlan = response.data;
        setProductionPlans([...productionPlans, savedPlan]);
        onCancel(); 
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error creating plan. Please check console.');
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg md:text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">
        Create Production Plan
      </h3>

      {/* Grid: 1 column on mobile, 2 on md (laptop) screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Asset Selection</label>
          <select
            value={form.asset}
            onChange={(e) => setForm({ ...form, asset: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none cursor-pointer text-sm md:text-base"
          >
            <option value="">Select Asset</option>
            {assetList.map(asset => (
              <option key={asset.assetId} value={asset.assetId}>{asset.assetId} - {asset.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none cursor-pointer text-sm md:text-base"
          >
            <option value="PLANNED">Planned</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Planned Volume</label>
          <input
            type="number"
            value={form.plannedVolume}
            onChange={(e) => setForm({ ...form, plannedVolume: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 text-sm md:text-base"
          />
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="cursor-pointer w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 text-sm md:text-base"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">End Date</label>
          <input
            type="date"
            value={form.endDate}
            min={form.startDate || undefined}
            disabled={!form.startDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="cursor-pointer w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {!form.startDate && (
            <p className="text-xs text-amber-600 mt-1">Please select start date first</p>
          )}
        </div>
      </div>

      {/* Buttons: Column on mobile, Row on laptop */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-3 md:gap-4 mt-8 pt-6 border-t border-gray-100">
        <button 
          onClick={onCancel} 
          className="w-full md:w-auto cursor-pointer px-8 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 transition-all text-center"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="w-full md:w-auto cursor-pointer px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 text-center"
        >
          Create Plan
        </button>
      </div>
    </div>
  );
}