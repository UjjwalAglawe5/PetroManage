import React, { useState } from "react";
import axios from "axios"; 

export function ForgotPassword({
  title = "Forgot password",
  subtitle = "Enter your email to receive reset instructions",
  loginHref = "/login",
  signupHref = "/register",
  onGoToLogin,
}) {
  const [role, setRole] = useState("manager"); 
  const [stage, setStage] = useState("REQUEST");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMsg = (type, text) => setMessage({ type, text });
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email || !validateEmail(email)) {
      return showMsg("error", "Please enter a valid email address.");
    }

    setLoading(true);
    try {
      // ✅ FIXED: Added correct URL
      await axios.post("http://localhost:8084/auth/forgot-password", { 
        email: email 
      });

      setStage("VERIFY");
      showMsg("success", `Verification code sent to ${email}.`);

    } catch (err) {
      const errorMsg = err.response?.data || "Could not send reset link. Try again.";
      showMsg("error", typeof errorMsg === 'string' ? errorMsg : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!otp || otp.length < 6) return showMsg("error", "Enter the valid 6-digit verification code.");
    if (newPw.length < 6) return showMsg("error", "Password must be at least 6 characters.");
    if (newPw !== confirmPw) return showMsg("error", "Passwords do not match.");

    setLoading(true);
    try {
      // ✅ FIXED: Added correct URL
      await axios.put("http://localhost:8084/auth/reset-password", {
        email: email,       
        otp: otp,
        newPassword: newPw
      });

      showMsg("success", "Password reset successfully. Redirecting to login...");
      
      setTimeout(() => {
        if (onGoToLogin) onGoToLogin();
        else window.location.href = loginHref;
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data || "Invalid OTP or Expired.";
      showMsg("error", typeof errorMsg === 'string' ? errorMsg : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-[#F9FAFB] px-6 py-10 text-black justify-center font-sans">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-lg p-8 lg:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-black">{title}</h2>
          <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-semibold border ${
            message.type === "error" ? "border-red-200 bg-red-50 text-red-600" : "border-green-200 bg-green-50 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        {stage === "REQUEST" && (
          <form className="space-y-6" onSubmit={handleRequest}>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
              <input type="email" className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-4 outline-none focus:border-orange-500"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-orange-500 px-4 py-4 text-sm font-black text-white hover:bg-orange-600 transition-all uppercase tracking-widest">
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>
        )}

        {stage === "VERIFY" && (
          <form className="space-y-5" onSubmit={handleVerify}>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">OTP Code</label>
              <input type="text" className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3.5 outline-none focus:border-orange-500 text-center tracking-[10px] font-bold text-xl"
                value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">New Password</label>
              <input type="password" className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3.5 outline-none focus:border-orange-500"
                value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Confirm Password</label>
              <input type="password" className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3.5 outline-none focus:border-orange-500"
                value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-orange-500 px-4 py-4 text-sm font-black text-white hover:bg-orange-600 transition-all uppercase tracking-widest">
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}