import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaHistory,
  FaArrowLeft,
  FaFileExport,
  FaExchangeAlt,
  FaUser,
  FaClock,
  FaSearch,
  FaTrashAlt 
} from "react-icons/fa";

const AuditTrails = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const rowsPerPage = 8; 
  const navigate = useNavigate();

  // Load logs on mount
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("auditLogs") || "[]");
    const sortedLogs = [...savedLogs].reverse();
    setAuditLogs(sortedLogs);
  }, []);

  // Filter logs based on search
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => 
      Object.values(log).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [auditLogs, searchTerm]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

  // Pagination logic
  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredLogs.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLogs, currentPage]);

  const getPaginationGroup = () => {
    let pages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5; 

    if (totalPages <= maxVisiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) end = 3;
      if (currentPage >= totalPages - 1) start = totalPages - 2;
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    if (filteredLogs.length === 0) return;
    const filename = `Audit_Trail_${new Date().toISOString().split('T')[0]}`;
    const headers = ["ReportID", "Action", "OldValue", "NewValue", "User", "Timestamp"];

    switch (format) {
      case "json":
        const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        break;
      case "csv":
        const csv = [headers.join(","), ...filteredLogs.map(l => headers.map(h => `"${l[h] ?? ""}"`).join(","))].join("\n");
        const csvBlob = new Blob([csv], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = csvUrl;
        link.download = `${filename}.csv`;
        link.click();
        break;
      case "excel":
        const ws = XLSX.utils.json_to_sheet(filteredLogs);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AuditLogs");
        XLSX.writeFile(wb, `${filename}.xlsx`);
        break;
      case "pdf":
        const doc = new jsPDF('l', 'mm', 'a4');
        autoTable(doc, {
          head: [headers],
          body: filteredLogs.map(l => headers.map(h => l[h]?.toString() ?? "")),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [15, 23, 42] },
        });
        doc.save(`${filename}.pdf`);
        break;
      default: break;
    }
    setShowExportDropdown(false);
  };

  // --- DELETE ALL LOGS FUNCTION ---
  const handleClearAuditLogs = () => {
    if (auditLogs.length === 0) return;

    // Safety Prompt
    const firstConfirm = window.confirm("Are you sure you want to delete ALL audit logs? This cannot be undone.");
    
    if (firstConfirm) {
      // Clear data
      localStorage.removeItem("auditLogs"); 
      setAuditLogs([]); 
      setCurrentPage(1);
      alert("All audit records have been cleared.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-[1600px] mx-auto font-sans text-slate-900 bg-slate-50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
        <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              <FaArrowLeft className="text-[8px]" /> Return to Compliance
            </button>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
              <FaHistory className="text-emerald-500 shrink-0" /> Audit Trails
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-2xl">
              Monitor every change made to the compliance ecosystem. Use filters to narrow down specific regulatory adjustments.
            </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative group flex-1 md:min-w-[350px]">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter by ID, User, or Action..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-14 pl-12 pr-6 bg-white border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50/50 focus:border-emerald-400 outline-none transition-all font-semibold text-sm shadow-sm"
            />
          </div>

          {/* --- DELETE BUTTON (Wipe History) --- */}
          <button 
            onClick={handleClearAuditLogs}
            disabled={auditLogs.length === 0}
            className="w-full md:w-auto px-6 h-14 bg-white text-red-600 border-2 border-red-100 font-black rounded-2xl transition-all shadow-sm text-[11px] uppercase tracking-[0.15em] hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <FaTrashAlt className="text-sm" /> Wipe History
          </button>

          {/* Export Button */}
          <div className="relative" onMouseEnter={() => setShowExportDropdown(true)} onMouseLeave={() => setShowExportDropdown(false)}>
            <button className="w-full md:w-auto px-10 h-14 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 text-[11px] uppercase tracking-[0.15em] hover:bg-emerald-600 active:scale-95 flex items-center justify-center gap-3 cursor-pointer">
              <FaFileExport /> Export
            </button>
            {showExportDropdown && (
              <div className="absolute right-0 pt-2 w-full md:w-56 z-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl py-3 px-2 overflow-hidden">
                  {['json', 'csv', 'excel', 'pdf'].map((fmt) => (
                    <button 
                        key={fmt} 
                        onClick={() => handleExport(fmt)} 
                        className="w-full text-left px-5 py-3 text-[10px] font-black text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition uppercase cursor-pointer flex items-center justify-between"
                    >
                      Save as {fmt}
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- TABLE (Desktop) --- */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Operation</th>
                <th className="px-10 py-6">Change Manifest</th>
                <th className="px-10 py-6">Initiator</th>
                <th className="px-10 py-6 text-right">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentLogs.length > 0 ? (
                currentLogs.map((log, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6 font-black text-slate-800 text-xs tabular-nums tracking-tight">{log.ReportID}</td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border shadow-sm flex items-center w-fit gap-2 ${
                        log.Action?.includes('Deleted') ? 'bg-red-50 text-red-600 border-red-100' : 
                        log.Action?.includes('Created') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${log.Action?.includes('Deleted') ? 'bg-red-400' : 'bg-emerald-400'}`} />
                        {log.Action}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-xs">
                          {log.OldValue && log.NewValue && log.OldValue !== "-" && log.OldValue !== "NONE" ? (
                            <div className="flex items-center gap-3 font-semibold">
                              <span className="text-slate-300 line-through px-2 py-1 bg-slate-50 rounded-lg">{log.OldValue}</span>
                              <FaExchangeAlt className="text-[10px] text-emerald-500" />
                              <span className="text-slate-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{log.NewValue}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-lg italic">{log.NewValue || '-'}</span>
                          )}
                        </div>
                    </td>
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                                <FaUser />
                            </div>
                            <span className="text-xs font-black text-slate-700">{log.User}</span>
                        </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                        <span className="font-black text-slate-400 text-[10px] tabular-nums tracking-tighter bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 italic">{log.Timestamp}</span>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EMPTY STATE --- */}
      {currentLogs.length === 0 && (
         <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 mb-8">
            <FaHistory className="text-slate-100 text-6xl mx-auto mb-4" />
            <p className="text-slate-400 text-xs font-black tracking-[0.2em] uppercase">No audit history found</p>
         </div>
      )}

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-200 mb-8 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:ml-4">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3 rounded-2xl border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-slate-50 transition-all cursor-pointer text-slate-600 active:scale-95"
            >
              Back
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3 rounded-2xl border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-slate-50 transition-all cursor-pointer text-slate-600 active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTrails;