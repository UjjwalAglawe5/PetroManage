import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit2, Check, X } from "lucide-react";

export const RecordTable = ({ RecordPlans, setRecordPlans }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 1. Fetch production records on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/production-records');
        setRecordPlans(response.data);
      } catch (error) {
        console.error("Error fetching production records:", error);
      }
    };
    fetchRecords();
  }, [setRecordPlans]);

  // 2. Start Editing - Load row data into local state
  const startEdit = (record) => {
    setEditingId(record.recordId || record.id);
    setEditForm({ ...record });
  };

  // 3. Handle Update (PUT Request)
  const handleUpdate = async (id) => {
    try {
      // Structure the payload to match your Backend Entity requirements
      const payload = {
        ...editForm,
        // Ensure nested objects are preserved or defaulted
        asset: editForm.asset || { assetId: 1 },
        productionPlan: editForm.productionPlan || { planId: 1 }
      };

      const response = await axios.put(`http://localhost:8080/api/production-records/${id}`, payload);
      
      if (response.status === 200 || response.status === 204) {
        const updatedList = RecordPlans.map(r => (r.recordId || r.id) === id ? response.data : r);
        setRecordPlans(updatedList);
        setEditingId(null);
        console.log("Record updated successfully");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update record.");
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        // await axios.delete(`http://localhost:8080/api/production-records/${id}`);
        await axios.delete(`http://localhost:8020/backend/api/production-records/${id}`);
        const updatedRecords = RecordPlans.filter(record => (record.recordId || record.id) !== id);
        setRecordPlans(updatedRecords);
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-200 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {RecordPlans.map((record) => {
          const id = record.recordId || record.id;
          const isEditing = editingId === id;

          return (
            <tr key={id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="text-sm font-medium text-gray-900">{record.asset?.name || "Asset ID 1"}</p>
                  <p className="text-xs text-gray-500">ID: {record.asset?.assetId || 1}</p>
                </div>
              </td>
              
              {/* ACTUAL VOLUME COLUMN (Editable) */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {isEditing ? (
                  <input 
                    type="number"
                    className="border rounded px-2 py-1 w-24 text-sm focus:border-black outline-none"
                    value={editForm.actualVolume}
                    onChange={(e) => setEditForm({...editForm, actualVolume: e.target.value})}
                  />
                ) : (
                  `${record.actualVolume?.toLocaleString()} ${record.unit || 'barrels'}`
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {record.productionPlan?.plannedVolume?.toLocaleString() || "5,000"} 
              </td>

              {/* DATE COLUMN (Editable) */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {isEditing ? (
                  <input 
                    type="date"
                    className="border rounded px-2 py-1 text-sm focus:border-black outline-none"
                    value={editForm.productionDate}
                    onChange={(e) => setEditForm({...editForm, productionDate: e.target.value})}
                  />
                ) : (
                  record.productionDate
                )}
              </td>

              {/* ACTIONS COLUMN */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => handleUpdate(id)} 
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => startEdit(record)} 
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};