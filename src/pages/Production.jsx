import { useEffect, useState } from 'react';
import { Plus, Calendar, TrendingUp, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import { AvP } from '../components/production components/AvP';
import { PlansForm } from '../components/production components/PlansForm';
import { PlansTable } from '../components/production components/PlansTable';
import { RecordForm } from '../components/production components/RecordForm';
import { RecordTable } from '../components/production components/RecordTable';
import PlannedVsActualChart from '../components/production components/PlannedVsActualChart';
import axios from 'axios';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const initialPlans = [
  { id: 'PLAN-1', assetId: 'RIG-001', assetName: 'North Sea Rig Alpha', plannedVolume: 5000, unit: 'barrels/day', startDate: '2024-01-01', endDate: '2024-03-31', status: 'Active' },
  { id: 'PLAN-2', assetId: 'RIG-002', assetName: 'West Texas Rig Beta', plannedVolume: 4200, unit: 'barrels/day', startDate: '2024-01-01', endDate: '2024-03-31', status: 'Active' },
  { id: 'PLAN-3', assetId: 'RIG-008', assetName: 'Gulf Platform Echo', plannedVolume: 6500, unit: 'barrels/day', startDate: '2024-01-15', endDate: '2024-04-15', status: 'Active' },
  { id: 'PLAN-4', assetId: 'STG-012', assetName: 'Storage Facility B', plannedVolume: 150000, unit: 'barrels', startDate: '2024-01-01', endDate: '2024-06-30', status: 'Planned' }
];

const initialRecords = [
  { id: 'REC-1245', assetId: 'RIG-001', assetName: 'North Sea Rig Alpha', actualVolume: 5150, plannedVolume: 5000, unit: 'barrels', date: '2024-01-14', variance: '+3%' },
  { id: 'REC-1246', assetId: 'RIG-002', assetName: 'West Texas Rig Beta', actualVolume: 4050, plannedVolume: 5200, unit: 'barrels', date: '2024-01-14', variance: '-3.6%' },
  { id: 'REC-1247', assetId: 'RIG-008', assetName: 'Gulf Platform Echo', actualVolume: 6420, plannedVolume: 6500, unit: 'barrels', date: '2024-01-14', variance: '-1.2%' },
  { id: 'REC-1248', assetId: 'RIG-001', assetName: 'North Sea Rig Alpha', actualVolume: 4980, plannedVolume: 4900, unit: 'barrels', date: '2024-01-13', variance: '-0.4%' },
  { id: 'REC-1249', assetId: 'RIG-002', assetName: 'West Texas Rig Beta', actualVolume: 4300, plannedVolume: 4200, unit: 'barrels', date: '2024-01-13', variance: '+2.4%' }
];

export function Production() {
  const [activeTab, setActiveTab] = useState('plans');
  const [showAddForm, setShowAddForm] = useState(false);
  const [dailyBarrels, setDailyBarrels] = useState(0);
  const [planAchievement, setplanAchievement] = useState(0);
  const [avtivePlans, setActivePlans] = useState(0);
  const [productionPlans, setProductionPlans] = useState(initialPlans);
  const [RecordPlans, setRecordPlans] = useState(initialRecords);


  const refreshData = async () => {
    try {
      const [plansRes, recordsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/production-plans'),
        axios.get('http://localhost:8080/api/production-records')
      ]);
      setProductionPlans(plansRes.data);
      setRecordPlans(recordsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

//   useEffect(() => {
//   refreshData();
// }, []); // Empty dependency array means this runs once on page load

  useEffect(() => {
    calculateTotals();
  }, [productionPlans, RecordPlans]); // Added dependencies to useEffect

  const calculateTotals = () => {
    const total = RecordPlans.reduce((accumulator, record) => accumulator + (record.actualVolume || 0), 0);
    const totalActual = RecordPlans.reduce((sum, rec) => sum + rec.actualVolume, 0);
    const totalPlanned = RecordPlans.reduce((sum, rec) => sum + rec.plannedVolume, 0);
    const achievement = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    const activePlansCount = productionPlans.filter(plan => plan.status === 'Active').length;

    setDailyBarrels(total);
    setplanAchievement(achievement);
    setActivePlans(activePlansCount);
  };

  return (
    <motion.div 
      className="space-y-6 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-tr from-slate-950 via-emerald-600 to-teal-900 rounded-xl p-8 text-white flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold flex">
            <TrendingUp size={40} />
            &nbsp; Production Management
          </h2>
          <p className="text-emerald-100 mt-1 pl-14">
            Plan and track production operations
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors h-fit"
        >
          <Plus size={20} />
          {activeTab === 'plans' ? 'New Plan' : 'Add Record'}
        </motion.button>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: BarChart, val: dailyBarrels.toLocaleString(), label: "Daily Production (barrels)" },
          { icon: TrendingUp, val: `${planAchievement.toFixed(1)}%`, label: "Plan Achievement" },
          { icon: Calendar, val: avtivePlans.toLocaleString(), label: "Active Production Plans" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-600 rounded-lg">
                <stat.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.val}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="bg-slate-100 rounded-lg shadow-sm border border-gray-400 p-6 overflow-hidden"
          >
            {activeTab === 'plans' ? (
              <PlansForm
                productionPlans={productionPlans}
                onCancel={() => setShowAddForm(false)}
                setProductionPlans={setProductionPlans}
              />
            ) : (
              <RecordForm
                onCancel={() => setShowAddForm(false)}
                setRecordPlans={setRecordPlans}
                RecordPlans={RecordPlans}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs and Table Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            {['plans', 'records'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab ? 'text-slate-800' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'plans' ? 'Production Plans' : 'Production Records'}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'plans' ? (
                <PlansTable productionPlans={productionPlans} setProductionPlans={setProductionPlans} />
              ) : (
                <RecordTable RecordPlans={RecordPlans} setRecordPlans={setRecordPlans} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chart Section */}
      <motion.div variants={itemVariants}>
        <PlannedVsActualChart />
      </motion.div>
    </motion.div>
  );
}