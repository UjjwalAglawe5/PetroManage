import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReportCard from "./ReportCard";
import UpdateForm from "./UpdateForm";
import { FaFileExport, FaChevronDown } from "react-icons/fa";

const ReportsTable = ({ reports, setReports, onLogAction }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showExportAllDropdown, setShowExportAllDropdown] = useState(false);
  const [showSingleExportDropdown, setShowSingleExportDropdown] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingReport, setEditingReport] = useState(null);

  const rowsPerPage = 8;

  // --- CUSTOM DATE PARSER FOR: "02 January 2026 at 18:38:57" ---
  const parseCustomDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    try {
      // Replaces " at " with a space so the Date constructor recognizes it
      const normalizedStr = dateStr.replace(/\sat\s/i, " ");
      const d = new Date(normalizedStr);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) {
      return null;
    }
  };

  // --- FILTER LOGIC (NextAuditDate + Search) ---
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // 1. Text Search Logic
      const matchesSearch = Object.values(report).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      // 2. NextAuditDate Range Logic
      let matchesDate = true;
      if (fromDate || endDate) {
        const reportDateObj = parseCustomDate(report.NextAuditDate);

        if (!reportDateObj) {
          matchesDate = false;
        } else {
          // Reset time for clean date-to-date comparison
          const rTime = new Date(reportDateObj.getFullYear(), reportDateObj.getMonth(), reportDateObj.getDate()).getTime();

          if (fromDate) {
            const start = new Date(fromDate);
            const sTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
            if (rTime < sTime) matchesDate = false;
          }

          if (endDate) {
            const end = new Date(endDate);
            const eTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
            if (rTime > eTime) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [reports, searchTerm, fromDate, endDate]);

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  const currentReports = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredReports.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredReports, currentPage]);

  // --- EXPORT LOGIC ---
  const handleExport = (data, format, filename) => {
    const exportData = Array.isArray(data) ? data : [data];
    if (exportData.length === 0) return;

    const allKeys = Array.from(new Set(exportData.flatMap(obj => Object.keys(obj))));
    const priority = ["ReportID", "AssetName", "ComplianceStatus", "SafetyScore", "NextAuditDate"];
    const headers = [
      ...priority.filter(key => allKeys.includes(key)),
      ...allKeys.filter(key => !priority.includes(key))
    ];

    switch (format) {
      case "json":
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        downloadBlob(jsonBlob, `${filename}.json`);
        break;

      case "csv":
        const csvRows = [
          headers.join(","),
          ...exportData.map((r) => 
            headers.map((h) => {
              const val = r[h] ?? "-";
              return `"${String(val).replace(/"/g, '""')}"`;
            }).join(",")
          )
        ].join("\n");
        downloadBlob(new Blob([csvRows], { type: "text/csv" }), `${filename}.csv`);
        break;

      case "excel":
        const ws = XLSX.utils.json_to_sheet(exportData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Compliance Data");
        XLSX.writeFile(wb, `${filename}.xlsx`);
        break;

      case "pdf":
        const doc = new jsPDF('l', 'mm', 'a4'); 
        doc.setFontSize(16);
        doc.text(exportData.length === 1 ? `Asset Detail: ${exportData[0].AssetName}` : "Compliance Export", 14, 15);
        
        autoTable(doc, {
          startY: 22,
          head: [headers.map(h => h.replace(/([A-Z])/g, ' $1').trim())], 
          body: exportData.map((row) => headers.map((h) => row[h]?.toString() ?? "-")),
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [15, 23, 42] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { horizontal: 10 },
        });
        doc.save(`${filename}.pdf`);
        break;

      default:
        break;
    }
    setShowExportAllDropdown(false);
    setShowSingleExportDropdown(false);
  };

  const downloadBlob = (blob, name) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  };

  const handleDelete = (reportID) => {
    const reportToDelete = reports.find(r => r.ReportID === reportID);
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    const updatedReports = reports.filter(r => r.ReportID !== reportID);
    setReports(updatedReports);
    localStorage.setItem("complianceReports", JSON.stringify(updatedReports));

    if (onLogAction) {
      onLogAction(reportID, "Deleted Report", `Status: ${reportToDelete?.ComplianceStatus}`, "DELETED");
    }
  };

  const handleUpdateComplete = (updatedReport) => {
    const oldReport = reports.find(r => r.ReportID === updatedReport.ReportID);
    if (onLogAction) {
      const oldVal = `Score: ${oldReport?.SafetyScore}% | Status: ${oldReport?.ComplianceStatus}`;
      const newVal = `Score: ${updatedReport.SafetyScore}% | Status: ${updatedReport.ComplianceStatus}`;
      onLogAction(updatedReport.ReportID, "Updated Report", oldVal, newVal);
    }
    setEditingReport(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto font-sans text-slate-900 bg-slate-50 min-h-screen">
      
      {/* --- TOOLBAR --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="relative group w-full lg:max-w-md">
          <input
            type="text"
            placeholder="Search reports by ID or Asset..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full h-12 pl-6 pr-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 outline-none transition-all font-medium text-sm shadow-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Date Filter specifically for NextAuditDate */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3 shadow-sm h-12">
            <div className="flex flex-col px-2">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Audit Start</span>
              <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} className="text-[10px] font-bold text-slate-700 bg-transparent outline-none cursor-pointer" />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <div className="flex flex-col px-2">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Audit End</span>
              <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="text-[10px] font-bold text-slate-700 bg-transparent outline-none cursor-pointer" />
            </div>
            {(fromDate || endDate) && (
              <button onClick={() => { setFromDate(""); setEndDate(""); setCurrentPage(1); }} className="ml-2 text-slate-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer">Clear</button>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setShowExportAllDropdown(true)} onMouseLeave={() => setShowExportAllDropdown(false)}>
            <button className="cursor-pointer w-full sm:w-auto px-8 h-12 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 justify-center">
              <FaFileExport /> Export
            </button>
            {showExportAllDropdown && (
              <div className="absolute right-0 pt-2 w-full sm:w-44 z-100 animate-in fade-in slide-in-from-top-2">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 overflow-hidden">
                  {['json', 'csv', 'excel', 'pdf'].map((fmt) => (
                    <button key={fmt} onClick={() => handleExport(filteredReports, fmt, "Compliance_Reports_Export")} className="w-full text-left px-5 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition uppercase cursor-pointer">
                      Save as {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Report ID</th>
                <th className="px-8 py-5">Asset Details</th>
                <th className="px-8 py-5 text-center">Safety Score</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <tr key={report.ReportID} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-600 text-xs tabular-nums">{report.ReportID}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-tight">{report.AssetName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-slate-700 text-xs bg-slate-100 px-3 py-1 rounded-lg tabular-nums">{report.SafetyScore}%</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${report.ComplianceStatus?.toLowerCase().includes('compliant') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {report.ComplianceStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-100 lg:opacity-40 lg:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedReport(report)} className="px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-600 bg-slate-50 border border-slate-200 hover:bg-white cursor-pointer">View</button>
                        <button onClick={() => setEditingReport(report)} className="px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 cursor-pointer">Update</button>
                        <button onClick={() => handleDelete(report.ReportID)} className="px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">No reports match the current criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 mb-8 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">
            Showing {currentReports.length} of {filteredReports.length} results
          </span>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 cursor-pointer">Prev</button>
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 cursor-pointer"}`}>{i + 1}</button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev - 1)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 cursor-pointer">Next</button>
          </div>
        </div>
      )}

      {/* --- MODAL: INSPECTION PROFILE --- */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center z-200 p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden border border-slate-200 max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Inspection Profile</h2>
              <button onClick={() => setSelectedReport(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer text-xl">&times;</button>
            </div>

            <div className="p-10 overflow-y-auto bg-slate-50/30 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(selectedReport).map(([key, value]) => (
                  <ReportCard key={key} label={key} value={value} />
                ))}
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-6 justify-between">
              <button onClick={() => { setEditingReport(selectedReport); setSelectedReport(null); }} className="w-full sm:w-auto px-8 h-12 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all text-[10px] uppercase tracking-widest shadow-lg cursor-pointer active:scale-95">Update Status</button>

              <div className="relative group w-full sm:w-auto" onMouseEnter={() => setShowSingleExportDropdown(true)} onMouseLeave={() => setShowSingleExportDropdown(false)}>
                <button className="cursor-pointer w-full sm:w-auto px-8 h-12 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg text-[10px] uppercase tracking-widest hover:bg-slate-800 active:scale-95 flex items-center justify-center gap-2">
                  <FaFileExport /> Export Report <FaChevronDown className="text-[8px] transition-transform group-hover:rotate-180" />
                </button>
                {showSingleExportDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-full sm:min-w-[180px] z-210 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 overflow-hidden">
                      {['json', 'csv', 'excel', 'pdf'].map((fmt) => (
                        <button key={fmt} onClick={() => handleExport(selectedReport, fmt, `Report_${selectedReport.ReportID}`)} className="w-full text-left px-5 py-3 text-[10px] font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition uppercase cursor-pointer flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-slate-300" /> Save as {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setSelectedReport(null)} className="w-full sm:w-auto px-10 h-12 bg-white text-slate-400 border border-slate-200 font-bold rounded-2xl text-[9px] uppercase tracking-widest hover:text-red-500 hover:border-red-100 transition-all cursor-pointer">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: UPDATE FORM --- */}
      {editingReport && (
        <div className="fixed inset-0 flex items-center justify-center z-300 p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-200">
            <UpdateForm reportToUpdate={editingReport} reports={reports} setReports={setReports} onUpdateSuccess={handleUpdateComplete} onClose={() => setEditingReport(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;