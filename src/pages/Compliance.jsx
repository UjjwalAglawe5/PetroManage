import React, { useState, useEffect } from "react";
import { FileCheck } from "lucide-react";
import { FaHistory, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../components/compliance components/Card.jsx";
import ReportsTable from "../components/compliance components/ReportsTable.jsx";
import ReportForm from "../components/compliance components/ReportForm.jsx";
import AuditView from "../components/compliance components/AuditView.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [view, setView] = useState("dashboard"); // Added to manage views
  const [showPopup, setShowPopup] = useState(false);
  const [reports, setReports] = useState([]);

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div
            key="dashboard-view"
            variants={containerVar}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="w-full pt-4">
              <div className="relative overflow-hidden text-white rounded-xl px-4 py-6 sm:px-12 bg-slate-900 shadow-2xl">
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight flex items-center gap-3">
                    <FileCheck size={50} className="text-emerald-400 shrink-0" />
                    <span>Compliance <span className="text-emerald-400">&amp;</span> Safety</span>
                  </h2>
                  <p className="text-slate-400 font-medium text-xs sm:text-base pl-15.5">
                    Centralized regulatory tracking and real-time safety audit management.
                  </p>
                </div>
              </div>
            </div>

            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-10 px-4">
              <Card data={stats} />
            </motion.div>

            <motion.div variants={itemVar} className="flex justify-center mt-12 px-4">
              <button onClick={() => setShowPopup(true)} className="w-full sm:w-auto flex items-center justify-center gap-4 bg-emerald-600 text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-emerald-500 cursor-pointer text-xs uppercase tracking-widest transition-all">
                <FaPlus size={18} /> Generate New Report
              </button>
            </motion.div>

            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-16 px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                  <div className="h-10 w-2 bg-emerald-500 rounded-full" /> Active Reports
                </h2>
                <button onClick={() => setView("audit")} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] uppercase tracking-widest cursor-pointer">
                  <FaHistory /> Audit Logs
                </button>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-2">
                <ReportsTable reports={reports} setReports={setReports} fetchReports={fetchReports} />
              </div>
            </motion.div>

            <AnimatePresence>
              {showPopup && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-2xl">
                    <ReportForm onClose={() => setShowPopup(false)} reports={reports} setReports={setReports} fetchReports={fetchReports} />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <AuditView key="audit-view" setView={setView} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Compliance;