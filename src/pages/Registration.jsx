import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, ChevronRight, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export function Registration({
  onSubmit,
  title = "Join PetroManage",
  subtitle = "Register to manage oil and gas assets",
  loginHref = "/login",
  enableRole = true,
}) {

  const navigate=useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter your full name." });
      return;
    }
    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (!acceptTerms) {
      setMessage({ type: "error", text: "You must accept the Terms & Privacy Policy." });
      return;
    }

    setLoading(true);
    try {
      if (typeof onSubmit === "function") {
        await onSubmit({ name, email, password, role, acceptTerms });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setMessage({ type: "success", text: "Account created! Redirecting to dashboard..." });
      navigate("/")
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
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* LEFT SIDE: Industrial Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-5/12 relative bg-slate-950 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-orange-900/10" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="w-24 h-24 bg-orange-600/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-xl">
             <ShieldCheck size={48} className="text-orange-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4">PETROMANAGE <span className="text-orange-600">PRO</span></h1>
          <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
            Standardizing safety and efficiency across upstream, midstream, and downstream assets.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-slate-500">
             <div className="flex flex-col items-center gap-2">
                <HardHat size={20} />
                <span className="text-[10px] uppercase font-black tracking-widest">HSE Ready</span>
             </div>
             <div className="w-px h-8 bg-slate-800" />
             <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={20} />
                <span className="text-[10px] uppercase font-black tracking-widest">ISO 27001</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 md:p-12 bg-white">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-4xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="text-slate-500 mt-2 font-medium">{subtitle}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-8 rounded-2xl px-5 py-4 text-sm font-bold border flex items-center gap-3 ${
                  message.type === "error"
                    ? "border-red-100 bg-red-50 text-red-600"
                    : "border-emerald-100 bg-emerald-50 text-emerald-700"
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-2 block ml-1">
                Full Operational Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Manohar Singh"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 pl-12 pr-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-2 block ml-1">
                Corporate Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 pl-12 pr-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Role Toggle - Premium Style */}
            {enableRole && (
              <motion.div variants={itemVariants}>
                <label className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-2 block ml-1">
                  Access Level
                </label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl relative">
                  <button
                    type="button"
                    onClick={() => setRole("manager")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${
                      role === "manager" ? "text-white" : "text-slate-500"
                    }`}
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${
                      role === "admin" ? "text-white" : "text-slate-500"
                    }`}
                  >
                    Admin
                  </button>
                  <motion.div 
                    animate={{ x: role === "manager" ? "0%" : "100%" }}
                    className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-slate-900 rounded-xl shadow-lg"
                  />
                </div>
              </motion.div>
            )}

            {/* Password Fields */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 pl-12 pr-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Confirm"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 pl-12 pr-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Terms */}
            <motion.div variants={itemVariants}>
              <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer group px-1">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-2 border-slate-200 text-orange-600 focus:ring-orange-500 transition-all cursor-pointer"
                />
                <span className="group-hover:text-slate-900 transition-colors font-medium text-xs leading-relaxed">
                  I confirm that I have read and agree to the <span className="text-slate-950 font-black underline decoration-orange-500/30">Terms of Service</span> and <span className="text-slate-950 font-black underline decoration-orange-500/30">Security Protocol</span>.
                </span>
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-orange-700 px-4 py-5 text-xs font-black text-white shadow-[0_15px_30px_rgba(194,65,12,0.25)] hover:bg-orange-600 transition-all disabled:opacity-50 uppercase tracking-[2px] flex items-center justify-center gap-2"
              >
                {loading ? "Initializing..." : "Register Credentials"}
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-10 text-center text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">
            Already Registered?
            <button
              type="button"
              onClick={()=>navigate("/login")}
              className="ml-2 font-black text-slate-950 hover:text-orange-600 transition-colors border-b-2 border-slate-950 hover:border-orange-600"
            >
              Sign In
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}