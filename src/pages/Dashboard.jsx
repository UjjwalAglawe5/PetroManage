import { Activity, TrendingUp, AlertTriangle, Wrench, BarChart3, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MetricsCard from '../components/dashboard components/MetricsCard';
import ProductionChart from '../components/dashboard components/ProductionChart';
// @ts-ignore: importing a JS module without a declaration file
import AssetUtilization from '../components/dashboard components/AssetUtilization';
import MaintenancePredictor from '../components/dashboard components/MaintenancePredictor';
import RecentReports from '../components/dashboard components/RecentReports';
import { NavLink } from 'react-router-dom';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Dashboard() {
  const user = useSelector((state) => state.user.user);
  const role = user?.role;
  
  const [analyticsData, setAnalyticsData] = useState({
    currentMetrics: {
      productionEfficiency: 0,
      efficiencyChange: 0,
      assetUtilization: 0,
      utilizationChange: 0,
      totalDowntime: 0,
      downtimeChange: 0,
      maintenanceDue: 0
    },
    productionTrends: [],
    assets: [],
    maintenancePredictions: [],
    recentReports: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/analytics');
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const latestMetrics = analyticsData.currentMetrics;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={itemVariants}>
        <div className="bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-950 rounded-lg p-8 mr-5 text-white flex-1">
          <h2 className="text-3xl font-bold flex">
            <TrendingUp size={40} />&nbsp; Dashboard
          </h2>
          <p className="text-emerald-100 mt-1 pl-14">
            {role === 'admin'
              ? 'Admin View: High-level analytics across all sites'
              : role === 'manager'
                ? 'Operational View: Current site activity & pending tasks'
                : 'Analytics & Dashboard'}
          </p>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-8 space-y-8">
        {role === 'admin' ? (
          <>
            {/* Admin: High-level analytics */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Production Efficiency"
                    value={`${latestMetrics.productionEfficiency}%`}
                    change={latestMetrics.efficiencyChange}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="blue"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Asset Utilization"
                    value={`${latestMetrics.assetUtilization}%`}
                    change={latestMetrics.utilizationChange}
                    icon={<Activity className="w-6 h-6" />}
                    color="green"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Total Downtime"
                    value={`${latestMetrics.totalDowntime}h`}
                    change={latestMetrics.downtimeChange}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color="orange"
                    isNegativeGood
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Maintenance Due"
                    value={latestMetrics.maintenanceDue}
                    change={0}
                    icon={<Wrench className="w-6 h-6" />}
                    color="red"
                  />
                </motion.div>
              </div>
            </section>
            <motion.section variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProductionChart data={analyticsData.productionTrends} />
                <AssetUtilization data={analyticsData.assets} />
              </div>
            </motion.section>
          </>
        ) : role === 'manager' ? (
          <>
            {/* Operational Manager: Focused site activity and tasks */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Production Efficiency"
                    value={`${latestMetrics.productionEfficiency}%`}
                    change={latestMetrics.efficiencyChange}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="blue"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Maintenance Due"
                    value={latestMetrics.maintenanceDue}
                    change={0}
                    icon={<Wrench className="w-6 h-6" />}
                    color="red"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Total Downtime"
                    value={`${latestMetrics.totalDowntime}h`}
                    change={latestMetrics.downtimeChange}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color="orange"
                    isNegativeGood
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricsCard
                    title="Pending Reports"
                    value={analyticsData.recentReports.length}
                    change={0}
                    icon={<BarChart3 className="w-6 h-6" />}
                    color="purple"
                  />
                </motion.div>
              </div>
            </section>
            <motion.section variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MaintenancePredictor predictions={analyticsData.maintenancePredictions} />
                <RecentReports reports={analyticsData.recentReports} />
              </div>
            </motion.section>
          </>
        ) : null}
      </main>
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        © {new Date().getFullYear()} PetroManage — Asset &amp; Operations Management System
      </div>
    </motion.div>
  );
}