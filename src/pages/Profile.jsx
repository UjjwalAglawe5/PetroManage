import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  User,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  Calendar,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  PencilLine,
  ChevronRight,
  Award,
  Settings,
  Wrench,
  Shield
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
  // Get user data from Redux
  const user = useSelector((state) => state.user.user);

  // Fallback values if user is not logged in
  const profileData = {
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@petromanage.com',
    role: user?.role || 'guest',
    phone: user?.phone || 'N/A',
    department: 'Engineering',
    officeLocation: 'Pune, MH',
  };

  const p = profileData;

  // Role display config
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

  const stats = [
    { label: 'Assets', value: 2 },
    { label: 'Plans', value: 4 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* ================= HEADER HERO ================= */}
      <motion.section variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-950 to-amber-900" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_50%)]" />

        <div className="relative p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <User size={48} className="text-blue-300" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-lg border-4 border-slate-950">
                <ShieldCheck size={16} className="text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{p.name}</h1>
                <span className={`${roleConfig.bgColor} ${roleConfig.textColor} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${roleConfig.borderColor} flex items-center gap-1.5`}>
                  {roleConfig.icon}
                  {roleConfig.label}
                </span>
              </div>
              <p className="text-blue-200/70 font-medium flex items-center gap-2">
                <Briefcase size={16} /> {p.department}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-colors"
          >
            Edit Profile <PencilLine size={16} />
          </motion.button>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT COLUMN: DETAILS ================= */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Contact & Info */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Professional Profile</h2>
              <Settings size={16} className="text-slate-400" />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Mail />, label: "Corporate Email", val: p.email },
                // { icon: <Phone />, label: "Contact Number", val: p.phone },
                { icon: <MapPin />, label: "Office Hub", val: p.officeLocation },
                // { icon: <User />, label: "Reporting Manager", val: p.manager },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                    {React.cloneElement(item.icon, { size: 18 })}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN: FIELD EXPERTISE & OPS LOGS ================= */}
        <div className="space-y-8">

          {/* Field Expertise / Certifications - Commented for future use */}
          {/* <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-sm flex items-center gap-2">
                <Award size={18} className="text-blue-500" /> Technical Expertise
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                Certified
              </span>
            </div>

            <div className="space-y-5">
              {[
                { label: "Wellhead Maintenance", level: 95, color: "from-blue-500 to-indigo-500" },
                { label: "HSE Compliance (OSHA)", level: 100, color: "from-emerald-500 to-teal-500" },
                { label: "Asset Lifecycle Analytics", level: 85, color: "from-blue-500 to-indigo-500" },
                { label: "Pressure Control Systems", level: 70, color: "from-amber-500 to-orange-500" },
              ].map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>{skill.label}</span>
                    <span className="text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}

          {/* Operational Logs / Recent Activity */}
          {/*<motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-black text-slate-800 uppercase tracking-tighter text-sm mb-6 flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-500" /> Operational Logs
            </h2>

            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                {
                  title: "Pipeline Integrity Audit",
                  desc: "Completed Sector 7 survey. No anomalies.",
                  date: "Jan 03, 2026",
                  status: "Success",
                  icon: <ShieldCheck size={16} className="text-emerald-500" />
                },
                {
                  title: "Rig #42 Maintenance",
                  desc: "Scheduled preventive hydraulic flush.",
                  date: "Jan 01, 2026",
                  status: "Pending",
                  icon: <Wrench size={16} className="text-blue-500" />
                },
                {
                  title: "HSE Incident Report",
                  desc: "Minor pressure leak contained at Station B.",
                  date: "Dec 28, 2025",
                  status: "Closed",
                  icon: <Zap size={16} className="text-amber-500" />
                }
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer relative z-10">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                    {log.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                        {log.title}
                      </p>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{log.desc}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
              View All Field Logs
            </button>
          </motion.div>
          */}

        </div>
      </div>
    </motion.div>
  );
};