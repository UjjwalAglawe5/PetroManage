import { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Wrench,
  FileCheck,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

/* =====================
   Animation Variants
===================== */
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a "premium" feel
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const navItem = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.2, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -8, 
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" } 
  }
};

export function Layout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); 

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Package size={18} />, label: 'Assets', path: '/assets' },
    { icon: <TrendingUp size={18} />, label: 'Production', path: '/production' },
    { icon: <Wrench size={18} />, label: 'Maintenance', path: '/maintenance' },
    { icon: <FileCheck size={18} />, label: 'Compliance', path: '/compliance' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-x-hidden font-sans">

      {/* ================= HEADER ================= */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border-b border-gray-200 w-full relative z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            variants={navItem}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/" className="block hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 45 }}
                    className="w-4 h-4 bg-white rounded-sm" 
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black text-black uppercase tracking-tight">
                    Petro<span className="text-orange-500">Manage</span>
                  </h1>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Operations
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 py-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div key={item.path} variants={navItem} className="relative">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        relative flex items-center gap-2 px-4 py-2 rounded-xl
                        font-bold text-sm transition-colors whitespace-nowrap z-10
                        ${isActive ? 'text-white' : 'text-gray-500 hover:text-black'}
                      `}
                    >
                      <span className="relative z-20 flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>

                      {/* Sliding Background Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="navpill"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                          className="absolute inset-0 bg-black rounded-xl shadow-lg shadow-black/10 z-0"
                        />
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="relative flex items-center border-l pl-4 border-gray-200 ml-2">
              <motion.button
                variants={navItem}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(249,115,22,0.4)" 
                  }}
                  className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                >
                  OM
                </motion.div>

                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                          User Account
                        </p>
                        <p className="text-sm font-bold text-black truncate">
                          Operations Manager
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <User size={18} />
                        Profile Settings
                      </Link>

                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}