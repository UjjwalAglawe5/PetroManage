import React, { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../config/axiosConfig';

const today = new Date().toISOString().split('T')[0];

export const StatusView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedOrder = location.state?.selectedOrder;

  const getInitialDates = () => {
    const status = passedOrder?.status;
    if (status === "Scheduled") return { targetDate: "", actualDate: "" };
    if (status === "In progress") return { targetDate: passedOrder.expectedCompletionDate || "", actualDate: "" };
    if (status === "Completed") return { targetDate: passedOrder.expectedCompletionDate || "", actualDate: passedOrder.actualCompletionDate || "" };
    if (status === "Overdue") return { targetDate: passedOrder.expectedCompletionDate || "", actualDate: passedOrder.actualCompletionDate || "" };
    return {
      targetDate: passedOrder?.expectedCompletionDate || "",
      actualDate: passedOrder?.actualCompletionDate || ""
    };
  };

  const dates = getInitialDates();
  const [workOrder, setWorkOrder] = useState({
    ...passedOrder,
    targetDate: dates.targetDate,
    actualDate: dates.actualDate,
  });

  let progress = 0;
  let statusLabel = "Not Started";
  // Updated: Changed themeColor to Slate-700 for better visibility at 0%
  let themeColor = "#334155";

  if (workOrder.status === "In progress") {
    progress = 40;
    statusLabel = "In Progress";
    themeColor = "#f59e0b";
  } else if (workOrder.status === "Completed" || workOrder.status === "Overdue") {
    progress = 100;
    const isLate = new Date(workOrder.actualDate) > new Date(workOrder.targetDate);
    themeColor = isLate ? "#ef4444" : "#10b981";
    statusLabel = isLate ? "Overdue" : "Completed";
  }

  const updateProgressOnBackend = async (updates) => {
    try {
      // Extract numeric ID from "WO-7" format to match backend Long ID
      const numericId = workOrder.id.replace("WO-", "");

      console.log(updates);

      const response = await axios.patch(
        `http://localhost:8080/api/maintenance/work-orders/${numericId}/update-progress`,
        updates
      );

      const updatedOrder = response.data;

      // Map backend response back to frontend state
      setWorkOrder({
        ...workOrder,
        // Convert "IN_PROGRESS" back to "In progress" for the UI
        status: updatedOrder.status === "OVERDUE" ? "Overdue" :
          updatedOrder.status.charAt(0).toUpperCase() + updatedOrder.status.slice(1).toLowerCase().replace('_', ' '),
        targetDate: updatedOrder.expectedCompletionDate || "",
        actualDate: updatedOrder.actualCompletionDate || ""
      });

    } catch (err) {
      console.error("Backend update failed:", err);
    }
  };

  // 4. Button Handlers
  const handleStartWork = async () => {
    if (!workOrder.targetDate) return alert("Please set an Estimated Completion Date!");

    await updateProgressOnBackend({
      status: "IN_PROGRESS",
      expectedCompletionDate: workOrder.targetDate
    });
  };

  const handleFinishWork = async () => {
    if (!workOrder.actualDate) return alert("Please enter the Actual Completion Date!");

    // 1. Calculate the final status on the frontend first
    const isLate = new Date(workOrder.actualDate) > new Date(workOrder.targetDate);
    const finalStatus = isLate ? "OVERDUE" : "COMPLETED";

    // 2. Send the CALCULATED status to the database
    await updateProgressOnBackend({
      status: finalStatus, // Now it sends "OVERDUE" if it's late
      actualCompletionDate: workOrder.actualDate
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 bg-slate-50 min-h-screen font-bold tracking-tight">
      <button onClick={() => navigate(-1)} className="cursor-pointer group flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all text-xs sm:text-sm">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" /> BACK TO DASHBOARD
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">

        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">

            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-100 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs uppercase ${workOrder.priority === 'High' ? 'bg-red-500 text-white' :
                    workOrder.priority === 'Medium' ? 'bg-orange-500 text-white' :
                      'bg-yellow-400 text-white'
                    }`}>
                    {workOrder.priority} PRIORITY
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-800">{workOrder.id}</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">{workOrder.description}</p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-[10px] text-slate-400 uppercase tracking-tight">Scheduled On</p>
                <p className="text-base sm:text-lg text-slate-700">{workOrder.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6 sm:mb-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-500 uppercase">
                  <Clock size={14} /> Estimated Completion
                </label>
                <input
                  type="date"
                  value={workOrder.targetDate}
                  min={today}
                  onChange={(e) => setWorkOrder({ ...workOrder, targetDate: e.target.value })}
                  className="cursor-pointer w-full p-2 sm:p-3 md:p-4 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-700 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-500 uppercase">
                  <CheckCircle size={14} /> Actual Completion
                </label>
                <input
                  type="date"
                  value={workOrder.actualDate}
                  min={today}
                  onChange={(e) => setWorkOrder({ ...workOrder, actualDate: e.target.value })}
                  className="cursor-pointer w-full p-2 sm:p-3 md:p-4 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all text-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleStartWork}
                disabled={workOrder.status !== "Scheduled"}
                className={`cursor-pointer flex-1 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase transition-all shadow-sm ${workOrder.status === "Scheduled" ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
              >
                Initialize
              </button>
              <button
                onClick={handleFinishWork}
                disabled={workOrder.status !== "In progress"}
                className={`cursor-pointer flex-1 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase transition-all shadow-sm ${workOrder.status === "In progress" ? "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-md" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
              >
                Complete
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <h3 className="text-slate-400 text-[10px] uppercase mb-6 sm:mb-8 md:mb-10">Progression Metrics</h3>

            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={themeColor}
                  strokeWidth="2.5"
                  strokeDasharray={`${progress}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl md:text-5xl text-slate-800">{progress}%</span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase">Complete</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 md:mt-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl" style={{ color: themeColor }}>
                {statusLabel.toUpperCase()}
              </h2>
            </div>

            <div className="mt-6 sm:mt-8 w-full p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 sm:space-y-4 text-left">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-600 uppercase text-[10px]">Technician</span>
                <span className="text-slate-700 text-xs sm:text-sm truncate">{workOrder.technician}</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-600 uppercase text-[10px]">Asset Reference</span>
                <span className="text-slate-700 text-xs sm:text-sm truncate">{workOrder.assetId}</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-600 uppercase text-[10px]">Work Type</span>
                <span className="text-slate-700 uppercase text-xs sm:text-sm truncate">{workOrder.type}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};