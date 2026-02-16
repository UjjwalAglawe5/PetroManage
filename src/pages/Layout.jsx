import { useState, useEffect } from 'react'; // Added useEffect
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../store/userSlice';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Wrench,
  FileCheck,
  User,
  LogOut,
  ChevronDown,
  Menu, // New icon
  X     // New icon
} from 'lucide-react';

// Animation for mobile menu tray
const mobileMenuVariants = {
  closed: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  open: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const role = user?.role;

  // Close mobile menu when switching routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/login');
  };

  let navItems = [];
  if (role === 'manager') {
    navItems = [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
      { icon: <Package size={18} />, label: 'Assets', path: '/assets' },
      { icon: <TrendingUp size={18} />, label: 'Production', path: '/production' },
      { icon: <Wrench size={18} />, label: 'Maintenance', path: '/maintenance' },
    ];
  } else if (role === 'admin') {
    navItems = [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
      { icon: <Package size={18} />, label: 'Assets', path: '/assets' },
      { icon: <FileCheck size={18} />, label: 'Compliance', path: '/compliance' },
    ];
  }

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-x-hidden font-sans">
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border-b border-gray-200 w-full relative z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle (Mobile Only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

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
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 py-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <motion.div key={item.path} variants={navItem} className="relative">
                    <NavLink
                      to={item.path}
                      className={() => `
                        relative flex items-center gap-2 px-4 py-2 rounded-xl
                        font-bold text-sm transition-colors whitespace-nowrap z-10
                        ${isActive ? 'text-white' : 'text-gray-500 hover:text-black'}
                      `}
                    >
                      <span className="relative z-20 flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
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

            {/* User Dropdown */}
            <div className="relative flex items-center border-l pl-4 border-gray-200 ml-2">
              <motion.button
                variants={navItem}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black shadow-sm">
                  {user?.name ? user.name.substring(0,2).toUpperCase() : 'OM'}
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  className="hidden sm:block"
                >
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.div>
              </motion.button>

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
                      className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-1 text-center sm:text-left">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">User Account</p>
                        <p className="text-sm font-bold text-black truncate capitalize">{role?.replace('_', ' ')}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                        <User size={18} /> Profile Settings
                      </Link>
                      <button onClick={handleLogout} className="cursor-pointer flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={18} /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        isActive 
                        ? 'bg-black text-white shadow-lg shadow-black/10' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}