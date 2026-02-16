import React, { useState } from 'react';
import { Search, ChevronDown, XCircle } from 'lucide-react';

const technicians = ["Suresh Raina", "Ravi Singh", "Amit Sharma", "Meera Nair", "Vikram Seth"];

export const FilterBar = ({ onFilterChange }) => {
  const initialState = { workId: '', assetType: '', type: '', priority: '', technician: '' };
  const [filters, setFilters] = useState(initialState);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters); // Sends data to Maintenance.jsx
  };

  const clearAll = () => {
    setFilters(initialState);
    onFilterChange(initialState);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
      {/* 1. Work ID */}
      <div className="flex-1 min-w-[150px]">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Work Order ID</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer" />
          <input 
            type="text" value={filters.workId}
            onChange={(e) => updateFilter('workId', e.target.value)}
            placeholder="Search ID..."
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* 2. Asset Type */}
      <div className="w-40">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Asset</label>
        <select value={filters.assetType} onChange={(e) => updateFilter('assetType', e.target.value)}
          className="w-full p-2 border rounded-md text-sm outline-none cursor-pointer">
          <option value="">All Assets</option>
          <option value="rig">Rig</option>
          <option value="pipeline">Pipeline</option>
          <option value="storage">Storage</option>
        </select>
      </div>

      {/* 3. Type */}
      <div className="w-40">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Work Type</label>
        <select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}
          className="w-full p-2 border rounded-md text-sm outline-none cursor-pointer">
          <option value="">ALL TYPES</option>
          <option value="PREVENTIVE">PREVENTIVE</option>
          <option value="CORRECTIVE">CORRECTIVE</option>
        </select>
      </div>

      {/* 4. Priority */}
      <div className="w-32">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Priority</label>
        <select value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)}
          className="w-full p-2 border rounded-md text-sm outline-none cursor-pointer">
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* 5. Technician */}
      <div className="w-44">
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Technician</label>
        <select 
               onChange={(e) => onFilterChange({ ...filters, technician: e.target.value })}
               className="border rounded px-3 py-2 cursor-pointer"
              >
              <option value="">All Staff</option>
              {technicians.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
      </div>

      <button onClick={clearAll} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 pb-2 px-2 cursor-pointer">
        <XCircle className="w-4 h-4" /> Reset
      </button>
    </div>
  );
};