import React, { useState } from "react";
import oilimg from "../img/image.png";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function Login({
  onSubmit,
  onGoToRegister,
  title = "Welcome back",
  subtitle = "Sign in to your account",
  forgotHref = "/forgot",
  signupHref = "/register",
}) {
  const [role, setRole] = useState("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

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
        setMessage({ type: "success", text: `Signed in successfully!` });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setMessage({ type: "success", text: `Signed in successfully!` });
      }
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
      
      {/* Floating Animation Styles */}
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

      {/* Visual Side - Image made LARGER and added FLOAT animation */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center pr-10">
        <img
          src={oilimg}
          alt="Assets"
          className="w-full max-w-[45rem] h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] animate-float"
          aria-hidden="true"
        />
      </div>

      {/* Login Card */}
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 lg:p-10 z-10"
        role="region"
        aria-label="Login form"
      >
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-4xl font-black tracking-tight text-black">{title}</h2>
          <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>
        </div>

        {/* Role switch */}
        <div className="mb-8">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("manager")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "manager"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "admin"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-semibold border ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-orange-200 bg-orange-50 text-orange-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-wider"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between px-1">
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-700 px-4 py-4.5 text-sm font-black text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {loading ? "Verifying..." : "Sign In Now"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-sm font-medium text-gray-500">
          Don’t have an account?
          <button
            type="button"
            onClick={onGoToRegister || (() => window.location.href = signupHref)}
            className="ml-2 font-black text-black hover:text-orange-600 transition-colors border-b-2 border-black hover:border-orange-600"
          >
            Sign up free
          </button>
        </div>
      </div>
    </div>
  );
}