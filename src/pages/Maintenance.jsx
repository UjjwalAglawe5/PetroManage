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
    const matchesAsset = !searchFilters.assetType || order.assetId.includes(searchFilters.assetType);
    //using !searchFilters to allow empty filter values so that if any filter crashes it won't affect other filters
    const matchesType = !searchFilters.type || order.type === searchFilters.type;
    const matchesPriority = !searchFilters.priority || order.priority === searchFilters.priority;
    const matchesTech = !searchFilters.technician || order.technician === searchFilters.technician;

    return matchesStatus && matchesId && matchesAsset && matchesType && matchesPriority && matchesTech;
});
  // Change INITIAL_DATA to workOrders
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
          className="bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-gray-900 transition-all font-bold flex items-center gap-2 cursor-pointer"
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
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        © {new Date().getFullYear()} PetroManage — Asset &amp; Operations Management System
      </div>
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