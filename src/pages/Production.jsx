import { useEffect, useState, useRef } from 'react'; // Added useRef
import { Plus, Calendar, TrendingUp, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlansForm } from '../components/production components/PlansForm';
import { PlansTable } from '../components/production components/PlansTable';
import { RecordForm } from '../components/production components/RecordForm';
import { RecordTable } from '../components/production components/RecordTable';
import PlannedVsActualChart from '../components/production components/PlannedVsActualChart';
import axios from '../config/axiosConfig';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export function Production() {
  const [activeTab, setActiveTab] = useState('plans');
  const [showAddForm, setShowAddForm] = useState(false);
  const [dailyBarrels, setDailyBarrels] = useState(0);
  const [planAchievement, setplanAchievement] = useState(0);
  const [avtivePlans, setActivePlans] = useState(0);
  const [productionPlans, setProductionPlans] = useState([]);
  const [RecordPlans, setRecordPlans] = useState([]);

  // 1. Create a ref for the form container
  const formRef = useRef(null);

  // 2. Effect to scroll when the form is opened
  useEffect(() => {
    if (showAddForm && formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' // 'center' ensures the form isn't hidden behind headers
      });
    }
  }, [showAddForm]);

  const refreshData = async () => {
    try {
      const [plansRes, recordsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/production/plans'),
        axios.get('http://localhost:8080/api/production/records')
      ]);
      setProductionPlans(plansRes.data);
      setRecordPlans(recordsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => { refreshData(); }, []);

  useEffect(() => {
    calculateTotals();
  }, [productionPlans, RecordPlans]);

  const calculateTotals = () => {
    const total = RecordPlans.reduce((acc, record) => acc + (record.actualVolume || 0), 0);
    let totalActual = 0;
    let totalPlanned = 0;
    RecordPlans.forEach((rec) => {
      totalActual += rec.actualVolume || 0;
      const plan = productionPlans.find(p => (p.planId || p.id) === rec.planId);
      if (plan && plan.plannedVolume) {
        totalPlanned += plan.plannedVolume;
      }
    });
    const achievement = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    const activePlansCount = productionPlans.filter(plan => (plan.status || '').toUpperCase() === 'ACTIVE').length;

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
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-tr from-slate-950 via-emerald-600 to-teal-900 rounded-xl p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="shrink-0" size={32} />
            <span>Production Management</span>
          </h2>
          <p className="text-emerald-100 mt-1 md:pl-11 text-sm md:text-base">
            Plan and track production operations
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full md:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors shrink-0"
        >
          <Plus size={20} />
          {activeTab === 'plans' ? 'New Plan' : 'Add Record'}
        </motion.button>
      </motion.div>

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
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-600 rounded-lg shrink-0">
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-white truncate">{stat.val}</p>
                <p className="text-xs md:text-sm text-gray-400 truncate">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            ref={formRef} // 3. Attach the ref here
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-100 rounded-lg shadow-sm border border-gray-400 p-4 md:p-6 overflow-hidden"
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

      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {['plans', 'records'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer relative px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
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

        <div className="overflow-x-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="min-w-[800px] md:min-w-full"
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

      <motion.div variants={itemVariants} className="overflow-x-hidden">
        <PlannedVsActualChart productionPlans={productionPlans} recordPlans={RecordPlans} />
      </motion.div>

      <div className="text-center text-xs md:text-sm text-gray-500 pt-4 border-t">
        © {new Date().getFullYear()} PetroManage — Asset &amp; Operations Management System
      </div>
    </motion.div>
  );
}