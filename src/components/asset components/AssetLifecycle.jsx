import { Activity, Power, PowerOff } from "lucide-react";
 
export default function AssetLifecycle({ assets = [] }) {
  if (!assets.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Activity className="mx-auto w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm">No assets available to display lifecycle</p>
      </div>
    );
  }
 
  // Group assets by status
  const activeAssets = assets.filter(a => a.status === "ACTIVE");
  const inactiveAssets = assets.filter(a => a.status === "INACTIVE");
 
  return (
    <div className="space-y-6">
     
      {/* Active Assets Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Power className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">
              Active Assets ({activeAssets.length})
            </h3>
            <p className="text-sm text-green-700">Currently in operation</p>
          </div>
        </div>
 
        {activeAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeAssets.map((asset) => (
              <AssetCard key={asset.assetId} asset={asset} status="ACTIVE" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-600 text-center py-4">No active assets</p>
        )}
      </div>
 
      {/* Inactive Assets Section */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-300 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="bg-gray-500 p-3 rounded-lg">
            <PowerOff className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Inactive Assets ({inactiveAssets.length})
            </h3>
            <p className="text-sm text-gray-700">Not currently in use</p>
          </div>
        </div>
 
        {inactiveAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {inactiveAssets.map((asset) => (
              <AssetCard key={asset.assetId} asset={asset} status="INACTIVE" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center py-4">No inactive assets</p>
        )}
      </div>
    </div>
  );
}
 
/* ================= ASSET CARD ================= */
function AssetCard({ asset, status }) {
  return (
    <div className={`bg-white rounded-lg p-4 border-2 transition-all hover:shadow-md min-w-0 ${
      status === "ACTIVE"
        ? "border-green-200 hover:border-green-300"
        : "border-gray-300 hover:border-gray-400"
    }`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 break-words text-sm sm:text-base">
            {asset.name}
          </h4>
          <p className="text-xs text-gray-500">{asset.assetId}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          status === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-700"
        }`}>
          {status === "ACTIVE" ? "✓ Active" : "○ Inactive"}
        </span>
      </div>
     
      <div className="space-y-1 text-sm">
        <div className="flex flex-wrap items-center gap-2 text-gray-600">
          <span className="font-medium">Type:</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{asset.type}</span>
        </div>
        <div className="flex flex-wrap items-start gap-2 text-gray-600">
          <span className="font-medium">Location:</span>
          <span className="text-gray-700 break-words">{asset.location}</span>
        </div>
      </div>
    </div>
  );
}
 
 