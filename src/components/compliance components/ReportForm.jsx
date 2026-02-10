import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaClipboardList, FaShieldAlt, FaCheckCircle, FaUserTie,
  FaCalendarAlt, FaIndustry, FaTimes
} from "react-icons/fa";

const ReportForm = ({ onClose, fetchReports }) => {
  const [dynamicAssets, setDynamicAssets] = useState([]);

  useEffect(() => {
    const URL = "http://localhost:8080/assets-service/api/assets";
    const fetchAssets = async () => {
      try {
        const response = await axios.get(URL);
        const assets = response.data.map((asset) => ({
          value: asset.assetId,
          label: asset.name
        }));
        setDynamicAssets(assets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const initialFormState = {
    reportType: "",
    asset: null,
    safetyScore: "",
    complianceStatus: "",
    inspector: "",
    nextAuditDate: new Date(),
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleDiscard = (e) => {
    if (e) e.preventDefault();
    setFormData(initialFormState);
    document.getElementById("report-form").reset();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetChange = (option) => {
    setFormData((prev) => ({ ...prev, asset: option }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, nextAuditDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.asset) {
      alert("Please select an asset");
      return;
    }

    const statusMapping = {
      "Compliant": "COMPLIANT",
      "Non-Compliant": "NON_COMPLIANT",
      "Pending Review": "PENDING_REVIEW"
    };

    const typeMapping = {
      "Safety Compliance": "SAFETY_COMPLIANCE",
      "Environmental Compliance": "ENVIRONMENTAL_COMPLIANCE",
      "Regulatory": "REGULATORY"
    };

    const payload = {
      asset: { assetId: Number(formData.asset.value) },
      assetName: formData.asset.label,
      reportType: typeMapping[formData.reportType],
      safetyScore: Number(formData.safetyScore),
      complianceStatus: statusMapping[formData.complianceStatus],
      inspector: formData.inspector,
      nextAuditDate: formData.nextAuditDate.toISOString().split('T')[0],
      generatedDate: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post("http://localhost:8080/compliance-service/api/compliance/reports", payload);
      if (response.status === 200 || response.status === 201) {
        onClose();
        if (fetchReports) await fetchReports();
        alert("Success! Report saved.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to save. Check server.");
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.75rem',
      fontSize: '14px',
      minHeight: '48px',
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#10b981' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 1px #10b981' : 'none',
      '&:hover': { borderColor: '#10b981' },
      cursor: 'pointer'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      fontSize: '14px',
      padding: '12px',
      backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      cursor: 'pointer',
    })
  };

  const inputClasses = "w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-semibold shadow-sm";
  const labelClasses = "flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">

      {/* HEADER: Responsive padding and font size */}
      <div className="bg-slate-900 px-5 py-4 sm:px-8 sm:py-6 text-white flex items-center justify-between border-b-4 border-emerald-500 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="p-2.5 bg-slate-800 rounded-xl hidden xs:flex items-center justify-center shrink-0">
            <FaIndustry className="text-emerald-500 text-lg sm:text-2xl" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-2xl font-black tracking-tighter truncate">Generate Report</h2>
            <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">Asset Operations</p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0">
          <FaTimes className="cursor-pointer text-lg sm:text-xl" />
        </button>
      </div>

      {/* BODY: Responsive grid (1 col on mobile, 2 on desktop) */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-10 bg-slate-50/30">
        <form id="report-form" onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">

            <div className="space-y-1">
              <label className={labelClasses}><FaClipboardList className="text-emerald-600" /> Report Type</label>
              <select name="reportType" value={formData.reportType} onChange={handleChange} className={`${inputClasses} appearance-none pr-10 cursor-pointer`} required>
                <option value="">Select Type</option>
                <option value="Safety Compliance">Safety Compliance</option>
                <option value="Environmental Compliance">Environmental Compliance</option>
                <option value="Regulatory">Regulatory</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}><FaShieldAlt className="text-emerald-600" /> Asset Selection</label>
              <Select options={dynamicAssets} value={formData.asset} onChange={handleAssetChange} styles={selectStyles} placeholder="Find asset..." required menuPortalTarget={document.body} />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}><FaCheckCircle className="text-emerald-600" /> Safety Score (0-100)</label>
              <input type="number" name="safetyScore" value={formData.safetyScore} onChange={handleChange} min="0" max="100" placeholder="Enter score" className={inputClasses} required />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}><FaCheckCircle className="text-emerald-600" /> Compliance Status</label>
              <select name="complianceStatus" value={formData.complianceStatus} onChange={handleChange} className={`${inputClasses} appearance-none pr-10 cursor-pointer`} required>
                <option value="">Set Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}><FaUserTie className="text-emerald-600" /> Inspector / Lead</label>
              <input type="text" name="inspector" value={formData.inspector} onChange={handleChange} placeholder="Name or Agency" className={inputClasses} required />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}><FaCalendarAlt className="text-emerald-600" /> Next Audit Date</label>
              <DatePicker
                selected={formData.nextAuditDate}
                onChange={handleDateChange}
                dateFormat="dd MMM yyyy"
                minDate={new Date()}
                className={inputClasses}
                wrapperClassName="w-full" // Ensures datepicker takes full width
              />
            </div>

          </div>
        </form>
      </div>

      {/* FOOTER: Stacks buttons on mobile, side-by-side on desktop */}
      <div className="p-5 sm:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={handleDiscard}
          className="cursor-pointer w-full sm:w-auto px-6 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all"
        >
          Discard
        </button>
        <button
          form="report-form"
          type="submit"
          className="cursor-pointer w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;