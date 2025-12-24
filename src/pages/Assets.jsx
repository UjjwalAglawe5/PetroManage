import { useEffect, useState, useRef } from "react";
import {
  Boxes,
  ClipboardList,
  PlusCircle,
  RefreshCcw
} from "lucide-react";

import AssetRegistration from "../components/asset components/AssetRegistration";
import AssetList from "../components/asset components/AssetList";
import AssetLifecycle from "../components/asset components/AssetLifecycle";
import AssetKPIs from "../components/asset components/AssetKPIs";
import { getAssets, saveAssets } from "../components/asset components/assetStorage";


 export function Assets() {
  const [tab, setTab] = useState("list");
  const [fromHeader, setFromHeader] = useState(false);
  const [assets, setAssets] = useState([]);

  const moduleRef = useRef(null);

  useEffect(() => {
    setAssets(getAssets());
  }, []);

  /* ---------------- CRUD ---------------- */
  const addAsset = (asset) => {
    const updated = [...assets, asset];
    setAssets(updated);
    saveAssets(updated);
    setTab("list");
  };

  const deleteAsset = (id) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    saveAssets(updated);
  };

  const updateAsset = (updatedAsset) => {
    const updated = assets.map(a =>
      a.id === updatedAsset.id ? updatedAsset : a
    );
    setAssets(updated);
    saveAssets(updated);
  };

  /* -------- SMART SCROLL (ONLY HEADER CTA) -------- */
  useEffect(() => {
    if (tab === "register" && fromHeader) {
      moduleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      setFromHeader(false);
    }
  }, [tab, fromHeader]);

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />

        <div className="relative p-8 text-white">
          <div className="flex items-center gap-3">
            <Boxes className="w-9 h-9 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">
              Asset Management
            </h1>
          </div>

          <div className="mt-4 flex items-start justify-between gap-6">
           <p className="relative text-slate-300 max-w-xl text-sm pl-4
              before:absolute before:left-0 before:top-1
              before:h-4 before:w-[3px]
              before:rounded-full
              before:bg-gradient-to-b before:from-emerald-400 before:to-emerald-600">
            End-to-end lifecycle management for oil & gas assets.
          </p>


            {/* HEADER CTA */}
            <button
              onClick={() => {
                setFromHeader(true);
                setTab("register");
              }}
              className="flex items-center gap-2 px-4 py-2
                bg-gradient-to-r from-emerald-500 to-emerald-600
                hover:from-emerald-600 hover:to-emerald-700
                text-white text-sm font-semibold
                rounded-lg shadow-lg transition-all
                border border-emerald-400/30 shrink-0"
            >
               <PlusCircle className="w-5 h-5" />
  {tab === "register" ? "View Assets" : "Register Asset"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= KPI ================= */}
      <AssetKPIs assets={assets} />

      {/* ================= MODULE ================= */}
      <div
        ref={moduleRef}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >

        {/* SWITCH BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="font-semibold text-gray-800">Asset Operations Hub</h2>

          <div className="flex bg-gray-200 rounded-lg p-1">
            <SwitchButton
              icon={ClipboardList}
              label="Assets"
              active={tab === "list"}
              onClick={() => {
                setFromHeader(false);
                setTab("list");
              }}
            />
            <SwitchButton
              icon={PlusCircle}
              label="Register"
              active={tab === "register"}
              onClick={() => {
                setFromHeader(false);
                setTab("register");
              }}
            />
            <SwitchButton
              icon={RefreshCcw}
              label="Lifecycle"
              active={tab === "lifecycle"}
              onClick={() => {
                setFromHeader(false);
                setTab("lifecycle");
              }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {tab === "list" && (
            <AssetList
              assets={assets}
              onDelete={deleteAsset}
              onUpdate={updateAsset}
            />
          )}

          {tab === "register" && (
            <AssetRegistration
              assets={assets}
              onAdd={addAsset}
            />
          )}

          {tab === "lifecycle" && (
            <AssetLifecycle assets={assets} />
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        © {new Date().getFullYear()} PetroManage — Asset & Operations Management System
      </div>
    </div>
  );
}

/* ================= SWITCH BUTTON ================= */
function SwitchButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition
        ${
          active
            ? "bg-white text-slate-900 shadow"
            : "text-gray-600 hover:text-gray-900"
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}