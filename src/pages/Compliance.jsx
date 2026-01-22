import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  FaHistory, FaArrowLeft, FaPlus, FaChevronDown, FaFileCsv,
  FaFilePdf, FaFileExcel, FaCode, FaChevronLeft, FaChevronRight,
  FaSearch, FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck } from 'lucide-react';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
 
// Sub-components
import Card from "../components/compliance components/Card.jsx";
import ReportForm from "../components/compliance components/ReportForm.jsx";
import ReportsTable from "../components/compliance components/ReportsTable.jsx";
 
// --- Animation Variants ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
 
const itemVar = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
 
// --- EXTERNAL COMPONENT: AuditView ---
const AuditView = ({
  setView, filteredLogs, indexOfFirstLog, indexOfLastLog,
  searchInput, setSearchInput, fromDate, setFromDate,
  endDate, setEndDate, showExportDropdown, setShowExportDropdown,
  exportData, dropdownRef, currentLogs, currentPage,
  setCurrentPage, totalPages, logsPerPage
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <button
        onClick={() => setView("dashboard")}
        className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all group mb-8 shadow-lg cursor-pointer"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
 
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <FaHistory className="text-emerald-500" /> Audit History
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">
            Displaying {filteredLogs.length > 0 ? indexOfFirstLog + 1 : 0} - {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} Activities
          </p>
        </div>
 
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative h-12 w-64">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by ID or Action..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-full w-full pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none shadow-sm transition-all"
            />
          </div>
 
          {/* Date Range */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 h-12 shadow-sm">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
            />
            <div className="h-4 w-px bg-slate-200 mx-3" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
            />
          </div>
 
          {/* Export Dropdown */}
          <div className="relative h-12" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="h-full px-6 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3 uppercase cursor-pointer"
            >
              Export
              <FaChevronDown className={`transition-transform duration-300 ${showExportDropdown ? "rotate-180" : ""}`} />
            </button>
 
            <AnimatePresence>
              {showExportDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {[
                    { id: 'json', icon: <FaCode className="text-blue-500" />, label: 'JSON Data' },
                    { id: 'csv', icon: <FaFileCsv className="text-emerald-500" />, label: 'CSV Report' },
                    { id: 'excel', icon: <FaFileExcel className="text-green-600" />, label: 'Excel Sheet' },
                    { id: 'pdf', icon: <FaFilePdf className="text-red-500" />, label: 'PDF Document' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => exportData(opt.id)}
                      className="w-full px-5 py-4 text-left text-[11px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
 
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black">
                <th className="px-8 py-6">Report ID</th>
                <th className="px-8 py-6">Action Performed</th>
                <th className="px-8 py-6">Previous State</th>
                <th className="px-8 py-6">Modified State</th>
                <th className="px-8 py-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <FaSearch size={40} />
                        <p className="font-black uppercase tracking-widest text-xs">No Results Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log, i) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5 font-bold text-slate-900 text-xs">{log.ReportID}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          log.Action.includes("Deleted") ? "bg-red-50 text-red-600" :
                          log.Action.includes("Created") ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {log.Action}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-400 italic text-[10px] truncate max-w-[120px]">{log.OldValue}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-700 font-bold text-[10px] truncate max-w-[120px]">{log.NewValue}</p>
                      </td>
                      <td className="px-8 py-5 text-slate-400 font-medium tabular-nums text-[11px]">
                        {log.Timestamp}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
 
        {totalPages > 1 && (
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-emerald-50 hover:text-emerald-600 transition-all cursor-pointer shadow-sm"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-emerald-50 hover:text-emerald-600 transition-all cursor-pointer shadow-sm"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
 
// --- MAIN COMPONENT: Compliance ---
export const Compliance = () => {
  const [view, setView] = useState("dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const logsPerPage = 8;
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);
 
  useEffect(() => {
    const handler = setTimeout(() => setLogSearchTerm(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);
 
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("complianceReports") || "[]");
    const savedLogs = JSON.parse(localStorage.getItem("auditLogs") || "[]");
    setReports(savedReports);
    setAuditLogs(savedLogs);
 
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowExportDropdown(false);
    };
    window.addEventListener("mousedown", closeDropdown);
    return () => window.removeEventListener("mousedown", closeDropdown);
  }, []);
 
  const parseLogDate = useCallback((str) => {
    if (!str) return null;
    const [datePart] = str.split(",");
    const [d, m, y] = datePart.split("/");
    return new Date(y, m - 1, d);
  }, []);
 
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch = !logSearchTerm ||
        Object.values(log).some(v => String(v).toLowerCase().includes(logSearchTerm.toLowerCase()));
 
      let matchesDate = true;
      if (fromDate || endDate) {
        const logDate = parseLogDate(log.Timestamp);
        if (logDate) {
          const lTime = logDate.getTime();
          if (fromDate && lTime < new Date(fromDate).setHours(0,0,0,0)) matchesDate = false;
          if (endDate && lTime > new Date(endDate).setHours(0,0,0,0)) matchesDate = false;
        } else matchesDate = false;
      }
      return matchesSearch && matchesDate;
    });
  }, [auditLogs, logSearchTerm, fromDate, endDate, parseLogDate]);
 
  const addAuditLog = (reportId, action, oldValue = "-", newValue = "-") => {
    const newLog = {
      ReportID: reportId || "N/A",
      Action: action,
      OldValue: oldValue,
      NewValue: newValue,
      User: "System Administrator",
      Timestamp: new Date().toLocaleString("en-GB")
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem("auditLogs", JSON.stringify(updated));
  };
 
  const exportData = (type) => {
    const fileName = `AuditLog_${new Date().getTime()}`;
    const headers = ["Report ID", "Action", "User", "Old Value", "New Value", "Timestamp"];
    const rows = filteredLogs.map(l => [l.ReportID, l.Action, l.User, l.OldValue, l.NewValue, l.Timestamp]);
 
    if (type === "json") {
      const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `${fileName}.json`; link.click();
    } else if (type === "csv") {
      const ws = XLSX.utils.json_to_sheet(filteredLogs);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `${fileName}.csv`; link.click();
    } else if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredLogs);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Audit Trail");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else if (type === "pdf") {
      const doc = new jsPDF("l", "mm", "a4");
      autoTable(doc, { head: [headers], body: rows, styles: { fontSize: 7 } });
      doc.save(`${fileName}.pdf`);
    }
    setShowExportDropdown(false);
  };
 
  const dynamicStats = useMemo(() => {
    if (!reports.length) return { "Overall Compliance": "0%", "Safety Score": "0", "Pending": "0", "Audits": "0" };
    const compliant = reports.filter(r => r.ComplianceStatus === "Compliant").length;
    const score = reports.reduce((a, b) => a + Number(b.SafetyScore || 0), 0);
    return {
      "✅ Overall Compliance": `${Math.round((compliant / reports.length) * 100)}%`,
      "🛡️ Safety Score": `${Math.round(score / reports.length)}`,
      "📋 Pending Reviews": reports.filter(r => r.ComplianceStatus === "Pending Review").length,
      "📅 Upcoming Audits": reports.filter(r => r.NextAuditDate && new Date(r.NextAuditDate) >= new Date().setHours(0,0,0,0)).length
    };
  }, [reports]);
 
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div
            key="dash"
            variants={containerVar} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="w-full pt-4">
              <div className="relative overflow-hidden text-white rounded-xl sm:rounded-xl px-4 py-3 sm:px-12 sm:py-5.5 bg-slate-900 shadow-2xl">
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl md:text-4xl font-black mb-3 tracking-tight flex items-center gap-3">
                    <FileCheck size={50} className="text-emerald-400" />
                    Compliance <span className="text-emerald-400">&amp;</span> Safety
                  </h2>
                  <p className="text-slate-400 font-medium text-xs sm:text-base mx-auto pl-14">
                    Centralized regulatory tracking and real-time safety audit management for industrial assets.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
              </div>
            </div>
 
            {/* Stats Cards */}
            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-10 px-4">
              <Card data={dynamicStats} />
            </motion.div>
 
            {/* Action Button */}
            <motion.div variants={itemVar} className="flex justify-center mt-12 px-4">
              <button
                onClick={() => setShowPopup(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all cursor-pointer text-xs uppercase tracking-[0.2em]"
              >
                <FaPlus /> Generate New Report
              </button>
            </motion.div>
 
            {/* Table Section */}
            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-16 px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                  <div className="h-10 w-2 bg-emerald-500 rounded-full" /> Active Reports
                </h2>
                <button
                  onClick={() => setView("audit")}
                  className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] uppercase tracking-widest cursor-pointer shadow-sm"
                >
                  <FaHistory /> Audit Logs
                </button>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 overflow-hidden">
                <ReportsTable reports={reports} setReports={setReports} onLogAction={addAuditLog} />
              </div>
            </motion.div>
 
            {/* Modal */}
            <AnimatePresence>
              {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl"
                  >
                    <ReportForm onClose={() => setShowPopup(false)} reports={reports} setReports={setReports} onLogAction={addAuditLog} />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <AuditView
            key="audit"
            setView={setView} filteredLogs={filteredLogs}
            indexOfFirstLog={(currentPage-1)*logsPerPage} indexOfLastLog={currentPage*logsPerPage}
            searchInput={searchInput} setSearchInput={setSearchInput}
            fromDate={fromDate} setFromDate={setFromDate}
            endDate={endDate} setEndDate={setEndDate}
            showExportDropdown={showExportDropdown} setShowExportDropdown={setShowExportDropdown}
            exportData={exportData} dropdownRef={dropdownRef}
            currentLogs={filteredLogs.slice((currentPage-1)*logsPerPage, currentPage*logsPerPage)}
            currentPage={currentPage} setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(filteredLogs.length/logsPerPage)} logsPerPage={logsPerPage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
 
export default Compliance;