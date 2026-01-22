import { Activity, TrendingUp, AlertTriangle, Wrench, BarChart3, Calendar } from 'lucide-react';
import { motion } from 'framer-motion'; // Added Framer Motion
import MetricsCard from '../components/dashboard components/MetricsCard';
import ProductionChart from '../components/dashboard components/ProductionChart';
// @ts-ignore: importing a JS module without a declaration file
import AssetUtilization from '../components/dashboard components/AssetUtilization';
import MaintenancePredictor from '../components/dashboard components/MaintenancePredictor';
import RecentReports from '../components/dashboard components/RecentReports';

import { analyticsData } from '../components/dashboard components/data';
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
  const latestMetrics = analyticsData.currentMetrics;

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
          <p className="text-emerald-100 mt-1 pl-14">Analytics & Dashboard</p>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-8 space-y-8">
        {/* Top metrics */}
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

        {/* Chart (left) + Maintenance Predictor (right) */}
        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductionChart data={analyticsData.productionTrends} />
            <MaintenancePredictor predictions={analyticsData.maintenancePredictions} />
          </div>
        </motion.section>

        {/* Interchanged: Asset Utilization now sits with Recent Reports */}
        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssetUtilization data={analyticsData.assets} />
            <RecentReports reports={analyticsData.recentReports} />
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}