import React from 'react';
import {
  Package,
  TrendingUp,
  Wrench,
  FileCheck,
  BarChart3,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';

export function Home() {
  const modules = [
    {
      title: 'Asset Lifecycle',
      icon: <Package size={22} />,
      desc: 'Register rigs, pipelines, and storage units.',
      bg: 'bg-amber-100',
      border: 'border-amber-700',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Production Tracking',
      icon: <TrendingUp size={22} />,
      desc: 'Plan extraction and monitor daily actuals.',
      bg: 'bg-sky-50',
      border: 'border-sky-700',
      iconColor: 'text-sky-600'
    },
    {
      title: 'Maintenance',
      icon: <Wrench size={22} />,
      desc: 'Prevent downtime with scheduled work orders.',
      bg: 'bg-slate-100',
      border: 'border-slate-700',
      iconColor: 'text-slate-700'
    },
    {
      title: 'Compliance',
      icon: <FileCheck size={22} />,
      desc: 'Automated safety and environmental reports.',
      bg: 'bg-emerald-50',
      border: 'border-emerald-700',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Analytics',
      icon: <BarChart3 size={22} />,
      desc: 'Operational trends and predictive insights.',
      bg: 'bg-indigo-100',
      border: 'border-indigo-700',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-12 pb-12">

      {/* HERO */}
      <section className="bg-[#09090b] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <div className="p-8 md:p-16 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6 w-fit">
            <Zap size={14} />
            <span> Operations v1.0</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            PetroManage <br />
            <span className="text-zinc-500">Asset Control.</span>
          </h1>

          <p className="text-zinc-400 text-lg mb-8 max-w-md">
            PetroManage centralizes your workflows. Monitor large-scale operations without IoT overhead.
          </p>

          <div className="flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition flex items-center gap-2">
              Get Started <ChevronRight size={18} />
            </button>
            <button className="text-zinc-400 hover:text-white font-semibold underline underline-offset-4">
              View Specs
            </button>
          </div>
        </div>

        <div className="flex-1 bg-zinc-900 p-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase">
                  System Status
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full">
                <div className="h-full w-[94%] bg-amber-500 rounded-full" />
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">
                PRODUCTION EFFICIENCY: 94%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE GRID */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 uppercase">
            System Modules
          </h2>
          <div className="h-[1px] flex-1 bg-gray-200 mx-6 hidden md:block" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Documentation Ref 2.1 – 2.5
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {modules.map((m, i) => (
            <div
              key={i}
              className={`
                ${m.bg}
                border-l-4 ${m.border}
                rounded-xl p-6
                shadow-sm hover:shadow-md
                transition cursor-pointer
              `}
            >
              <div className={`mb-4 ${m.iconColor}`}>
                {m.icon}
              </div>

              <h3 className="font-semibold text-slate-800 mb-2 text-sm">
                {m.title}
              </h3>

              <p className="text-gray-600 text-xs leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="relative bg-amber-50/60 rounded-3xl p-8 border border-amber-200 flex flex-col md:flex-row items-center gap-8">

        {/* Left accent bar */}
        <div className="absolute left-0 top-8 bottom-8 w-1 bg-amber-500 rounded-full" />

        {/* Icon */}
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-amber-200">
          <ShieldCheck size={48} className="text-amber-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Compliance & Safety Ready
          </h3>
          <p className="text-slate-700 text-sm max-w-xl leading-relaxed">
            Automated regulatory reports with complete audit trails for inspections,
            safety metrics, and compliance verification.
          </p>
        </div>

        {/* CTA */}
        <button className="
    w-full md:w-auto
    bg-amber-600 text-white
    px-8 py-3 rounded-xl
    font-bold
    hover:bg-amber-700
    focus:ring-4 focus:ring-amber-300
    transition
  ">
          Generate Audit Report
        </button>
      </section>


      <section className="bg-[#0b0b0e] rounded-3xl p-10 md:p-14 shadow-2xl border border-zinc-800">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

    {/* LEFT: PRODUCTION MONITORING */}
    <div>
      <span className="inline-block mb-4 text-xs font-bold tracking-widest text-amber-500 uppercase">
        Operations Intelligence
      </span>

      <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight">
        Real-Time Production <br />
        <span className="text-zinc-400">Monitoring</span>
      </h3>

      <p className="text-zinc-400 text-sm mb-6 max-w-lg leading-relaxed">
        Track actual vs planned production in real-time with advanced analytics.
        Compare performance across assets and identify optimization opportunities
        before losses escalate.
      </p>

      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Real-time production tracking
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Variance analysis & intelligent alerts
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Historical trend analysis
        </li>
      </ul>
    </div>

    {/* RIGHT: COMPLIANCE & SAFETY */}
    <div className="relative bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
      
      {/* Accent bar */}
      <div className="absolute top-6 left-0 bottom-6 w-1 bg-amber-500 rounded-full" />

      <span className="inline-block mb-4 text-xs font-bold tracking-widest text-amber-500 uppercase">
        Risk & Governance
      </span>

      <h3 className="text-2xl font-bold text-white mb-4">
        Compliance & Safety First
      </h3>

      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
        Maintain full regulatory compliance with automated reporting and
        tamper-proof audit trails. Generate environmental and safety reports
        ready for authorities and internal audits.
      </p>

      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Automated compliance reports
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Complete audit trails
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Industry-standard compliance
        </li>
      </ul>
    </div>

  </div>
</section>



    </div>
  );
}