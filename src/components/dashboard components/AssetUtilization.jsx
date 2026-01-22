 
const statusColors = {
  operational: 'bg-green-100 text-green-700 border-green-200',
  maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
  idle: 'bg-slate-100 text-slate-700 border-slate-200',
};
 
const utilizationColor = (utilization) => {
  if (utilization >= 80) return 'bg-green-500';
  if (utilization >= 60) return 'bg-blue-500';
  if (utilization >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};
 
export default function AssetUtilization({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Asset Utilization</h2>
        <p className="text-sm text-slate-500">Current equipment status</p>
      </div>
 
      <div className="space-y-4">
        {data.map((asset) => (
          <div key={asset.id} className="group hover:bg-slate-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center justify-between mb-2">
              {/* Left column: name and status stacked */}
              <div className="flex-1">
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-slate-900 text-sm">{asset.name}</h3>
 
                  {/* Status pill — fixed size, centered */}
                  <span
                    className={[
                      'inline-flex items-center justify-center',
                      'w-24 h-8',               // same size for all statuses
                      'rounded-full border',
                      'text-xs font-medium',
                      statusColors[asset.status],
                    ].join(' ')}
                  >
                    {asset.status}
                  </span>
                </div>
              </div>
 
              {/* Right column: utilization value */}
              <span className="text-lg font-bold text-slate-900">{asset.utilization}%</span>
            </div>
 
            {/* Utilization bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${utilizationColor(asset.utilization)}`}
                style={{ width: `${asset.utilization}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}