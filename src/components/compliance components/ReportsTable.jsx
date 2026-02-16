import React, { useState, useEffect } from "react";
import axios from '../../config/axiosConfig';
import ReportCard from "./ReportCard";
import UpdateForm from "./UpdateForm";
import Swal from 'sweetalert2';
import {
  FaFileExport,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { handleExport } from "./exportutil.js";

const API_BASE_URL = "http://localhost:8080/compliance-service/api/compliance/reports";

const ReportsTable = ({ reports, setReports, fetchReports }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [showExportAllDropdown, setShowExportAllDropdown] = useState(false);
  const [showSingleExportDropdown, setShowSingleExportDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const calibriStyle = { fontFamily: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif" };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  const triggerExport = (data, format) => {
    handleExport(format, data);
    setShowExportAllDropdown(false);
    setShowSingleExportDropdown(false);
  };

  const handleDelete = async (reportId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete report: ${reportId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/${reportId}`);
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        toast.fire({
          icon: 'success',
          title: 'Deleted successfully'
        });

        await fetchReports();
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire('Error', 'Could not delete the report.', 'error');
      }
    }
  };

  const handleUpdateComplete = () => {
    fetchReports();
    setEditingReport(null);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.inspector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.complianceStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportId?.toString().includes(searchTerm);

    let matchesDate = true;
    if (startDate || endDate) {
      const auditDate = new Date(report.nextAuditDate).setHours(0, 0, 0, 0);
      if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        matchesDate = matchesDate && auditDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate).setHours(0, 0, 0, 0);
        matchesDate = matchesDate && auditDate <= end;
      }
    }
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto text-slate-900 bg-slate-50 min-h-screen" style={calibriStyle}>

      {/* --- TOOLBAR --- */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6 sm:mb-8 bg-white p-3 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full xl:max-w-sm">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Report..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm sm:text-[15px] font-bold outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all"
              style={calibriStyle}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-3 sm:px-4 h-12 w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs sm:text-[15px] font-black uppercase outline-none bg-transparent text-slate-600 cursor-pointer"
                style={calibriStyle}
              />
              <span className="text-slate-300 text-[11px] sm:text-[15px] font-bold">TO</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs sm:text-[15px] font-black uppercase outline-none bg-transparent text-slate-600 cursor-pointer"
                style={calibriStyle}
              />
            </div>
            {(searchTerm || startDate || endDate) && (
              <button onClick={clearFilters} className="cursor-pointer p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors">
                <FaTimes size={14} />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-auto" onMouseEnter={() => setShowExportAllDropdown(true)} onMouseLeave={() => setShowExportAllDropdown(false)}>
            <button
              className="w-full sm:w-auto cursor-pointer px-6 h-12 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg text-[11px] sm:text-[12px] uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2 whitespace-nowrap"
              style={calibriStyle}
            >
              <FaFileExport className="text-emerald-400" /> Export All
            </button>
            {showExportAllDropdown && (
              <div className="absolute right-0 left-0 sm:left-auto pt-2 w-full sm:w-44 z-[100] animate-in fade-in slide-in-from-top-2">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 overflow-hidden">
                  {['json', 'excel', 'pdf'].map((fmt) => (
                    <button key={fmt} onClick={() => triggerExport(filteredReports, fmt)} style={calibriStyle} className="w-full text-left px-5 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition uppercase cursor-pointer">
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
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[13px] sm:text-[15px] font-black uppercase tracking-[0.15em]">
                <th className="px-4 sm:px-8 py-5 text-center">Report ID</th>
                <th className="px-4 sm:px-8 py-5 text-center">Asset Details</th>
                <th className="px-4 sm:px-8 py-5 text-center">Safety Score</th>
                <th className="px-4 sm:px-8 py-5 text-center">Status</th>
                <th className="px-4 sm:px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map((report) => (
                  <tr key={report.reportId} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4 sm:py-6 font-bold text-black text-sm sm:text-[15px] text-center">{report.reportId}</td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-center text-sm sm:text-[15px] font-bold text-slate-800">{report.assetName}</td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-center">
                      <span className="inline-flex items-center justify-center w-14 sm:w-16 font-black text-slate-700 text-xs sm:text-[13px] bg-slate-100 py-1 rounded-lg">{report.safetyScore}%</span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-center">
                      <span className={`inline-flex items-center justify-center w-28 sm:w-32 py-1.5 rounded-full text-[11px] sm:text-[13px] font-black uppercase border shadow-sm
                        ${report.complianceStatus?.toLowerCase().includes('non')
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {report.complianceStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setSelectedReport(report)} style={calibriStyle} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold uppercase bg-slate-50 border border-slate-200 hover:bg-white cursor-pointer transition-colors text-[11px] sm:text-[13px]">View</button>
                        <button onClick={() => setEditingReport(report)} style={calibriStyle} className="text-[11px] sm:text-[13px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 cursor-pointer">Update</button>
                        <button onClick={() => handleDelete(report.reportId)} style={calibriStyle} className="text-[11px] sm:text-[13px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold uppercase text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-8 py-16 sm:py-20 text-center text-slate-400 text-sm sm:text-[15px] font-bold uppercase tracking-widest">No reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mt-6 md:mt-8 px-2 pb-6">
          <p className="text-[11px] sm:text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] text-center md:text-left">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} Reports
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shrink-0"
            >
              <FaChevronLeft size={12} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isFirstPage = page === 1;
                const isLastPage = page === totalPages;
                const isAdjacent = Math.abs(page - currentPage) <= 1;

                if (isFirstPage || isLastPage || isAdjacent) {
                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      style={calibriStyle}
                      className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 flex items-center justify-center rounded-xl font-black text-[12px] sm:text-[13px] transition-all cursor-pointer ${currentPage === page
                        ? "bg-slate-900 text-white shadow-lg scale-105 z-10"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1 text-slate-400 font-black">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shrink-0"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {selectedReport && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center z-[200] p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[2rem] sm:rounded-4xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden border border-white/20 max-h-[92vh] sm:max-h-[85vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-center bg-white sticky top-0 z-10">
              <div className="flex flex-col items-center">
                <h2 className="text-lg sm:text-[24px] font-black text-slate-900 uppercase tracking-tight text-center" style={calibriStyle}>Inspection Profile</h2>
                <div className="h-1 w-12 bg-emerald-500 rounded-full mt-1" />
              </div>
              <button onClick={() => setSelectedReport(null)} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer border border-slate-100">
                <span className="text-xl font-bold">&times;</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-50/30 flex-1">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(selectedReport).map(([key, value]) => {
                  let displayValue = value;
                  if (value && typeof value === 'object') displayValue = value.assetName || value.assetId || value.id || "Linked Data";
                  if (key.toLowerCase().includes("date") && typeof displayValue === "string") displayValue = displayValue.split("T")[0];
                  if (typeof displayValue === "string" && displayValue.includes("_")) {
                    displayValue = displayValue.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  }
                  return <ReportCard key={key} label={key} value={displayValue} />;
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-row items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[14px] font-black text-black uppercase tracking-[0.1em] truncate" style={calibriStyle}>
                ID: {selectedReport.reportId}
              </span>

              <div
                className="relative"
                onMouseEnter={() => setShowSingleExportDropdown(true)}
                onMouseLeave={() => setShowSingleExportDropdown(false)}
              >
                <button
                  onClick={() => setShowSingleExportDropdown(!showSingleExportDropdown)}
                  className="px-4 h-9 bg-slate-900 text-white font-bold rounded-xl shadow-md text-[9px] sm:text-[11px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  style={calibriStyle}
                >
                  <FaFileExport className="text-emerald-400" /> Export
                </button>

                {showSingleExportDropdown && (
                  <div className="absolute bottom-full right-0 pb-2 w-32 sm:w-40 z-30">
                    <div className="bg-slate-900 rounded-xl shadow-xl py-1 overflow-hidden border-b-2 border-emerald-500">
                      {['json', 'excel', 'pdf'].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => triggerExport([selectedReport], fmt)}
                          className="w-full text-left px-4 py-2.5 text-[10px] font-black text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors uppercase cursor-pointer"
                          style={calibriStyle}
                        >
                          Save as {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingReport && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto" style={calibriStyle}>
            <UpdateForm report={editingReport} onUpdateSuccess={handleUpdateComplete} onClose={() => setEditingReport(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;