import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit2, Check, X } from "lucide-react";

export const PlansTable = ({ productionPlans, setProductionPlans }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 1. Fetch data
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/production-plans');
        setProductionPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, [setProductionPlans]);

  // 2. Start Editing - Load row data into local state
  const startEdit = (plan) => {
    setEditingId(plan.planId);
    setEditForm({ ...plan });
  };

  // 3. Handle Update (PUT Request)
  const handleUpdate = async (id) => {
    try {
      // Structure the payload to match your Backend Entity
      const payload = {
        ...editForm,
        asset: { assetId: 1 } // Keeping assetId=1 as requested
      };

      const response = await axios.put(`http://localhost:8080/api/production-plans/${id}`, payload);
      
      if (response.status === 200 || response.status === 204) {
        // Update the local list with the returned data from server
        const updatedList = productionPlans.map(p => p.planId === id ? response.data : p);
        setProductionPlans(updatedList);
        setEditingId(null); // Exit edit mode
        console.log("Plan updated successfully");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update plan.");
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:8080/api/production-plans/${id}`);
        setProductionPlans(productionPlans.filter(p => p.planId !== id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-200 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {productionPlans.map((plan) => (
          <tr key={plan.planId} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{plan.planId}</td>
            
            {/* ASSET COLUMN */}
            <td className="px-6 py-4">
              <p className="text-sm font-medium">{plan.asset?.name || 'N/A'}</p>
            </td>

            {/* VOLUME COLUMN (Editable) */}
            <td className="px-6 py-4">
              {editingId === plan.planId ? (
                <input 
                  type="number"
                  className="border rounded px-2 py-1 w-24 text-sm"
                  value={editForm.plannedVolume}
                  onChange={(e) => setEditForm({...editForm, plannedVolume: e.target.value})}
                />
              ) : (
                <span className="text-sm">{plan.plannedVolume?.toLocaleString()}</span>
              )}
            </td>

            {/* PERIOD COLUMN */}
            <td className="px-6 py-4 text-sm text-gray-600">
              {editingId === plan.planId ? (
                <div className="flex flex-col gap-1">
                  <input type="date" className="text-xs border rounded" value={editForm.startDate} onChange={(e) => setEditForm({...editForm, startDate: e.target.value})} />
                  <input type="date" className="text-xs border rounded" value={editForm.endDate} onChange={(e) => setEditForm({...editForm, endDate: e.target.value})} />
                </div>
              ) : (
                `${plan.startDate} to ${plan.endDate}`
              )}
            </td>

            {/* STATUS COLUMN (Editable) */}
            <td className="px-6 py-4">
              {editingId === plan.planId ? (
                <select 
                  className="text-xs border rounded p-1"
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="PLANNED">PLANNED</option>
                  <option value="ACTIVE">ACTIVE</option>
                </select>
              ) : (
                <span className={`px-2 py-1 rounded text-xs font-medium ${plan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {plan.status}
                </span>
              )}
            </td>

            {/* ACTIONS COLUMN */}
            <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
              {editingId === plan.planId ? (
                <>
                  <button onClick={() => handleUpdate(plan.planId)} className="text-green-600 hover:text-green-900"><Check size={18} /></button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(plan)} className="text-indigo-600 hover:text-indigo-900"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(plan.planId)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};