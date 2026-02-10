
import { useMemo, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";
import { getStatusColor, getTypeColor } from "./AssetUtils";

export default function AssetList({ assets, onDelete, onUpdate }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  /* ---------------- FILTER ---------------- */
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase()) ||
        a.assetId.toString().includes(search);

      const matchStatus = status ? a.status === status : true;
      const matchType = type ? a.type === type : true;

      return matchSearch && matchStatus && matchType;
    });
  }, [assets, search, status, type]);

  /* ---------------- SAVE UPDATE ---------------- */
  const saveUpdate = async () => {
    try {
      setUpdating(true);
      setUpdateError(null);
      await onUpdate(selectedAsset);
      setSelectedAsset(null);
    } catch (err) {
      setUpdateError(err.message || "Failed to update asset");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        {/* TOOLBAR */}
        <div className="p-5 border-b flex flex-col lg:flex-row gap-4 justify-between bg-gray-50">
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name or location"
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">
              Showing <b>{filteredAssets.length}</b> assets
            </span>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All Types</option>
              <option value="RIG">RIG</option>
              <option value="PIPELINE">PIPELINE</option>
              <option value="STORAGE">STORAGE</option>
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="REGISTERED">REGISTERED</option>
              <option value="OPERATIONAL">OPERATIONAL</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="UNDER_INSPECTION">UNDER INSPECTION</option>
              <option value="DECOMMISSIONED">DECOMMISSIONED</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setType("");
              }}
              className="text-sm text-slate-600 hover:underline"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Location</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredAssets.map((a, index) => (
              <tr
                key={a.assetId}
                className="group hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4">{index + 1}</td>
                <td className="px-5 py-4 font-medium">{a.name}</td>

                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(a.type)}`}>
                    {a.type}
                  </span>
                </td>

                <td className="px-5 py-4">{a.location}</td>

                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(a.status)}`}>
                    {a.status.replace("_", " ")
}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      title="Edit Asset"
                      onClick={() => setSelectedAsset({ ...a })}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      title={
                        a.status === "DECOMMISSIONED"
                          ? "Cannot delete decommissioned asset"
                          : "Delete Asset"
                      }
                      disabled={a.status === "DECOMMISSIONED"}
                      onClick={() => setDeleteTarget(a)}
                      className={`p-2 rounded-lg ${
                        a.status === "DECOMMISSIONED"
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-red-50 text-red-600"
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT DRAWER ================= */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-[420px] p-6 flex flex-col">
            <div className="flex justify-between mb-4 border-b pb-3">
              <h3 className="font-semibold text-lg">Update Asset</h3>
              <button onClick={() => setSelectedAsset(null)}>
                <X size={18} />
              </button>
            </div>

            <label className="text-xs text-gray-500">Asset ID</label>
            <input
              disabled
              value={selectedAsset.assetId}
              className="mb-3 px-3 py-2 border rounded bg-gray-100"
            />

            <label className="text-xs text-gray-500">Name</label>
            <input
              value={selectedAsset.name}
              onChange={(e) =>
                setSelectedAsset({ ...selectedAsset, name: e.target.value })
              }
              className="mb-3 px-3 py-2 border rounded"
            />

            <label className="text-xs text-gray-500">Status</label>
            <select
              value={selectedAsset.status}
              onChange={(e) =>
                setSelectedAsset({ ...selectedAsset, status: e.target.value })
              }
              className="mb-6 px-3 py-2 border rounded"
            >
              <option value="REGISTERED">REGISTERED</option>
              <option value="OPERATIONAL">OPERATIONAL</option>
              {/* <option value="MAINTENANCE">MAINTENANCE</option> */}
              <option value="UNDER_INSPECTION">UNDER INSPECTION</option>
              <option value="DECOMMISSIONED">DECOMMISSIONED</option>
            </select>

            {/* ================= UPDATE ERROR MESSAGE ================= */}
            {updateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-800">Update Failed</p>
                <p className="text-xs text-red-600 mt-1">{updateError}</p>
              </div>
            )}

            <div className="mt-auto">
              <button
                onClick={saveUpdate}
                disabled={updating}
                className={`w-full px-6 py-2 rounded-lg font-medium transition-all
                  ${updating 
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                    : "bg-slate-800 text-white hover:bg-slate-700"
                  }`}
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[380px]">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" />
              <h3 className="font-semibold">Delete Asset</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <b>{deleteTarget.name}</b>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteTarget.assetId);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
