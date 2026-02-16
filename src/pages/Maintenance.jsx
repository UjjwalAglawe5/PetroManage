import axios from '../config/axiosConfig';
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'; 
import { Wrench } from "lucide-react";

// Local Component Imports
import { CreateWorkOrderModal } from "../components/maintenance components/CreateWorkOrderModal";
import { SummaryCard } from "../components/maintenance components/Summarycard";
import { FilterBar } from "../components/maintenance components/FilterBar";



const priorityColors = { 
  Low: "bg-yellow-100 text-yellow-700", 
  Medium: "bg-orange-100 text-orange-700", 
  High: "bg-red-100 text-red-700" 
};

const statusColors = { 
  Scheduled: "bg-blue-100 text-blue-700", 
  "In progress": "bg-yellow-100 text-yellow-700", 
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
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All");
  
  const [searchFilters, setSearchFilters] = useState({
    workId: '', assetType: '', type: '', priority: '', technician: ''
  });

  // 1. Fetch Data from Backend on Load
  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/maintenance/work-orders");
      
      console.log(response.data);
      
      const mappedData = response.data.map(wo => ({
        id: `WO-${wo.workOrderId}`,
         // keep the real ID for API calls
        assetId: wo.assetName, 
        description: wo.description,
        type: wo.maintenanceType ? wo.maintenanceType : "Preventive",
       priority: wo.priority ? 
                 wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1).toLowerCase() : 
                 "Medium",
        date: wo.scheduledDate,

        expectedCompletionDate: wo.expectedCompletionDate, 
        actualCompletionDate: wo.actualCompletionDate,
        technician: wo.technicianName || "Unassigned", // This can be updated once Technician DTO is ready
        status: wo.status === "OVERDUE" ? "Overdue" :
                wo.status ? 
                wo.status.charAt(0).toUpperCase() + wo.status.slice(1).toLowerCase().replace('_', ' ') : 
                "Scheduled"
      }));
      setWorkOrders(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleAddWorkOrder = () => {
    fetchWorkOrders();
    setShowModal(false);
  };

  

  const filteredOrders = workOrders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesId = order.id.toLowerCase().includes(searchFilters.workId.toLowerCase()); 
    // FIX: Check if asset name/ID contains the filter value (case-insensitive)
    const matchesAsset = !searchFilters.assetType || order.assetId.toLowerCase().includes(searchFilters.assetType.toLowerCase());
    //using !searchFilters to allow empty filter values so that if any filter crashes it won't affect other filters
    const matchesType = !searchFilters.type || order.type === searchFilters.type;
    const matchesPriority = !searchFilters.priority || order.priority === searchFilters.priority;
    const matchesTech = !searchFilters.technician || order.technician === searchFilters.technician;

    return matchesStatus && matchesId && matchesAsset && matchesType && matchesPriority && matchesTech;
});
 
const stats = [
  { title: "All Work Orders", value: workOrders.length, type: "all", status: "All" },
  { title: "Scheduled", value: workOrders.filter(o => o.status === "Scheduled").length, type: "scheduled", status: "Scheduled" },
  { title: "In progress", value: workOrders.filter(o => o.status === "In progress").length, type: "progress", status: "In progress" },
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
        className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 p-4 sm:p-6 md:p-8 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
      >
        <div className="space-y-1 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl flex items-center font-extrabold text-white tracking-tight">
            <Wrench size={24} className="sm:w-8 sm:h-8 md:w-10 md:h-10"/>
            <span className="ml-2 sm:ml-3">Maintenance Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-orange-50 font-medium opacity-90 pl-7 sm:pl-10 md:pl-14 mt-1">
            Schedule and manage maintenance work orders
          </p>
        </div>
        {/* create new order button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gray-800 text-white px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-lg shadow-sm hover:bg-gray-900 transition-all font-bold flex items-center gap-2 cursor-pointer text-xs sm:text-sm md:text-base w-full sm:w-auto justify-center sm:justify-start"
        >
          <span className="text-sm">+</span>
          <span className="hidden sm:inline">Create Work Order</span>
          <span className="sm:hidden">Create</span>
        </motion.button>
      </motion.div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
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
      <motion.div variants={itemVariants} className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHead className="hidden sm:table-cell">Work Order ID</TableHead>
              <TableHead className="sm:hidden">Order ID</TableHead>
              <TableHead className="hidden md:table-cell">Asset ID</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="hidden 2xl:table-cell">Technician</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
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
                  <TableCell className="font-medium text-blue-600 hidden sm:table-cell">{wo.id}</TableCell>
                  <TableCell className="font-medium text-blue-600 sm:hidden truncate">{wo.id}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600 text-xs truncate">{wo.assetId}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-600 text-xs truncate max-w-xs">{wo.description}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-600 text-xs">{wo.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${priorityColors[wo.priority]}`}>
                      {wo.priority}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-600 text-xs">{wo.date}</TableCell>
                  <TableCell className="hidden 2xl:table-cell text-gray-600 text-xs">{wo.technician}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[wo.status]}`}>{wo.status}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/maintenance/status", { state: { selectedOrder: wo } }) } 
                      className="bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-blue-700 transition cursor-pointer whitespace-nowrap"
                    > 
                      Details
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
      <div className="text-center text-xs sm:text-sm text-gray-500 pt-4 px-2 border-t">
        © {new Date().getFullYear()} PetroManage — Asset &amp; Operations Management System
      </div>
    </motion.div>
  );
};


const TableHead = ({ children, className = "" }) => (
  <th className={`text-left px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs font-bold text-gray-500 uppercase ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-xs sm:text-sm ${className}`}>
    {children}
  </td>
);