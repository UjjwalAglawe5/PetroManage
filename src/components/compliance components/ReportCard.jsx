import React from "react";

const ReportCard = ({ label, value }) => {
  const formatLabel = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  };

  // Logic for UI feedback
  const isScore = label.toLowerCase().includes("score");
  // Supports numeric strings (90-100) or status strings
  const isPositive = String(value).toLowerCase().match(/pass|compliant|9[0-9]|100/);

  return (
    <div className="group relative bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 
                    shadow-sm transition-all duration-300 ease-out
                    md:hover:shadow-xl md:hover:shadow-emerald-100/50 
                    md:hover:-translate-y-1 md:hover:border-emerald-300 
                    cursor-pointer active:scale-[0.98] md:active:scale-95 w-full h-full 
                    min-h-[90px] sm:min-h-[110px] md:min-h-[130px] flex flex-col overflow-hidden">
      
      {/* Interactive Background Glow - Only active on devices with hover */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/5 to-emerald-50/30 
                      opacity-0 md:group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      {/* Decorative Accent: Left indicator for status */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
        isPositive ? "bg-emerald-500 opacity-100" : "bg-slate-200 opacity-40 md:group-hover:opacity-100"
      }`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="w-full">
          {/* Label Section */}
          <div className="flex items-center justify-between mb-1.5 md:mb-3 gap-2">
            <span className="text-[8px] sm:text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.12em] sm:tracking-[0.15em] leading-tight">
              {formatLabel(label)}
            </span>
            <div className={`shrink-0 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full transition-all duration-500 ${
              isPositive 
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] scale-110" 
                : "bg-slate-300"
            }`} />
          </div>

          {/* Value Section - Responsive Typography & Wrapping */}
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 overflow-hidden">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 wrap-break-word w-full sm:w-auto leading-tight">
              {value ?? "—"}
            </span>
            
            {isScore && value && (
              <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
                pts
              </span>
            )}
          </div>
        </div>

        {/* Footer Info - Hidden on very small screens to maintain cleanliness */}
        <div className="mt-3 md:mt-4 flex items-center justify-between min-h-3">
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-0 md:group-hover:opacity-100 transition-opacity hidden xs:block">
              Report Entry
            </p>
            {isPositive && (
              <span className="text-[7px] sm:text-[8px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">
                Valid
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;