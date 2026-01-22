import { useState, useEffect } from 'react';
import axios from 'axios';

export function RecordForm({ onCancel, RecordPlans, setRecordPlans }) {
  const [plans, setPlans] = useState([]); // To store plans from GET request
  const [form, setForm] = useState({
    asset: '',
    planId: '', // New field for dropdown
    unit: 'barrels',
    actualVolume: '',
    date: ''
  });

  // 1. Fetch Plans from backend on mount for the dropdown
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/production-plans');
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans for dropdown:", error);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async () => {
    // 2. Prepare Payload matching your specific structure
    const payload = {
      productionPlan: {
        planId: Number(form.planId)
      },
      asset: {
        assetId: 1 // Static as requested
      },
      actualVolume: Number(form.actualVolume),
      productionDate: form.date
    };

    try {
      // 3. POST request to create production record
      const response = await axios.post('http://localhost:8080/api/production-records', payload);
      
      if (response.status === 200 || response.status === 201) {
        // Update local UI state
        setRecordPlans([response.data, ...RecordPlans]);
        console.log('Record created successfully:', response.data);
        onCancel(); 
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save record. Ensure the backend is running and CORS is enabled.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">
        Add Production Record
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Plan Selection Dropdown (NEW) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Production Plan
          </label>
          <select
            value={form.planId}
            onChange={(e) => setForm({ ...form, planId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg text-gray-900 focus:border-black focus:ring-0 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Associated Plan</option>
            {plans.map(p => (
              <option key={p.planId} value={p.planId}>
                Plan #{p.planId} - (Vol: {p.plannedVolume})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Production Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 transition-all"
          />
        </div>

        {/* Actual Volume */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Actual Volume
          </label>
          <input
            type="number"
            placeholder="e.g., 1000.5"
            value={form.actualVolume}
            onChange={(e) => setForm({ ...form, actualVolume: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 transition-all"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Unit
          </label>
          <select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none cursor-pointer"
          >
            <option value="barrels">Barrels</option>
            <option value="mcf">MCF (Natural Gas)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          className="flex-1 md:flex-none px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
        >
          Add Record
        </button>
        <button
          onClick={onCancel}
          className="flex-1 md:flex-none px-8 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}