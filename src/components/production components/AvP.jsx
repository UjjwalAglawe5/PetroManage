export const AvP = () => {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 overflow-x-auto">
                <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actual vs Planned Production Comparison</h3>
            <div className="space-y-6">
                {[
                    { asset: 'RIG-001', planned: 5000, actual: 5150, date: '2024-01-14' },
                    { asset: 'RIG-002', planned: 4200, actual: 4050, date: '2024-01-14' },
                    { asset: 'RIG-008', planned: 6500, actual: 6420, date: '2024-01-14' }
                ].map((data) => {
                    const maxValue = Math.max(data.planned, data.actual);
                    const plannedPercent = (data.planned / maxValue) * 100;
                    const actualPercent = (data.actual / maxValue) * 100;

                    return (
                        <div key={data.asset}>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{data.asset}</p>
                                    <p className="text-xs text-gray-500">{data.date}</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Planned</p>
                                        <p className="font-bold text-gray-900">{data.planned.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Actual</p>
                                        <p className="font-bold text-gray-900">{data.actual.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Variance</p>
                                        <p className={`font-bold ${data.actual >= data.planned ? 'text-green-600' : 'text-red-600'}`}>
                                            {((data.actual / data.planned - 1) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 h-8">
                                <div className="flex-1 flex items-center">
                                    <div className="w-full bg-blue-500 rounded-l-lg h-full" style={{ width: `${plannedPercent}%` }}>
                                        <span className="text-xs text-white font-medium px-2 py-1 inline-block">Planned</span>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <div className={`h-full rounded-r-lg ${data.actual >= data.planned ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${actualPercent}%` }}>
                                        <span className="text-xs text-white font-medium px-2 py-1 inline-block">Actual</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>)
}

