import React, { useEffect, useState } from "react";
import { FileCheck } from "lucide-react";
import { FaHistory, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../components/compliance components/Card.jsx";
import ReportsTable from "../components/compliance components/ReportsTable.jsx";
import ReportForm from "../components/compliance components/ReportForm.jsx";
import AuditView from "../components/compliance components/AuditView.jsx";
import axios from '../config/axiosConfig';

const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const API_BASE_URL = "http://localhost:8080/compliance-service/api/compliance/reports";

export const Compliance = () => {
  const [view, setView] = useState("dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const [reports, setReports] = useState([]);

  const calibriStyle = { fontFamily: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif" };

  const fetchReports = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setReports(response.data.reverse());
    } catch (error) {
      console.error("Sync Error:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const [stats, setStats] = useState({
    "✅ Overall Compliance": "0%",
    "🛡️ Safety Score": "0",
    "📋 Pending Reviews": 0,
    "📅 Upcoming Audits": 0
  });

  useEffect(() => {
    const updateStats = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        const reportData = response.data;
        if (reportData.length === 0) return;

        const compliant = reportData.filter(r => r.complianceStatus === "COMPLIANT").length;
        const score = reportData.reduce((a, b) => a + Number(b.safetyScore || 0), 0);
        const pending = reportData.filter(r => r.complianceStatus === "PENDING_REVIEW").length;
        const upcoming = reportData.filter(r => r.nextAuditDate && new Date(r.nextAuditDate) >= new Date().setHours(0, 0, 0, 0)).length;

        setStats({
          "✅ Overall Compliance": `${Math.round((compliant / reportData.length) * 100)}%`,
          "🛡️ Safety Score": `${Math.round(score / reportData.length)}`,
          "📋 Pending Reviews": pending,
          "📅 Upcoming Audits": upcoming
        });
      } catch (error) {
        console.error("Error updating stats:", error);
      }
    };
    updateStats();
  }, [reports]);

  useEffect(() => {
    if (reports.length === 0) {
      setStats({
        "✅ Overall Compliance": "0%",
        "🛡️ Safety Score": "0",
        "📋 Pending Reviews": 0,
        "📅 Upcoming Audits": 0
      });
    }
  }, [reports]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 sm:pb-20 overflow-x-hidden" style={calibriStyle}>
      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div
            key="dashboard-view"
            variants={containerVar}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Header Section */}
            <div className="w-full pt-4 px-2 sm:px-4">
              <div className="relative overflow-hidden text-white rounded-xl px-6 py-6 md:px-12 md:py-8 bg-slate-900 shadow-2xl">
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6">
                  <FileCheck size={48} className="text-emerald-400 shrink-0 md:size-16" />
                  <div className="flex flex-col">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tight">
                      Compliance <span className="text-emerald-400">&amp;</span> Safety
                    </h2>
                    <p className="text-slate-400 font-medium text-xs sm:text-sm md:text-base max-w-2xl">
                      Centralized regulatory tracking and real-time safety audit management.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <motion.div variants={itemVar} className="w-full max-w-7xl mx-auto mt-8 px-4">
              <Card data={stats} />
            </motion.div>

            {/* Action Button */}
            <motion.div variants={itemVar} className="flex justify-center mt-10 px-4">
              <button
                onClick={() => setShowPopup(true)}
                className="w-full sm:w-[320px] h-[60px] md:h-[64px] flex items-center justify-center gap-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-500 cursor-pointer text-sm sm:text-lg uppercase tracking-widest transition-all"
                style={calibriStyle}
              >
                <FaPlus size={18} /> Generate New Report
              </button>
            </motion.div>

            {/* Table Section */}
            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-12 md:mt-16 px-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <div className="h-8 md:h-10 w-2 bg-emerald-500 rounded-full" /> Active Reports
                </h2>
                <button
                  onClick={() => setView("audit")}
                  className="flex items-center gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all text-xs md:text-[15px] uppercase tracking-widest cursor-pointer whitespace-nowrap"
                  style={calibriStyle}
                >
                  <FaHistory /> Audit Logs
                </button>
              </div>

              <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 p-1 md:p-2 overflow-x-auto">
                {/* Ensure the table itself can scroll horizontally if needed on tiny screens */}
                <div className="min-w-full">
                  <ReportsTable reports={reports} setReports={setReports} fetchReports={fetchReports} />
                </div>
              </div>
            </motion.div>

            {/* Popup Form */}
            <AnimatePresence>
              {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 overflow-y-auto">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl my-auto"
                    style={calibriStyle}
                  >
                    <div className="max-h-[90vh] overflow-y-auto rounded-3xl">
                      <ReportForm onClose={() => setShowPopup(false)} reports={reports} setReports={setReports} fetchReports={fetchReports} />
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div style={calibriStyle} className="w-full">
            <AuditView key="audit-view" setView={setView} />
          </div>
        )}
      </AnimatePresence>

      <div className="text-center text-[10px] sm:text-sm text-gray-500 py-6 px-4 border-t mt-12">
        © {new Date().getFullYear()} PetroManage — Asset &amp; Operations Management System
      </div>
    </div>
  );
};

export default Compliance;