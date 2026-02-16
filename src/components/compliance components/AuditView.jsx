import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHistory, FaArrowLeft, FaSearch, FaChevronDown,
  FaFileExport, FaTimes, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import axios from '../../config/axiosConfig';
import { handleExport } from "./exportutil";

const AuditView = ({ setView }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const calibriStyle = { fontFamily: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif" };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const getAudit = async () => {
      try {
        const URL = "http://localhost:8080/compliance-service/api/compliance/audit-log";
        const response = await axios.get(URL);
        setData(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      }
    };
    getAudit();
  }, []);

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const parseCustomDate = (dateStr) => {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split("/");
    return new Date(year, month - 1, day);
  };

  const filteredReports = data.filter((log) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      log.action?.toLowerCase().includes(query) ||
      log.user?.toLowerCase().includes(query) ||
      log.oldValue?.toLowerCase().includes(query) ||
      log.newValue?.toLowerCase().includes(query) ||
      log.reportIdDisplay?.toString().includes(query);

    let matchesDate = true;
    if (startDate || endDate) {
      const logDate = parseCustomDate(log.timestamp);
      if (!logDate) return false;

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && logDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && logDate <= end;
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6"
      style={calibriStyle}
    >
      {/* Navigation Header - Responsive Flex */}
      <div className="flex flex-col lg:flex-row items-center mb-6 lg:mb-10 relative gap-4">
        <button
          onClick={() => setView("dashboard")}
          className="w-full lg:w-auto lg:absolute lg:left-0 flex items-center justify-center gap-2 px-5 py-3 text-[14px] sm:text-[15px] font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg cursor-pointer z-10"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 inline-flex items-center gap-3">
            <FaHistory className="text-emerald-500 hidden xs:inline size-7 sm:size-9" /> Audit History
          </h1>
          <p className="text-slate-500 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">
            Showing {filteredReports.length} Activities
          </p>
        </div>
      </div>

      {/* Filter Toolbar - Stack on mobile, row on large screens */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">

        {/* Search Input */}
        <div className="flex-1 w-full xl:max-w-sm">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm sm:text-[15px] font-bold outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Date & Export Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Date Picker Group */}
          <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-3 sm:px-4 h-12 w-full sm:w-auto overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[11px] sm:text-[14px] font-black uppercase outline-none bg-transparent text-slate-600 cursor-pointer min-w-[100px]"
              />
              <span className="text-slate-300 text-[11px] sm:text-[13px] font-bold">TO</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[11px] sm:text-[14px] font-black uppercase outline-none bg-transparent text-slate-600 cursor-pointer min-w-[100px]"
              />
            </div>
            {(startDate || endDate) && (
              <button onClick={clearDates} className="cursor-pointer p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors shrink-0">
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Export Button Dropdown */}
          <div className="relative h-12 w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="w-full h-full px-6 bg-slate-900 text-white text-[11px] sm:text-[12px] font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3 uppercase cursor-pointer"
            >
              <FaFileExport className="text-emerald-400" /> Export <FaChevronDown className={`text-[8px] transition-transform ${showExportDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showExportDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 left-0 sm:left-auto mt-3 w-full sm:w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {['json', 'excel', 'pdf'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        handleExport(opt, filteredReports);
                        setShowExportDropdown(false);
                      }}
                      className="w-full px-5 py-4 text-left text-[12px] sm:text-[13px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0 cursor-pointer transition-colors uppercase"
                    >
                      Save as {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[13px] sm:text-[15px] uppercase tracking-[0.15em] text-slate-400 font-black">
                <th className="px-4 sm:px-6 py-6 text-center w-[12%]">ID</th>
                <th className="px-4 sm:px-6 py-6 text-center w-[20%]">Action</th>
                <th className="px-4 sm:px-6 py-6 text-center w-[24%]">Previous</th>
                <th className="px-4 sm:px-6 py-6 text-center w-[24%]">Modified</th>
                <th className="px-4 sm:px-6 py-6 text-center w-[20%]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? (
                currentItems.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-slate-50/50 transition-colors h-20">
                    <td className="px-4 py-4 text-center whitespace-nowrap font-bold text-sm sm:text-[15px] tabular-nums text-slate-900">
                      {log.reportIdDisplay || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center justify-center w-full max-w-[140px] py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[14px] font-black uppercase border whitespace-nowrap ${log.action?.includes("DELETE") ? "bg-red-50 text-red-600 border-red-100" :
                          log.action?.includes("CREATE") ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                          {log.action || "UPDATE"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="text-slate-400 italic text-[12px] sm:text-[13px] truncate px-2" title={log.oldValue}>{log.oldValue || "—"}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="text-slate-700 font-bold text-[12px] sm:text-[13px] truncate px-2" title={log.newValue}>{log.newValue || "—"}</p>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-400 text-[11px] sm:text-[13px] tabular-nums whitespace-nowrap">
                      {log.timestamp || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold text-[15px] uppercase tracking-widest">
                    No matching audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls - Optimized for Mobile Stacking */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8 px-2 pb-10">
          <p className="text-[12px] sm:text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] order-2 md:order-1 text-center">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} Reports
          </p>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                      className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 flex items-center justify-center rounded-xl font-black text-[12px] sm:text-[13px] transition-all cursor-pointer shadow-sm shrink-0 ${currentPage === page
                        ? "bg-slate-900 text-white shadow-lg z-10"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                }
                if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages)) {
                  return <span key={page} className="w-6 text-center text-slate-400 font-bold text-[13px]">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuditView;