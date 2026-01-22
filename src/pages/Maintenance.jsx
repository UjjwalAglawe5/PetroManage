import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench } from "lucide-react";
 
// Local Component Imports
import { CreateWorkOrderModal } from "../components/maintenance components/CreateWorkOrderModal";
import { SummaryCard } from "../components/maintenance components/Summarycard";
import { FilterBar } from "../components/maintenance components/FilterBar";
// Constants
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
  { id: "WO-119", assetId: "Rig-R12", description: "Gasket replacement", type: "Corrective", priority: "Medium", date: "2025-09-17", technician: "Sita Patel", status: "In Progress" },
  { id: "WO-120", assetId: "Storage-D04", description: "Fire suppression refill", type: "Preventive", priority: "Low", date: "2025-09-18", technician: "Rajesh Verma", status: "In Progress" },
  { id: "WO-104", assetId: "Pipeline-D05", description: "Pressure gauge calibration", type: "Preventive", priority: "Medium", date: "2025-09-11", technician: "Rajesh Verma", status: "Completed" },
  { id: "WO-103", assetId: "Storage-C02", description: "Tank leakage check", type: "Preventive", priority: "High", date: "2025-09-10", technician: "Sita Patel", status: "Overdue" },
  { id: "WO-123", assetId: "Pipeline-P99", description: "Emergency shut-off test", type: "Preventive", priority: "Medium", date: "2025-09-01", technician: "Vikram Seth", status: "Overdue" }
];
 
const priorityColors = {
  Low: "bg-yellow-100 text-yellow-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700"
};
 
const statusColors = {
  Scheduled: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
  Completed: "bg-green-100 text-green-700"
};
 
// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {opacity: 1,transition: { staggerChildren: 0.1 }}
};
 
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
 
export const Maintenance = () => {
  const [workOrders, setWorkOrders] = useState(INITIAL_DATA);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All");
 
  const [searchFilters, setSearchFilters] = useState({
    workId: '', assetType: '', type: '', priority: '', technician: ''
  });
 
  const handleAddWorkOrder = (newOrder) => {
    setWorkOrders((prev) => [newOrder, ...prev]);
  };
 
  const filteredOrders = workOrders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesId = order.id.toLowerCase().includes(searchFilters.workId.toLowerCase());
    const matchesAsset = !searchFilters.assetType || order.assetId.includes(searchFilters.assetType);
    //using !searchFilters to allow empty filter values so that if any filter crashes it won't affect other filters
    const matchesType = !searchFilters.type || order.type === searchFilters.type;
    const matchesPriority = !searchFilters.priority || order.priority === searchFilters.priority;
    const matchesTech = !searchFilters.technician || order.technician === searchFilters.technician;
 
    return matchesStatus && matchesId && matchesAsset && matchesType && matchesPriority && matchesTech;
});
  const stats = [
    { title: "All Work Orders", value: workOrders.length, type: "all", status: "All" },
    { title: "Scheduled", value: workOrders.filter(o => o.status === "Scheduled").length, type: "scheduled", status: "Scheduled" },//type here is used as a hook for css styling
    { title: "In Progress", value: workOrders.filter(o => o.status === "In Progress").length, type: "progress", status: "In Progress" },//status holds the exact value that the filter is looking for
    { title: "Completed", value: workOrders.filter(o => o.status === "Completed").length, type: "completed", status: "Completed" },
    { title: "Overdue", value: workOrders.filter(o => o.status === "Overdue").length, type: "overdue", status: "Overdue" },
  ];
 
  return (
    <motion.div
      className="py-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Header Area */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 p-8 rounded-xl shadow-md flex justify-between items-center mb-8"
      >
        <div className="space-y-1">
          <h1 className="text-3xl flex font-extrabold text-white tracking-tight">
            <Wrench size={40}/>
            &nbsp; Maintenance Management
          </h1>
          <p className="text-orange-50 font-medium opacity-90 pl-14">
            Schedule and manage maintenance work orders
          </p>
        </div>
        {/* create new order button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-gray-900 transition-all font-bold flex items-center gap-2"
        >
          <span>+</span> Create Work Order
        </motion.button>
      </motion.div>
 
      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.type}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <SummaryCard
              title={stat.title}
              value={stat.value}
              type={stat.type}
              onClick={() => setFilterStatus(stat.status)}
              isActive={filterStatus === stat.status}
            />
          </motion.div>
        ))}
      </div>
 
      <motion.div variants={itemVariants}>
        <FilterBar onFilterChange={(data) => setSearchFilters(data)} />
      </motion.div>
     
      {/* 3. Table Section */}
      <motion.div variants={itemVariants} className="overflow-x-auto bg-white rounded-lg shadow">
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
            <AnimatePresence mode='popLayout'>
              {filteredOrders.map((wo) => (
                <motion.tr
                  layout
                  key={wo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="font-medium text-blue-600">{wo.id}</TableCell>
                  <TableCell>{wo.assetId}</TableCell>
                  <TableCell>{wo.description}</TableCell>
                  <TableCell>{wo.type}</TableCell>
                  <TableCell>
                    <span className={`inline-block w-20 text-center py-1 rounded text-xs font-bold ${priorityColors[wo.priority]}`}>
  {wo.priority}
</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{wo.date}</TableCell>
                  <TableCell className="text-gray-600">{wo.technician}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[wo.status]}`}>{wo.status}</span>
                  </TableCell>
                  <TableCell>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/maintenance/status", { state: { selectedOrder: wo } }) }
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                      View Details
                    </motion.button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
 
      {/* 4. Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <CreateWorkOrderModal
            onClose={() => setShowModal(false)}
            onSave={handleAddWorkOrder}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
 
 
const TableHead = ({ children }) => (
  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">
    {children}
  </th>
);
 
const TableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-4 text-sm ${className}`}>
    {children}
  </td>
);