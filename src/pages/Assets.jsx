import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Boxes,
  ClipboardList,
  PlusCircle,
  RefreshCcw
} from "lucide-react";
import Swal from 'sweetalert2';
 
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
 
  const moduleRef = useRef(null);
 
  // ✅ Redux: read the logged-in user from the store
  const user = useSelector((state) => state?.user?.user);
  const role = user?.role;
  // const role= 'admin'; // Hardcoded for testing - change to user?.role in production
  const isViewOnly = role === "admin"; // Admin = View Only, Operational Manager = Full Access
 
  /* ================= AUTO-DISMISS ERROR MESSAGES ================= */
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#ef4444',
        timer: 5000,
        timerProgressBar: true,
      });
      setError(null);
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
      await loadAssets();
    } catch (err) {
      console.error("Failed to delete asset", err);
      setError(err.message || "Failed to delete asset. Please try again.");
      throw err; // Re-throw so the child component can handle it
    }
  };
 
  // UPDATE
  const updateAssetHandler = async (updatedAsset) => {
    try {
      setError(null);
      await updateAsset(updatedAsset);
      await loadAssets();
    } catch (err) {
      console.error("Failed to update asset", err);
      setError(err.message || "Failed to update asset. Please try again.");
      throw err; // Re-throw so the child component can handle it
    }
  };
 
  /* ================= SMART SCROLL ================= */
  useEffect(() => {
    if (fromHeader) {
      // Scroll to module section for both register and list views
      moduleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      setFromHeader(false);
    }
  }, [tab, fromHeader]);
 
  return (
    <div className="space-y-8 py-4">
 
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />

        <div className="relative p-6 text-white flex items-center justify-between gap-6 h-33">
          {/* LEFT SIDE: Title and Description grouped together */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Boxes className="w-9 h-9 text-slate-300" />
              <h1 className="text-3xl font-bold tracking-tight">
                Asset Management
              </h1>
            </div>

            <p className="ml-7.5 mt-4 relative text-slate-300 max-w-xl text-sm pl-4">
              End-to-end lifecycle management for oil &amp; gas assets.
            </p>
          </div>

          {/* RIGHT SIDE: Button centered vertically against the text block */}
          {!isViewOnly && (
            <button
              onClick={() => {
                setFromHeader(true);
                setTab(tab === "register" ? "list" : "register");
              }}
              className="cursor-pointer flex items-center gap-2 px-4 py-2
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
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition
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
 