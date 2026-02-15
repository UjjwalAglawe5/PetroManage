import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import axios from '../../config/axiosConfig';

export default function PlannedVsActualChart({ productionPlans = [] }) {
  // 1. Local state for selected ID and the records we fetch
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set initial selected ID when productionPlans load
  useEffect(() => {
    if (productionPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(productionPlans[0].planId);
    }
  }, [productionPlans]);

  // 2. The API Trigger: Runs whenever selectedPlanId changes
  useEffect(() => {
    const fetchPlanRecords = async () => {
      if (!selectedPlanId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/production/records/plan/${selectedPlanId}`);
        setFetchedRecords(response.data);
      } catch (error) {
        console.error("Error fetching records for plan:", error);
        setFetchedRecords([]); // Reset on error
      } finally {
        setLoading(false);
      }
    };

    fetchPlanRecords();
  }, [selectedPlanId]);

  // 3. Prepare data for the chart
  const chartData = useMemo(() => {
    return fetchedRecords.map(r => ({
      date: r.date,
      planned: r.dailyPlannedTarget, // Using the new field from your backend
      actual: r.actualVolume
    }));
  }, [fetchedRecords]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Planned vs Actual Production
      </h3>

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          Select Plan
        </label>
        <select
          value={selectedPlanId}
          onChange={e => setSelectedPlanId(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-black focus:ring-0 appearance-none cursor-pointer"
        >
          <option value="">Choose a Plan</option>
          {productionPlans.map(plan => (
            <option key={plan.planId} value={plan.planId}>
              Plan {plan.planId} - {plan.assetName || 'Asset ' + plan.assetId}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-[320px] flex items-center justify-center text-gray-400">
          Loading chart data...
        </div>
      ) : fetchedRecords.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{fontSize: 12}} 
              dy={10}
            />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Planned Line */}
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="Daily Target"
            />
            
            {/* Actual Line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4, fill: "#16a34a" }}
              activeDot={{ r: 6 }}
              name="Actual Production"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[320px] flex items-center justify-center text-gray-400 italic border-2 border-dashed border-gray-50 rounded-lg">
          No records found for this plan.
        </div>
      )}
    </div>
  );
}