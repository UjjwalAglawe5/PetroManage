import React from "react";

const Card = ({ data = {} }) => {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <div className="w-full p-8 sm:p-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-pulse">
        <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
          Waiting for Operational Data...
        </p>
      </div>
    );
  }

  return (
    /* Responsive Grid:
       - 1 column on very small phones
       - 2 columns on small tablets (sm)
       - 3 columns on desktops (md)
       - 4 columns on large screens (lg)
    */
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {entries.map(([label, value], idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm transition-all duration-300 md:hover:shadow-xl md:hover:border-emerald-500/50 group relative overflow-hidden"
        >
          {/* Hover Accent Bar (Only visible on hover in desktop) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-0 md:group-hover:opacity-100 transition-opacity" />

          {/* Label Section */}
          <div className="mb-1 sm:mb-2 text-center">
            <h2 className="text-[10px] sm:text-[12px] md:text-[14px] font-black text-slate-500 uppercase tracking-widest leading-tight">
              {label}
            </h2>
          </div>

          {/* Value Section */}
          <div className="text-center">
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