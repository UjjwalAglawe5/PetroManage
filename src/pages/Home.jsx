import React from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import {
  Package,
  TrendingUp,
  Wrench,
  FileCheck,
  BarChart3,
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 }
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Home() {
  const navigate = useNavigate(); // Hook for redirection

  const modules = [
    {
      title: 'Asset Lifecycle',
      icon: <Package size={22} />,
      desc: 'Register rigs, pipelines, and storage units.',
      bg: 'bg-amber-100',
      border: 'border-amber-700',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Production Tracking',
      icon: <TrendingUp size={22} />,
      desc: 'Plan extraction and monitor daily actuals.',
      bg: 'bg-sky-50',
      border: 'border-sky-700',
      iconColor: 'text-sky-600'
    },
    {
      title: 'Maintenance',
      icon: <Wrench size={22} />,
      desc: 'Prevent downtime with scheduled work orders.',
      bg: 'bg-slate-100',
      border: 'border-slate-700',
      iconColor: 'text-slate-700'
    },
    {
      title: 'Compliance',
      icon: <FileCheck size={22} />,
      desc: 'Automated safety and environmental reports.',
      bg: 'bg-emerald-50',
      border: 'border-emerald-700',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Analytics',
      icon: <BarChart3 size={22} />,
      desc: 'Operational trends and predictive insights.',
      bg: 'bg-indigo-100',
      border: 'border-indigo-700',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* HERO SECTION */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="bg-[#09090b] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
      >        
        <motion.div
          variants={fadeLeft}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="p-8 md:p-16 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-800"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6 w-fit"
          >
            <Zap size={14} />
            <span> Operations v1.0</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
            PetroManage <br />
            <span className="text-zinc-500 font-medium">Asset Control.</span>
          </h1>

          <p className="text-zinc-400 text-lg mb-8 max-w-md leading-relaxed">
            Centralize your energy workflows. Monitor large-scale operations with enterprise-grade audit trails.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')} // REDIRECTION
              className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition flex items-center gap-2 shadow-lg shadow-white/5"
            >
              Get Started <ChevronRight size={18} />
            </motion.button>
            <button className="text-zinc-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2 px-4">
              View Specs
            </button>
          </div>
        </motion.div>

        {/* HERO VISUAL SIDE */}
        <motion.div
          variants={fadeRight}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 bg-zinc-900 p-8 flex flex-col justify-center items-center relative"
        >
          {/* Decorative background element */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-full max-w-xs space-y-4"
          >
            <div className="p-6 bg-zinc-800/80 backdrop-blur-xl rounded-2xl border border-zinc-700 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  System Status
                </span>
                <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                  LIVE <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                />
              </div>
              <div className="flex justify-between mt-4">
                <p className="text-[10px] text-zinc-400 font-bold">PRODUCTION EFFICIENCY</p>
                <p className="text-[10px] text-white font-black">85.2%</p>
              </div>
            </div>

            {/* Sub card */}
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <BarChart3 size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Active Nodes</p>
                <p className="text-sm font-black text-white">1,204 Units</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* MODULE GRID */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            System Modules
          </h2>
          <div className="h-[1px] flex-1 bg-slate-100 mx-6 hidden md:block" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Documentation Ref 2.1 – 2.5
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`
                ${m.bg}
                border-t-4 ${m.border}
                rounded-2xl p-6
                shadow-sm hover:shadow-xl hover:bg-white
                transition-all duration-300 cursor-pointer group
              `}
            >
              <div className={`mb-6 p-3 bg-white w-fit rounded-xl shadow-sm ${m.iconColor} group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
              <h3 className="font-black text-slate-900 mb-2 text-sm uppercase tracking-tight">
                {m.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* COMPLIANCE / CTA SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative bg-slate-900 rounded-[2.5rem] p-10 md:p-16 overflow-hidden"
      >
        {/* Abstract background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
            <ShieldCheck size={64} className="text-amber-500" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
              Regulatory Compliance & <br /> Safety Operations
            </h3>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
              Automated audit trails for HSE inspections, environmental tracking, and 
              ISO-certified verification workflows.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full md:w-auto bg-amber-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[2px] hover:bg-amber-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-amber-900/20"
          >
            Launch Audit System <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}