import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for redirection
import { motion, AnimatePresence } from "framer-motion"; // Added for animations
import oilimg from "../img/image.png";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* =====================
   Animation Variants
===================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export function Login({
  onSubmit,
  onGoToRegister,
  title = "Welcome back",
  subtitle = "Sign in to your account",
  forgotHref = "/forgot",
  signupHref = "/register",
}) {
  const navigate = useNavigate();
  const [role, setRole] = useState("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // REDIRECT LOGIC: Redirect to "/" when login is successful
  useEffect(() => {
    if (message.type === "success") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1200); // Small delay so the user sees the success message
      return () => clearTimeout(timer);
    }
  }, [message.type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      if (typeof onSubmit === "function") {
        await onSubmit(email, password, rememberMe, role);
      } else {
        // Mock delay for UI feedback
        await new Promise((r) => setTimeout(r, 1000));
      }
      setMessage({ type: "success", text: `Signed in successfully! Redirecting...` });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-[#ffffff] px-6 lg:px-20 py-10 text-black justify-center lg:justify-around font-sans overflow-hidden">
      
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>

      {/* Visual Side - Animated with Framer */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center pr-10"
      >
        <img
          src={oilimg}
          alt="Assets"
          className="w-full max-w-[45rem] h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] animate-float"
        />
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 lg:p-10 z-10"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight text-black">{title}</h2>
            <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>
          </motion.div>

          {/* Role switch */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex bg-gray-100 p-1.5 rounded-2xl relative">
              <button
                type="button"
                onClick={() => setRole("manager")}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 z-10 ${
                  role === "manager" ? "text-white" : "text-gray-500"
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 z-10 ${
                  role === "admin" ? "text-white" : "text-gray-500"
                }`}
              >
                Admin
              </button>
              {/* Animated Switcher Pill */}
              <motion.div 
                animate={{ x: role === "manager" ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-black rounded-xl shadow-md"
              />
            </div>
          </motion.div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 rounded-xl px-4 py-3 text-sm font-semibold border ${
                  message.type === "error"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-orange-200 bg-orange-50 text-orange-700"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black px-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black px-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-orange-600 uppercase tracking-wider"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-gray-200 text-orange-600 focus:ring-orange-500 transition-all cursor-pointer"
                />
                <span className="group-hover:text-black transition-colors font-medium">Keep me signed in</span>
              </label>
              <a href={forgotHref} className="text-sm font-bold text-black hover:text-orange-600 transition-colors">
                Forgot?
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-orange-700 px-4 py-4.5 text-sm font-black text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? "Verifying..." : "Sign In Now"}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-10 text-center text-sm font-medium text-gray-500">
            Don’t have an account?
            <button
              type="button"
              onClick={onGoToRegister || (() => window.location.href = signupHref)}
              className="ml-2 font-black text-black hover:text-orange-600 transition-colors border-b-2 border-black hover:border-orange-600"
            >
              Sign up free
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}