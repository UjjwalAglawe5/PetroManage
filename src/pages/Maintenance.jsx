import { useState } from "react";
import { CreateWorkOrderModal } from "../components/maintenance components/CreateWorkOrderModal";
import { useNavigate } from "react-router-dom";
import { SummaryCard } from "../components/maintenance components/Summarycard";
import { FilterBar } from "../components/maintenance components/FilterBar";
import { StatusView } from "../components/maintenance components/StatusView";
const INITIAL_DATA = [
  { id: "WO-101", assetId: "Pipeline-P12", description: "Pressure inspection", type: "Preventive", priority: "High", date: "2025-09-12", technician: "Ravi Singh", status: "Scheduled" },
  { id: "WO-121", assetId: "Rig-R12", description: "Wire rope replacement", type: "Preventive", priority: "Low", date: "2025-09-08", technician: "Arjun Singh", status: "Completed" },
  { id: "WO-106", assetId: "Storage-S2", description: "Lubrication service", type: "Preventive", priority: "Low", date: "2025-09-21", technician: "Suresh Raina", status: "Scheduled" },
  { id: "WO-107", assetId: "Storage-S9", description: "Burner cleaning", type: "Preventive", priority: "Medium", date: "2025-09-22", technician: "Vikram Seth", status: "Scheduled" },
  { id: "WO-108", assetId: "Rig-R2", description: "Battery health check", type: "Preventive", priority: "High", date: "2025-09-23", technician: "Meera Nair", status: "Scheduled" },
  { id: "WO-110", assetId: "Storage-S1", description: "External coating repair", type: "Corrective", priority: "Medium", date: "2025-09-25", technician: "Amit Sharma", status: "Scheduled" },
  { id: "WO-112", assetId: "Pipeline-P15", description: "Mud pump overhaul", type: "Preventive", priority: "Low", date: "2025-09-27", technician: "Rajesh Verma", status: "Scheduled" },
  { id: "WO-113", assetId: "Rig-R4", description: "Tube bundle cleaning", type: "Preventive", priority: "Medium", date: "2025-09-28", technician: "Arjun Singh", status: "Scheduled" },
  { id: "WO-102", assetId: "Rig-R7", description: "Valve replacement", type: "Corrective", priority: "High", date: "2025-09-14", technician: "Amit Sharma", status: "In Progress" },
  { id: "WO-114", assetId: "Storage-S11", description: "Internal vessel inspection", type: "Preventive", priority: "Medium", date: "2025-09-15", technician: "Suresh Raina", status: "In Progress" },
  { id: "WO-105", assetId: "Pipeline-P01", description: "Seal replacement", type: "Preventive", priority: "Medium", date: "2025-09-20", technician: "Arjun Singh", status: "Scheduled" },
  { id: "WO-115", assetId: "Storage-S17", description: "Blade vibration analysis", type: "Corrective", priority: "Low", date: "2025-09-15", technician: "Vikram Seth", status: "In Progress" },
  { id: "WO-122", assetId: "Pipeline-P19", description: "Element replacement", type: "Preventive", priority: "Low", date: "2025-09-05", technician: "Suresh Raina", status: "Overdue" },
  { id: "WO-109", assetId: "Rig-R55", description: "Actuator calibration", type: "Preventive", priority: "Low", date: "2025-09-24", technician: "Ravi Singh", status: "Scheduled" },
  { id: "WO-116", assetId: "Storage-S2", description: "Ignition system repair", type: "Corrective", priority: "Medium", date: "2025-09-16", technician: "Meera Nair", status: "In Progress" },
  { id: "WO-111", assetId: "Rig-R9", description: "Ultrasonic thickness test", type: "Preventive", priority: "High", date: "2025-09-26", technician: "Sita Patel", status: "Scheduled" },
  { id: "WO-117", assetId: "Pipeline-P16", description: "Cathodic protection check", type: "Preventive", priority: "High", date: "2025-09-16", technician: "Ravi Singh", status: "In Progress" },
  { id: "WO-118", assetId: "Pipeline-P03", description: "Motor rewinding", type: "Corrective", priority: "Low", date: "2025-09-17", technician: "Amit Sharma", status: "In Progress" },
  { id: "WO-119", assetId: "Rig-R12", description: "Gasket replacement", type: "Corrective", priority: "Medium", date: "2025-09-17", technician: "Sita Patel", status: "In Progress" },
  { id: "WO-120", assetId: "Storage-D04", description: "Fire suppression refill", type: "Preventive", priority: "Low", date: "2025-09-18", technician: "Rajesh Verma", status: "In Progress" },
  { id: "WO-104", assetId: "Pipeline-D05", description: "Pressure gauge calibration", type: "Preventive", priority: "Medium", date: "2025-09-11", technician: "Rajesh Verma", status: "Completed" },
  { id: "WO-103", assetId: "Storage-C02", description: "Tank leakage check", type: "Preventive", priority: "High", date: "2025-09-10", technician: "Sita Patel", status: "Overdue" },
  { id: "WO-123", assetId: "Pipeline-P99", description: "Emergency shut-off test", type: "Preventive", priority: "Medium", date: "2025-09-01", technician: "Vikram Seth", status: "Overdue" }
];

