// components/module1/AssetLifecycle.jsx
import { useState } from "react";
import {
  CheckCircle,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const STATUS_ORDER = [
  "Registered",
  "Operational",
  "Maintenance",
  "Under Inspection",
  "Decommissioned"
];

export default function AssetLifecycle({ assets }) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Activity className="mx-auto w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm">
          No assets available to display lifecycle
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {assets.map((asset) => (
        <LifecycleCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}

/* ================= SINGLE ASSET CARD ================= */

function LifecycleCard({ asset }) {
  const [open, setOpen] = useState(true);

  const currentIndex = STATUS_ORDER.indexOf(asset.status);
  const progress = Math.round(
    ((currentIndex + 1) / STATUS_ORDER.length) * 100
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl
                    shadow-sm hover:shadow-lg transition">

      {/* ================= HEADER ================= */}
      <div className="p-6 flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {asset.name}
          </h3>
          <p className="text-sm text-gray-500">
            {asset.id} · {asset.type} · {asset.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium
              ${
                asset.status === "Operational"
                  ? "bg-green-100 text-green-700"
                  : asset.status === "Maintenance"
                  ? "bg-amber-100 text-amber-700"
                  : asset.status === "Under Inspection"
                  ? "bg-blue-100 text-blue-700"
                  : asset.status === "Decommissioned"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {asset.status}
          </span>

          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {open ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* ================= PROGRESS BAR ================= */}
      <div className="px-6 pb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Lifecycle Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ================= TIMELINE ================= */}
      {open && (
        <div className="px-6 pb-6 mt-4 overflow-x-auto">
          <div className="flex items-center min-w-max gap-8">

            {STATUS_ORDER.map((status, i) => {
              const isCompleted = i < currentIndex;
              const isCurrent = i === currentIndex;

              return (
                <div key={status} className="flex items-center gap-4">
                  {/* STEP */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center
                        border-2 transition
                        ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isCurrent
                            ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                      title={status}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isCurrent ? (
                        <Activity className="w-6 h-6" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>

                    <span
                      className={`mt-2 text-xs font-medium whitespace-nowrap
                        ${
                          isCompleted
                            ? "text-green-600"
                            : isCurrent
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* CONNECTOR */}
                  {i < STATUS_ORDER.length - 1 && (
                    <div
                      className={`w-16 h-1 rounded-full
                        ${
                          isCompleted
                            ? "bg-green-400"
                            : "bg-gray-200"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ================= META INFO ================= */}
          {/* <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            Last updated:
            <span className="font-medium">
              {asset.updatedAt || "Not available"}
            </span>
          </div> */}
        </div>
      )}
    </div>
  );
}