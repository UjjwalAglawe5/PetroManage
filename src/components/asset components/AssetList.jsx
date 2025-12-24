// components/module1/AssetList.jsx
import { useState, useMemo } from "react";
import { Search, Edit, Trash2, X } from "lucide-react";
import { getStatusColor, getTypeColor } from "./AssetUtils";

export default function AssetList({ assets, onDelete, onUpdate }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  /* ---------------- FILTERED DATA ---------------- */
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status ? a.status === status : true;
      const matchType = type ? a.type === type : true;

      return matchSearch && matchStatus && matchType;
    });
  }, [assets, search, status, type]);

  /* ---------------- SAVE UPDATE ---------------- */
  const saveUpdate = () => {
    onUpdate(selectedAsset);
    setSelectedAsset(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

        {/* ================= TOOLBAR ================= */}
        <div className="p-5 border-b flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name or location"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-slate-500 focus:outline-none"
            />
          </div>

          {/* Filters + Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredAssets.length}</span> assets
            </span>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="">All Types</option>
              <option value="RIG">RIG</option>
              <option value="PIPELINE">PIPELINE</option>
              <option value="STORAGE">STORAGE</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Under Inspection">Under Inspection</option>
              <option value="Decommissioned">Decommissioned</option>
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

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3 text-left text-gray-500">Asset ID</th>
                <th className="px-5 py-3 text-left text-gray-500">Name</th>
                <th className="px-5 py-3 text-left text-gray-500">Type</th>
                <th className="px-5 py-3 text-left text-gray-500">Location</th>
                <th className="px-5 py-3 text-left text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-gray-500">Last Maintenance</th>
                <th className="px-5 py-3 text-right text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <p className="text-gray-500 text-sm">
                      No assets found for current filters
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try clearing filters or register a new asset
                    </p>
                  </td>
                </tr>
              )}

              {filteredAssets.map((a, i) => (
                <tr
                  key={a.id}
                  className={`group transition-all hover:bg-slate-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  <td className="px-5 py-4 font-medium">{a.id}</td>
                  <td className="px-5 py-4">{a.name}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        a.type
                      )}`}
                    >
                      {a.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">{a.location}</td>

                  {/* INLINE STATUS CHANGE */}
                  <td className="px-5 py-4">
                    <select
                      value={a.status}
                      onChange={(e) =>
                        onUpdate({ ...a, status: e.target.value })
                      }
                      className={`text-xs font-medium rounded-full px-2 py-1 cursor-pointer border-none focus:ring-2 focus:ring-slate-400 ${getStatusColor(
                        a.status
                      )}`}
                    >
                      <option>Operational</option>
                      <option>Maintenance</option>
                      <option>Under Inspection</option>
                      <option>Decommissioned</option>
                    </select>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {a.lastMaintenance || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition">
                      <button
                        title="Edit Asset"
                        onClick={() => setSelectedAsset({ ...a })}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        title="Delete Asset"
                        onClick={() => onDelete(a.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
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
      </div>

      {/* ================= EDIT DRAWER ================= */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full sm:w-[420px] h-full shadow-xl p-6 animate-slide-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold">Update Asset</h3>
              <button onClick={() => setSelectedAsset(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Asset ID</label>
                <input
                  disabled
                  value={selectedAsset.id}
                  className="w-full mt-1 px-3 py-2 border rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <select
                  value={selectedAsset.status}
                  onChange={(e) =>
                    setSelectedAsset({
                      ...selectedAsset,
                      status: e.target.value
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-slate-500"
                >
                  <option>Operational</option>
                  <option>Maintenance</option>
                  <option>Under Inspection</option>
                  <option>Decommissioned</option>
                </select>
              </div>
            </div>

            <div className="absolute bottom-6 right-6">
              <button
                onClick={saveUpdate}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}