import { useState, useEffect } from 'react';
import axios from '../../config/axiosConfig';

export function RecordForm({ onCancel, RecordPlans, setRecordPlans }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({
    asset: '',
    planId: '',
    unit: 'barrels',
    actualVolume: '',
    date: ''
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/production/plans');
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans for dropdown:", error);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (form.planId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/production/plans/${form.planId}`);
          setSelectedPlan(response.data);
        } catch (error) {
          console.error("Error fetching plan details:", error);
          setSelectedPlan(null);
        }
      } else {
        setSelectedPlan(null);
      }
    };
    fetchPlanDetails();
  }, [form.planId]);

  const handleSubmit = async () => {
    const payload = {
      planId: Number(form.planId),
      assetId: 1, 
      actualVolume: Number(form.actualVolume),
      date: form.date
    };

    try {
      const response = await axios.post('http://localhost:8080/api/production/records', payload);
      if (response.status === 200 || response.status === 201) {
        setRecordPlans([response.data, ...RecordPlans]);
        onCancel();
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save record.');
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg md:text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">
        Add Production Record
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Plan Selection */}
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Production Plan
          </label>
          <select
            value={form.planId}
            onChange={(e) => setForm({ ...form, planId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg text-gray-900 focus:border-black focus:ring-0 transition-all appearance-none cursor-pointer text-sm md:text-base"
          >
            <option value="">Select Associated Plan</option>
            {plans.map(p => (
              <option key={p.planId} value={p.planId}>
                Plan {p.planId} - (Vol: {p.plannedVolume})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Production Date
          </label>
          <input
            type="date"
            value={form.date}
            min={selectedPlan?.startDate || undefined}
            max={selectedPlan?.endDate || undefined}
            disabled={!form.planId}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="cursor-pointer w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          />
          {selectedPlan && (
            <p className="text-[10px] md:text-xs text-gray-500 mt-1">
              Valid range: {new Date(selectedPlan.startDate).toLocaleDateString()} - {new Date(selectedPlan.endDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Actual Volume */}
        <div className="md:col-span-1">
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Actual Volume
          </label>
          <input
            type="number"
            placeholder="e.g., 1000.5"
            value={form.actualVolume}
            onChange={(e) => setForm({ ...form, actualVolume: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-black focus:ring-0 transition-all text-sm md:text-base"
          />
        </div>
      </div>

      {/* Buttons: Column-reverse on mobile (Cancel bottom), Row on laptop */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-3 md:gap-4 mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="cursor-pointer w-full md:w-auto px-8 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 active:scale-[0.98] transition-all text-center"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="cursor-pointer w-full md:w-auto px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-200 text-center"
        >
          Add Record
        </button>
      </div>
    </div>
  );
}