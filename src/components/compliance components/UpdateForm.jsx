import React, { useState, useEffect } from "react";
import axios from '../../config/axiosConfig';
import Select from "react-select"; // Added React Select
import {
  FaCheckCircle,
  FaUserTie,
  FaCalendarAlt,
  FaLock,
  FaEdit,
  FaTimes
} from "react-icons/fa";

const UpdateForm = ({ onClose, report, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    safetyScore: "",
    complianceStatus: null, // Changed to null for React Select
  });

  const calibriStyle = { fontFamily: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif" };

  // Options for Compliance Status dropdown
  const complianceStatusOptions = [
    { value: "COMPLIANT", label: "Compliant" },
    { value: "NON_COMPLIANT", label: "Non-Compliant" },
    { value: "PENDING_REVIEW", label: "Pending Review" },
  ];

  useEffect(() => {
    if (report) {
      const currentStatus = report.complianceStatus ? report.complianceStatus.toUpperCase() : "PENDING_REVIEW";
      setFormData({
        safetyScore: report.safetyScore || 0,
        complianceStatus: complianceStatusOptions.find(opt => opt.value === currentStatus) || complianceStatusOptions[2],
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (option) => {
    setFormData((prev) => ({ ...prev, complianceStatus: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      reportId: report.reportId,
      asset: {
        assetId: report.asset?.assetId || report.assetId
      },
      assetName: report.assetName,
      reportType: report.reportType,
      safetyScore: Number(formData.safetyScore),
      complianceStatus: formData.complianceStatus.value, // Extract value from object
      inspector: report.inspector,
      nextAuditDate: report.nextAuditDate,
      generatedDate: report.generatedDate
    };

    try {
      const URL = `http://localhost:8080/compliance-service/api/compliance/reports/${report.reportId}`;
      const response = await axios.put(URL, payload);

      if (response.status === 200 || response.status === 204) {
        if (onUpdateSuccess) await onUpdateSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update report.");
    }
  };

  const handleDiscard = (e) => {
    if (e) e.preventDefault();
    const currentStatus = report.complianceStatus ? report.complianceStatus.toUpperCase() : "PENDING_REVIEW";
    setFormData({
      safetyScore: report.safetyScore || 0,
      complianceStatus: complianceStatusOptions.find(opt => opt.value === currentStatus),
    });
  };

  // Custom styles for React Select to match your theme
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      ...calibriStyle,
      borderRadius: '0.75rem',
      fontSize: '15px',
      minHeight: '48px',
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#10b981' : '#a7f3d0', // Emerald-200 to Emerald-500
      boxShadow: state.isFocused ? '0 0 0 1px #10b981' : 'none',
      '&:hover': { borderColor: '#10b981' },
      cursor: 'pointer',
      fontWeight: '700'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      ...calibriStyle,
      fontSize: '14px',
      padding: '12px',
      backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      cursor: 'pointer',
    })
  };

  if (!report) return null;

  const labelClasses = "flex items-center gap-2 text-[11px] sm:text-[15px] font-black uppercase tracking-widest mb-1.5 transition-all";
  const disabledClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[15px] text-slate-400 font-semibold cursor-not-allowed shadow-inner";
  const editableClasses = "w-full bg-white border border-emerald-200 rounded-xl p-3.5 text-[15px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-slate-900 shadow-sm";

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col h-[95vh] sm:h-auto sm:max-h-[90vh] animate-in fade-in zoom-in duration-300"
      style={calibriStyle}
    >

      {/* HEADER SECTION */}
      <div className="bg-slate-900 px-5 py-4 sm:px-8 sm:py-6 text-white flex items-center justify-between border-b-4 border-amber-500 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="hidden xs:flex p-2.5 bg-slate-800 rounded-xl shrink-0">
            <FaEdit className="text-amber-500 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-2xl font-black tracking-tighter uppercase truncate">Update Metrics</h2>
            <p className="text-slate-400 text-[9px] sm:text-[14px] font-bold uppercase tracking-widest truncate">
              ID: <span className="text-amber-400 text-base sm:text-xl">{report.reportId}</span>
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="cursor-pointer w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0">
          <FaTimes className="text-lg sm:text-xl" />
        </button>
      </div>

      {/* FORM CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-10 bg-slate-50/30">
        <form id="update-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaLock className="opacity-50" /> Asset Name</label>
            <input type="text" disabled value={report.assetName || ""} className={disabledClasses} />
          </div>

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaLock className="opacity-50" /> Report Type</label>
            <input type="text" disabled value={report.reportType || ""} className={disabledClasses} />
          </div>

          <div className="space-y-1 group">
            <label className={`${labelClasses} text-emerald-600`}><FaCheckCircle /> Safety Score (0-100)</label>
            <input
              type="number"
              name="safetyScore"
              value={formData.safetyScore}
              onChange={handleChange}
              min="0" max="100"
              className={editableClasses}
              required
            />
          </div>

          {/* Updated to React Select */}
          <div className="space-y-1 group">
            <label className={`${labelClasses} text-emerald-600`}><FaCheckCircle /> Compliance Status</label>
            <Select
              options={complianceStatusOptions}
              value={formData.complianceStatus}
              onChange={handleSelectChange}
              styles={selectStyles}
              placeholder="Set status..."
              required
              menuPortalTarget={document.body}
              menuPlacement="auto"
            />
          </div>

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaUserTie className="opacity-50" /> Inspector</label>
            <input type="text" disabled value={report.inspector || ""} className={disabledClasses} />
          </div>

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaCalendarAlt className="opacity-50" /> Next Audit Date</label>
            <input type="text" disabled value={report.nextAuditDate || ""} className={disabledClasses} />
          </div>

        </form>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-5 sm:p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={handleDiscard}
          className="cursor-pointer w-full sm:w-auto px-6 py-3 text-slate-500 font-bold text-[13px] sm:text-[15px] uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all order-2 sm:order-1"
        >
          Discard Changes
        </button>

        <button
          form="update-form"
          type="submit"
          className="cursor-pointer w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[13px] sm:text-[15px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 sm:hover:-translate-y-1 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 order-1 sm:order-2"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateForm;