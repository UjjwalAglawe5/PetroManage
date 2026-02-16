import React from "react";

const ReportCard = ({ label, value }) => {
  // Formats camelCase to Title Case (e.g., safetyScore -> Safety Score)
  const formattedLabel = label.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  // Calibri font stack for consistency across environments
  const calibriStyle = { fontFamily: "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif" };

  return (
    <div
      className="group p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 h-full flex flex-col items-center justify-center text-center min-h-[90px] sm:min-h-[120px] relative overflow-hidden"
      style={calibriStyle}
    >
      {/* Subtle hover indicator for interactive feel */}
      <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />

      {/* Label Section */}
      <span className="block text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 px-1">
        {formattedLabel}
      </span>

      {/* Value Container */}
      <div className="flex items-center justify-center gap-0.5 w-full">
        <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-slate-900 truncate max-w-full leading-none">
          {value ?? "—"}
        </span>

        {/* Dynamic Percentage Sign */}
        {label.toLowerCase().includes("score") && value !== undefined && value !== null && (
          <span className="text-[10px] sm:text-[14px] font-black text-slate-900 uppercase self-end mb-0.5 sm:mb-1">
            %
          </span>
        )}
      </div>
    </div>
  );
};

export default ReportCard;