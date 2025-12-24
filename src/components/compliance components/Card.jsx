import React from "react";

const Card = ({ data = {} }) => {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <div className="w-full p-8 sm:p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
             </svg>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            Waiting for Operational Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    // Updated Grid: 1 col (mobile), 2 col (small tablet), 3 col (tablet/laptop), 4 col (desktop)
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {entries.map(([label, value], idx) => (
        <div
          key={`${label}-${idx}`}
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm 
                     transition-all duration-300 md:hover:shadow-xl md:hover:border-emerald-500/50 
                     group relative overflow-hidden active:bg-slate-50 md:active:bg-white 
                     active:scale-98 md:active:scale-100 flex flex-col justify-between h-full"
        >
          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-0 md:group-hover:opacity-100 transition-opacity" />

          <div>
            {/* Label Section */}
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] leading-tight wrap-break-word pr-2">
                {label.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="shrink-0 w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center 
                            text-slate-400 md:group-hover:bg-slate-900 md:group-hover:text-emerald-400 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>

            {/* Value Section */}
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter break-all">
                {value}
              </span>
              <span className="text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full 
                               bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-tighter whitespace-nowrap">
                +2.5%
              </span>
            </div>
          </div>

          {/* Footer Trend Section */}
          <div className="mt-5 pt-4 border-t border-slate-50 flex items-center gap-2">
            <div className="h-1 flex-1 max-w-12 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-2/3 md:group-hover:w-full transition-all duration-700" />
            </div>
            <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
              Live Trend
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;