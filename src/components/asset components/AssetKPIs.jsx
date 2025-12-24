// components/module1/AssetKPIs.jsx
import {
  Factory,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  Ban,
  Drill,
  GitBranch,
  Warehouse
} from "lucide-react";

export default function AssetKPIs({ assets }) {
  const count = (fn) => assets.filter(fn).length;

  const kpis = [
    {
      title: "Total Assets",
      value: assets.length,
      icon: Factory,
      color: "from-slate-700 to-slate-900"
    },
    {
      title: "Operational",
      value: count(a => a.status === "Operational"),
      icon: AlertTriangle,
      color: "from-green-500 to-green-700"
    },
    {
      title: "Maintenance",
      value: count(a => a.status === "Maintenance"),
      icon: Wrench,
      color: "from-amber-500 to-amber-700"
    },
    {
      title: "Under Inspection",
      value: count(a => a.status === "Under Inspection"),
      icon: ShieldAlert,
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Decommissioned",
      value: count(a => a.status === "Decommissioned"),
      icon: Ban,
      color: "from-red-500 to-red-700"
    },
    {
      title: "Rigs",
      value: count(a => a.type === "RIG"),
      icon: Drill,
      color: "from-slate-500 to-slate-700"
    },
    {
      title: "Pipelines",
      value: count(a => a.type === "PIPELINE"),
      icon: GitBranch,
      color: "from-cyan-500 to-cyan-700"
    },
    {
      title: "Storage Units",
      value: count(a => a.type === "STORAGE"),
      icon: Warehouse,
      color: "from-violet-500 to-violet-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}

/* ---------------- KPI CARD ---------------- */
function KpiCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm
                 p-5 flex items-center gap-4
                 hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div
        className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}
      >
        <Icon className="w-7 h-7" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
