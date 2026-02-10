import React from "react";

const ReportCard = ({ label, value }) => {
  // Formats camelCase to Title Case
  const formattedLabel = label.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  return (
    <div className="p-3 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 h-full flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[110px]">

      {/* Label: Scaled down slightly for mobile */}
      <span className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">
        {formattedLabel}
      </span>

      <div className="flex items-baseline justify-center gap-1 w-full max-w-full overflow-hidden">
        {/* Value: Added break-words to handle long strings on narrow screens */}
        <span className="text-base sm:text-lg md:text-xl font-black text-slate-800 break-words leading-tight tracking-tight px-1 max-w-full">
          {value ?? "—"}
        </span>

        {label.toLowerCase().includes("score") && value && (
          <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">%</span>
        )}
      </div>
    </div>
  );
};

export default ReportCard;