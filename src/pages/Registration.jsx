import React, { useState } from "react";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function Registration({
  onSubmit,           
  onGoToLogin,        
  title = "Create your account",
  subtitle = "Join us and start your journey",
  loginHref = "/login",
  enableRole = true,  
}) {
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
        setMessage({ type: "success", text: "Registration successful!" });
      } else {
        await new Promise((r) => setTimeout(r, 800));
        setMessage({ type: "success", text: "Registration successful!" });
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
    // Matching light background
    <div className="min-h-screen grid place-items-center  bg-[#ffffff] px-6 py-10 text-black font-sans">
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 lg:p-10"
        role="region"
        aria-label="Registration form"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-black">{title}</h2>
          <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-semibold border ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-orange-200 bg-orange-50 text-orange-700"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-500 mb-2 block ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-500 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirm" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                Confirm
              </label>
              <input
                id="confirm"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          {enableRole && (
            <div>
              <label htmlFor="role" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                User Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Terms */}
          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer group px-1">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-200 text-orange-600 focus:ring-orange-500 transition-all cursor-pointer"
              required
            />
            <span className="group-hover:text-black transition-colors font-medium">
              I agree to the{" "}
              <a href="/terms" className="text-black font-bold hover:text-orange-600 underline decoration-orange-500/30">Terms</a>
              {" "}and{" "}
              <a href="/privacy" className="text-black font-bold hover:text-orange-600 underline decoration-orange-500/30">Privacy Policy</a>.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-700 px-4 py-4 text-sm font-black text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?
          {onGoToLogin ? (
            <button
              type="button"
              onClick={onGoToLogin}
              className="ml-2 font-black text-black hover:text-orange-600 transition-colors border-b-2 border-black hover:border-orange-600"
            >
              Sign in
            </button>
          ) : (
            <a href={loginHref} className="ml-2 font-black text-black hover:text-orange-600 transition-colors border-b-2 border-black hover:border-orange-600">
              Sign in
            </a>
          )}
        </div>
      </div>
    </div>
  );
}