import { useEffect, useState } from "react";
import axios from '../../config/axiosConfig';
import { Trash2, Edit2, Check, X } from "lucide-react";

export const PlansTable = ({ productionPlans, setProductionPlans }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log(productionPlans);
        
        const response = await axios.get('http://localhost:8080/api/production/plans');
        console.log("This");
        console.log(response.data);
        
        setProductionPlans(response.data);
        
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, [setProductionPlans]);

  
  const startEdit = (plan) => {
    setEditingId(plan.planId);
    setEditForm({ ...plan });
  };

  
  const handleUpdate = async (id) => {
    try {
      
      // const payload = {
      //   ...editForm,
      //   asset: { assetId: 1 } 
      // };
      const payload = {
        planId: editForm.planId,
        assetId: editForm.assetId || (editForm.assetDetails && editForm.assetDetails.assetId),
        plannedVolume: Number(editForm.plannedVolume),
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        status: editForm.status
      };

      const response = await axios.put(`http://localhost:8080/api/production/plans/${id}`, payload);
      
      if (response.status === 200 || response.status === 204) {
        
        const updatedList = productionPlans.map(p => p.planId === id ? response.data : p);
        setProductionPlans(updatedList);
        setEditingId(null); 
        console.log("Plan updated successfully");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update plan.");
    }
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:8080/api/production/plans/${id}`);
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
        {productionPlans.map((plan, index) => (
            <tr key={plan.planId || index} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{plan.planId}</td>
            
            
            <td className="px-6 py-4">
          <p className="text-sm font-medium">{plan.assetDetails?.name || 'N/A'}</p>            </td>

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
                  <input type="date" className="cursor-pointer text-xs border rounded" value={editForm.startDate} onChange={(e) => setEditForm({...editForm, startDate: e.target.value})} />
                  <input type="date" className="cursor-pointer text-xs border rounded" value={editForm.endDate} onChange={(e) => setEditForm({...editForm, endDate: e.target.value})} />
                </div>
              ) : (
                `${plan.startDate} to ${plan.endDate}`
              )}
            </td>

            {/* STATUS COLUMN (Editable) */}
            <td className="px-6 py-4">
              {editingId === plan.planId ? (
                <select 
                  className="cursor-pointer text-xs border rounded p-1"
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
                  <button onClick={() => handleUpdate(plan.planId)} className="cursor-pointer text-green-600 hover:text-green-900"><Check size={18} /></button>
                  <button onClick={() => setEditingId(null)} className="cursor-pointer text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(plan)} className="cursor-pointer text-indigo-600 hover:text-indigo-900"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(plan.planId)} className="cursor-pointer text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};