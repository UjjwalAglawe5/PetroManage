import React from "react";

const Card = ({ data = {} }) => {
  const entries = Object.entries(data);

  // Using a robust font stack for Calibri compatibility
  const fontStyle = "font-['Calibri',_sans-serif]";

  if (entries.length === 0) {
    return (
      <div className={`w-full p-6 sm:p-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-pulse ${fontStyle}`}>
        <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
          Waiting for Operational Data...
        </p>
      </div>
    );
  }

  return (
    /* Responsive Grid Logic:
       - grid-cols-1: Mobile (default)
       - sm:grid-cols-2: Small tablets
       - lg:grid-cols-4: Large desktops
    */
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${fontStyle}`}>
      {entries.map(([label, value], idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm transition-all duration-300 md:hover:shadow-xl md:hover:border-emerald-500/50 group relative overflow-hidden flex flex-col justify-center"
        >
          {/* Hover Accent Bar - Hidden on touch devices via md:hover */}
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-0 md:group-hover:opacity-100 transition-opacity" />

          {/* Label Section */}
          <div className="mb-1 sm:mb-2 text-left">
            <h2 className="text-[10px] sm:text-[11px] lg:text-[13px] font-black text-slate-500 uppercase tracking-widest leading-tight">
              {label}
            </h2>
          </div>

          {/* Value Section */}
          <div className="sm:px-2">
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tighter block truncate">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;