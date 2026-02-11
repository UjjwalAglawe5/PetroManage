import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux"; // ✅ Redux added
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

import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset as deleteAssetApi
} from "../components/asset components/assetAPI.js";

export function Assets() {
  
  const [tab, setTab] = useState("list");
  const [fromHeader, setFromHeader] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const moduleRef = useRef(null);

  // ✅ Redux: read the logged-in user from the store
  const user = useSelector((state) => state?.user?.user);
  // const role = user?.role;
  const role= 'operational_manager'; // Hardcoded for testing - change to user?.role in production
  const isViewOnly = role === "admin"; // Admin = View Only, Operational Manager = Full Access

  /* ================= AUTO-DISMISS MESSAGES ================= */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /* ================= LOAD ASSETS ================= */
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      console.error("Failed to load assets", err);
      setError(err.message || "Failed to load assets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CRUD OPERATIONS ================= */

  // CREATE
  const addAsset = async (asset) => {
    try {
      setError(null);
      await createAsset(asset);
      setSuccessMessage(`Asset "${asset.name}" created successfully!`);
      await loadAssets();
      setTab("list");
    } catch (err) {
      console.error("Failed to create asset", err);
      setError(err.message || "Failed to create asset. Please try again.");
      throw err; // Re-throw so the child component can handle it
    }
  };

  // DELETE
  const deleteAsset = async (id) => {
    try {
      setError(null);
      await deleteAssetApi(id);
      setSuccessMessage("Asset deleted successfully!");
      await loadAssets();
    } catch (err) {
      console.error("Failed to delete asset", err);
      setError(err.message || "Failed to delete asset. Please try again.");
    }
  };

  // UPDATE
  const updateAssetHandler = async (updatedAsset) => {
    try {
      setError(null);
      await updateAsset(updatedAsset);
      setSuccessMessage(`Asset "${updatedAsset.name}" updated successfully!`);
      await loadAssets();
    } catch (err) {
      console.error("Failed to update asset", err);
      setError(err.message || "Failed to update asset. Please try again.");
      throw err; // Re-throw so the child component can handle it
    }
  };

  /* ================= SMART SCROLL ================= */
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
    <div className="space-y-8 py-4">

      {/* ================= SUCCESS MESSAGE ================= */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-2 hover:bg-green-600 rounded p-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ================= ERROR MESSAGE ================= */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-2 hover:bg-red-600 rounded p-1 shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />

        <div className="relative p-6 text-white">
          <div className="flex items-center gap-3">
            <Boxes className="w-9 h-9 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">
              Asset Management
            </h1>
          </div>

          <div className="mt-4 flex items-start justify-between gap-6">
            <p
              className="relative text-slate-300 max-w-xl text-sm pl-4
              before:absolute before:left-0 before:top-1
              before:h-4 before:w-[3px]
              before:rounded-full
              before:bg-gradient-to-b before:from-emerald-400 before:to-emerald-600"
            >
              End-to-end lifecycle management for oil &amp; gas assets.
            </p>

            {/* HEADER CTA - Hidden for Admin (View Only) */}
            {!isViewOnly && (
              <button
                onClick={() => {
                  setFromHeader(true);
                  setTab(tab === "register" ? "list" : "register");
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
            )}
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
          <h2 className="font-semibold text-gray-800">
            Asset Operations Hub
          </h2>

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
            {/* Register tab only for Operational Manager */}
            {!isViewOnly && (
              <SwitchButton
                icon={PlusCircle}
                label="Register"
                active={tab === "register"}
                onClick={() => {
                  setFromHeader(false);
                  setTab("register");
                }}
              />
            )}
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
          {loading && (
            <p className="text-sm text-gray-500 text-center py-10">
              Loading assets...
            </p>
          )}

          {!loading && tab === "list" && (
            <AssetList
              assets={assets}
              onDelete={isViewOnly ? undefined : deleteAsset}
              onUpdate={isViewOnly ? undefined : updateAssetHandler}
            />
          )}

          {!loading && tab === "register" && !isViewOnly && (
            <AssetRegistration
              assets={assets}
              onAdd={addAsset}
            />
          )}

          {!loading && tab === "lifecycle" && (
            <AssetLifecycle assets={assets} />
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        © {new Date().getFullYear()} PetroManage — Asset &amp; Operations Management System
      </div>
    </div>
  );
}


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