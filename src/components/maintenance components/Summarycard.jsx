import React from 'react';
import { AlertTriangle, Timer, CheckCircle2, List, Calendar } from 'lucide-react';

export const SummaryCard = ({ title, value, type, onClick, isActive }) => {
  const getTheme = () => {
    switch (type) {
      case 'overdue':
        return { icon: <AlertTriangle size={22} strokeWidth={2.5} />, bgColor: 'bg-red-500', shadowColor: 'shadow-red-100' };
      case 'progress':
        return { icon: <Timer size={22} strokeWidth={2.5} />, bgColor: 'bg-amber-500', shadowColor: 'shadow-amber-100' };
      case 'completed':
        return { icon: <CheckCircle2 size={22} strokeWidth={2.5} />, bgColor: 'bg-emerald-500', shadowColor: 'shadow-emerald-100' };
      case 'scheduled':
        return { icon: <Calendar size={22} strokeWidth={2.5} />, bgColor: 'bg-blue-500', shadowColor: 'shadow-blue-100' };
      default:
        return { icon: <List size={22} strokeWidth={2.5} />, bgColor: 'bg-slate-600', shadowColor: 'shadow-slate-100' };
    }
  };

  const theme = getTheme();

  return (
    <div 
      onClick={onClick} 
      // Changed p-3 to p-4 for more vertical presence (60-70% size)
      className={`group relative p-4 border-2 rounded-xl bg-white cursor-pointer transition-all duration-300 flex items-center gap-4
        ${isActive 
          ? 'border-orange-500 ring-4 ring-orange-50 shadow-md -translate-y-0.5' 
          : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      {/* Icon Logo - Left Side, slightly larger (p-2.5) */}
      <div className={`flex-shrink-0 p-2.5 rounded-xl text-white shadow-lg ${theme.bgColor} ${theme.shadowColor} transition-transform group-hover:scale-105`}>
        {theme.icon}
      </div>

      {/* Text Content - Larger fonts to prevent it looking "too small" */}
      <div className="flex flex-col min-w-0">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide truncate">
          {title}
        </h3>
        <p className="text-2xl font-black text-gray-900 leading-tight">
          {value}
        </p>
      </div>

      {/* Subtle indicator for active state */}
      {isActive && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
      )}
    </div>
  );
};