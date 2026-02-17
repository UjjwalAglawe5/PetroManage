import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../config/axiosConfig';
import { updateUser } from '../store/userSlice';
import {
  User,
  Briefcase,
  MapPin,
  Mail,
  ShieldCheck,
  Zap,
  PencilLine,
  Settings,
  Shield,
  X,
  Save
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const profileData = {
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@petromanage.com',
    role: user?.role || 'guest',
    phone: user?.phone || 'N/A',
    department: 'Engineering',
    officeLocation: 'Pune, MH',
  };

  const p = profileData;

  const getRoleConfig = (role) => {
    if (role === 'admin') {
      return {
        label: 'Admin',
        bgColor: 'bg-purple-500/20',
        textColor: 'text-purple-300',
        borderColor: 'border-purple-500/30',
        icon: <Shield size={14} className="text-purple-300" />
      };
    } else if (role === 'manager') {
      return {
        label: 'Manager',
        bgColor: 'bg-emerald-500/20',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-500/30',
        icon: <Briefcase size={14} className="text-emerald-300" />
      };
    }
    return {
      label: 'User',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30',
      icon: <User size={14} className="text-blue-300" />
    };
  };

  const roleConfig = getRoleConfig(p.role);

  const [stats, setStats] = useState({
    assets: 0,
    productionPlans: 0,
    productionRecords: 0,
    complianceReports: 0,
    auditLogs: 0,
    maintenanceTasks: 0
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [assets, plans, records, reports, audits, maintenance] = await Promise.all([
          axios.get("http://localhost:8080/api/assets/count"),
          axios.get("http://localhost:8080/api/production/plans/count"),
          axios.get("http://localhost:8080/api/production/records/count"),
          axios.get("http://localhost:8080/api/compliance/reports/count"),
          axios.get("http://localhost:8080/api/compliance/audit-log/count"),
          axios.get("http://localhost:8080/api/maintenance/count")
        ]);

        setStats({
          assets: assets.data,
          productionPlans: plans.data,
          productionRecords: records.data,
          complianceReports: reports.data,
          auditLogs: audits.data,
          maintenanceTasks: maintenance.data
        });
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      }
    };

    fetchAllStats();
  }, []);

  const statsDisplay = [
    { label: "Total Assets", value: stats.assets },
    { label: "Prod. Plans", value: stats.productionPlans },
    { label: "Records", value: stats.productionRecords },
    { label: "Reports", value: stats.complianceReports },
    { label: "Audit Logs", value: stats.auditLogs },
    { label: "Maintenance", value: stats.maintenanceTasks },
  ];

  const handleEditClick = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/auth/update-user-info/${user.userId}`,
        {
          name: editForm.name,
          email: editForm.email
        }
      );

      // Update Redux store with new user info
      dispatch(updateUser({
        name: response.data.name,
        email: response.data.email
      }));

      // Note: localStorage is already updated by the updateUser reducer
      
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // CHANGED: Removed max-w-7xl, added w-full and px-4 for edge-to-edge look
      className="w-full px-4 sm:px-6 lg:px-10 space-y-6 md:space-y-8 pb-12"
    >
      {/* ================= HEADER HERO ================= */}
      <motion.section variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-xl w-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-950 to-amber-900" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_50%)]" />

        <div className="relative p-6 md:p-10 lg:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <User size={40} className="text-blue-300 md:size-12" />
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-emerald-500 p-1.5 rounded-lg border-2 md:border-4 border-slate-950">
                <ShieldCheck size={14} className="text-white md:size-4" />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 md:mb-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">{p.name}</h1>
                <span className={`${roleConfig.bgColor} ${roleConfig.textColor} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${roleConfig.borderColor} flex items-center gap-1.5`}>
                  {roleConfig.icon}
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-blue-200/70 text-sm md:text-base font-medium flex items-center gap-2">
                <Briefcase size={16} /> {p.department}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditClick}
            className="w-full md:w-auto cursor-pointer bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-50 transition-colors"
          >
            Edit Profile <PencilLine size={16} />
          </motion.button>
        </div>
      </motion.section>

      {/* CHANGED: Made the main content grid take full width */}
      <div className="w-full flex flex-col gap-6 md:gap-8">

        {/* Responsive Stats Grid: Expanded to 3 columns on medium and above */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
        >
          {statsDisplay.map((stat, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow w-full">
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Profile Details Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Professional Profile</h2>
            <Settings size={16} className="text-slate-400" />
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
            {[
              { icon: <Mail />, label: "Corporate Email", val: p.email },
              { icon: <MapPin />, label: "Office Hub", val: p.officeLocation },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                  {React.cloneElement(item.icon, { size: 22 })}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-base md:text-xl font-bold text-slate-700 truncate">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-amber-800">
                    <strong>Note:</strong> Your role cannot be changed. Only name and email can be updated.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Saving...' : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};