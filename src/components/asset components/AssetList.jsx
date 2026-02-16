import { useMemo, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";
import Swal from 'sweetalert2';
import { getStatusColor, getTypeColor } from "./AssetUtils";
export default function AssetList({ assets, onDelete, onUpdate }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [originalAsset, setOriginalAsset] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Check if user has edit/delete permissions
  const hasEditPermission = onUpdate !== undefined;
  const hasDeletePermission = onDelete !== undefined;

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
    if (!selectedAsset || !originalAsset) return;

    const isUnchanged =
      selectedAsset.name?.trim() === originalAsset.name?.trim() &&
      selectedAsset.status === originalAsset.status;

    if (isUnchanged) {
      setSelectedAsset(null);
      setOriginalAsset(null);
      return;
    }

    try {
      setUpdating(true);
      setUpdateError(null);
      await onUpdate(selectedAsset);
      setSelectedAsset(null);
      setOriginalAsset(null);

      // Show short toast notification
      const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      toast.fire({
        icon: 'success',
        title: 'Updated successfully'
      });
    } catch (err) {
      // Show error notification with SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || "Failed to update asset",
        confirmButtonColor: '#ef4444',
      });
      setUpdateError(err.message || "Failed to update asset");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        {/* TOOLBAR */}
        <div className="p-4 md:p-5 border-b flex flex-col sm:flex-row gap-3 md:gap-4 justify-between bg-gray-50">
          <div className="relative w-full sm:w-auto sm:flex-1 lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name or location"
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
              Showing <b>{filteredAssets.length}</b> asset{filteredAssets.length !== 1 ? 's' : ''}
            </span>

            <select
              className="cursor-pointer w-full sm:w-auto text-xs md:text-sm px-2 md:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="RIG">RIG</option>
              <option value="PIPELINE">PIPELINE</option>
              <option value="STORAGE">STORAGE</option>
            </select>

            <select
              className="cursor-pointer w-full sm:w-auto text-xs md:text-sm px-2 md:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:outline-none bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setType("");
              }}
              className="cursor-pointer text-xs md:text-sm text-slate-600 hover:text-slate-900 hover:underline px-2 py-1 rounded"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TABLE - Responsive with horizontal scroll on small screens */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 md:px-5 py-3 text-left whitespace-nowrap">#</th>
                <th className="px-3 md:px-5 py-3 text-left whitespace-nowrap">Name</th>
                <th className="px-3 md:px-5 py-3 text-left whitespace-nowrap">Type</th>
                <th className="px-3 md:px-5 py-3 text-left whitespace-nowrap">Location</th>
                <th className="px-3 md:px-5 py-3 text-left whitespace-nowrap">Status</th>
                {(hasEditPermission || hasDeletePermission) && (
                  <th className="px-3 md:px-5 py-3 text-right whitespace-nowrap">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={hasEditPermission || hasDeletePermission ? 6 : 5} className="px-5 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p className="text-sm">No assets found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((a, index) => (
                  <tr
                    key={a.assetId}
                    className="group hover:bg-slate-50 transition"
                  >
                    <td className="px-3 md:px-5 py-3 md:py-4">{index + 1}</td>
                    <td className="px-3 md:px-5 py-3 md:py-4 font-medium">{a.name}</td>

                    <td className="px-3 md:px-5 py-3 md:py-4">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getTypeColor(a.type)}`}>
                        {a.type}
                      </span>
                    </td>

                    <td className="px-3 md:px-5 py-3 md:py-4 max-w-[150px] md:max-w-none truncate" title={a.location}>
                      {a.location}
                    </td>

                    <td className="px-3 md:px-5 py-3 md:py-4">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </td>

                    {/* ACTIONS - Only show if user has permissions */}
                    {(hasEditPermission || hasDeletePermission) && (
                      <td className="px-3 md:px-5 py-3 md:py-4 text-right">
                        <div className="flex justify-end gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                          {hasEditPermission && (
                            <button
                              title="Edit Asset"
                              onClick={() => {
                                setSelectedAsset({ ...a });
                                setOriginalAsset({ ...a });
                              }}
                              className="cursor-pointer p-1.5 md:p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                            >
                              <Edit size={16} />
                            </button>
                          )}

                          {hasDeletePermission && (
                            <button
                              title="Delete Asset"
                              onClick={() => setDeleteTarget(a)}
                              className="cursor-pointer p-1.5 md:p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT DRAWER ================= */}
      {selectedAsset && hasEditPermission && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50 animate-fadeIn">
          <div className="bg-white w-full sm:w-[90%] md:w-[500px] lg:w-[420px] h-full overflow-y-auto p-4 md:p-6 flex flex-col shadow-2xl animate-slideInRight">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h3 className="font-semibold text-base md:text-lg">Update Asset</h3>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setOriginalAsset(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Asset ID</label>
                <input
                  disabled
                  value={selectedAsset.assetId}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Name *</label>
                <input
                  value={selectedAsset.name}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter asset name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Status *</label>
                <select
                  value={selectedAsset.status}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, status: e.target.value })
                  }
                  className="w-full cursor-pointer px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Toggle between ACTIVE (in use) and INACTIVE (not in use)
                </p>
              </div>
            </div>

            {/* ================= UPDATE ERROR MESSAGE ================= */}
            {updateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-800">Update Failed</p>
                <p className="text-xs text-red-600 mt-1">{updateError}</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t space-y-2">
              <button
                onClick={saveUpdate}
                disabled={updating}
                className={`cursor-pointer w-full px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all
                  ${updating
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
                  }`}
              >
                {updating
                  ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </span>
                  )
                  : "Save Changes"
                }
              </button>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setOriginalAsset(null);
                }}
                disabled={updating}
                className="cursor-pointer w-full px-6 py-2 rounded-lg font-medium text-sm border hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteTarget && hasDeletePermission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-[400px] shadow-2xl animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">Delete Asset</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{deleteTarget.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const assetName = deleteTarget.name;
                  setDeleteTarget(null);

                  try {
                    await onDelete(deleteTarget.assetId);

                    // Show short toast notification
                    const toast = Swal.mixin({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 2000,
                      timerProgressBar: true,
                    });

                    toast.fire({
                      icon: 'success',
                      title: 'Deleted successfully'
                    });
                  } catch (err) {
                    // Show error notification if delete fails
                    await Swal.fire({
                      icon: 'error',
                      title: 'Delete Failed',
                      text: err.message || 'Failed to delete asset',
                      confirmButtonColor: '#ef4444',
                    });
                  }
                }}
                className="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition"
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