const priorityColors = { Low: "bg-yellow-100 text-yellow-700", Medium: "bg-orange-100 text-orange-700", High: "bg-red-100 text-red-700" };
const statusColors = { Scheduled: "bg-blue-100 text-blue-700", "In Progress": "bg-yellow-100 text-yellow-700", Overdue: "bg-red-100 text-red-700", Completed: "bg-green-100 text-green-700" };

export const Maintenance = () => {
  const [workOrders, setWorkOrders] = useState(INITIAL_DATA);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All");
   
const handleAddWorkOrder = (newOrder) => {
    setWorkOrders((prev) => [newOrder, ...prev]); // Adds new order to the top of the list
  };

  // --- LOGIC AREA (ABOVE THE RETURN) ---
  const [searchFilters, setSearchFilters] = useState({
    workId: '', assetType: '', type: '', priority: '', technician: ''
  });

  const filteredOrders = workOrders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesId = order.id.toLowerCase().includes(searchFilters.workId.toLowerCase());
    const matchesAsset = !searchFilters.assetType || order.assetId.toLowerCase().includes(searchFilters.assetType.toLowerCase());
    const matchesType = !searchFilters.type || order.type === searchFilters.type;
    const matchesPriority = !searchFilters.priority || order.priority === searchFilters.priority;
    const matchesTech = !searchFilters.technician || order.technician === searchFilters.technician;

    return matchesStatus && matchesId && matchesAsset && matchesType && matchesPriority && matchesTech;
  });

  const totalCount = workOrders.length;
  const scheduledCount = workOrders.filter(o => o.status === "Scheduled").length;
  const inProgressCount = workOrders.filter(o => o.status === "In Progress").length;
  const completedCount = workOrders.filter(o => o.status === "Completed").length;
  const overdueCount = workOrders.filter(o => o.status === "Overdue").length;

  return (
    <div className="p-6 space-y-6"> {/* <--- This main wrapper MUST be here */}
    
    {/* 1. Header Area with Stylish Gradient Background */}
    <div className="bg-gradient-to-r from-orange-700 to-orange-900 p-6 rounded-xl shadow-md flex justify-between items-center mb-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Maintenance Management
        </h1>
        <p className="text-orange-50 font-medium opacity-90">
          Schedule and manage maintenance work orders
        </p>
      </div>
      
      <button 
        onClick={() => setShowModal(true)}
        className="bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-gray-900 transition-all font-bold flex items-center gap-2"
      >
        <span>+</span> Create Work Order
      </button>
    </div>
         
      

      {/* The grid is now tight and compact */}
<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
  <SummaryCard 
    title="All Work Orders" 
    value={totalCount} 
    type="all" 
    onClick={() => setFilterStatus("All")} 
    isActive={filterStatus === "All"} 
  />
  <SummaryCard 
    title="Scheduled" 
    value={scheduledCount} 
    type="scheduled" 
    onClick={() => setFilterStatus("Scheduled")} 
    isActive={filterStatus === "Scheduled"} 
  />
  <SummaryCard 
    title="In Progress" 
    value={inProgressCount} 
    type="progress" 
    onClick={() => setFilterStatus("In Progress")} 
    isActive={filterStatus === "In Progress"} 
  />
  <SummaryCard 
    title="Completed" 
    value={completedCount} 
    type="completed" 
    onClick={() => setFilterStatus("Completed")} 
    isActive={filterStatus === "Completed"} 
  />
  <SummaryCard 
    title="Overdue" 
    value={overdueCount} 
    type="overdue" 
    onClick={() => setFilterStatus("Overdue")} 
    isActive={filterStatus === "Overdue"} 
  />
</div>
      {/* Filter Bar Component */}
      <FilterBar onFilterChange={(data) => setSearchFilters(data)} />
      
      {filterStatus !== "All" && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">Showing: <strong>{filterStatus}</strong></span>
          <button onClick={() => setFilterStatus("All")} className="text-xs text-blue-600 hover:underline">Clear Filter</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TableHead>Work Order ID</TableHead>
              <TableHead>Asset ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((wo) => (
              <tr key={wo.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-blue-600">{wo.id}</TableCell>
                <TableCell>{wo.assetId}</TableCell>
                <TableCell>{wo.description}</TableCell>
                <TableCell>{wo.type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${priorityColors[wo.priority]}`}>{wo.priority}</span>
                </TableCell>
                <TableCell className="text-gray-600">{wo.date}</TableCell>
                <TableCell className="text-gray-600">{wo.technician}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[wo.status]}`}>{wo.status}</span>
                </TableCell>
                <TableCell> <button onClick={() => navigate("/maintenance/status", { state: { selectedOrder: wo } }) } className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer  " > View Details </button> </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (<CreateWorkOrderModal onClose={() => setShowModal(false)} onSave={handleAddWorkOrder}/>)}
    </div>
  );
};

const TableHead = ({ children }) => <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{children}</th>;
const TableCell = ({ children, className = "" }) => <td className={`px-4 py-4 text-sm ${className}`}>{children}</td>;