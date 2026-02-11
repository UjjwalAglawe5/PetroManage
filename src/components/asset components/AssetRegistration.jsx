import { useState, useEffect } from "react";
 
export default function AssetRegistration({ onAdd }) {
  const [form, setForm] = useState({
    type: "",
    name: "",
    location: ""
  });
 
  const [errors, setErrors] = useState({});
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
 
  /* ---------------- LOCATION SEARCH ---------------- */
  useEffect(() => {
    if (!locationQuery || locationQuery.length < 3) {
      setSuggestions([]);
      return;
    }
 
    const timer = setTimeout(async () => {
      try {
        setLoadingLoc(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}&limit=8`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Location fetch failed", err);
      } finally {
        setLoadingLoc(false);
      }
    }, 300);
 
    return () => clearTimeout(timer);
  }, [locationQuery]);
 
  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Asset type is required";
    if (!form.name.trim()) e.name = "Asset name is required";
    if (!form.location.trim()) e.location = "Location is required";
 
    setErrors(e);
    return Object.keys(e).length === 0;
  };
 
  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    if (!validate()) return;
 
    const payload = {
      name: form.name.trim(),
      type: form.type,       // RIG / PIPELINE / STORAGE
      location: form.location.trim()
    };
 
    try {
      setSubmitting(true);
      setApiError(null);
     
      await onAdd(payload); // 🔥 PARENT HANDLES API + REFRESH
 
      setForm({ type: "", name: "", location: "" });
      setLocationQuery("");
      setErrors({});
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to register asset");
    } finally {
      setSubmitting(false);
    }
  };
 
  const inputClass = (field) =>
    `w-full px-4 py-2 rounded-lg border text-sm
     focus:ring-2 focus:ring-slate-500 focus:outline-none
     ${errors[field] ? "border-red-400" : "border-gray-300"}`;
 
  return (
    <div className="p-8">
      <h3 className="text-xl font-semibold mb-6">Register New Asset</h3>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
        {/* Asset Type */}
        <div>
          <label className="text-sm font-medium">Asset Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClass("type")}
          >
            <option value="">Select</option>
            <option value="RIG">RIG</option>
            <option value="PIPELINE">PIPELINE</option>
            <option value="STORAGE">STORAGE</option>
          </select>
          {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
        </div>
 
        {/* Asset Name */}
        <div>
          <label className="text-sm font-medium">Asset Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass("name")}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
 
        {/* Location */}
        <div className="relative">
          <label className="text-sm font-medium">Location *</label>
          <input
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setForm({ ...form, location: e.target.value });
            }}
            className={inputClass("location")}
          />
 
          {suggestions.length > 0 && (
            <div className="absolute z-20 bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((loc) => (
                <div
                  key={loc.place_id}
                  onClick={() => {
                    setForm({ ...form, location: loc.display_name });
                    setLocationQuery(loc.display_name);
                    setSuggestions([]);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-100"
                >
                  {loc.display_name}
                </div>
              ))}
            </div>
          )}
 
          {errors.location && (
            <p className="text-xs text-red-500">{errors.location}</p>
          )}
        </div>
      </div>
 
      {/* ================= API ERROR MESSAGE ================= */}
      {apiError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Failed to register asset</p>
            <p className="text-sm text-red-600 mt-1">{apiError}</p>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}
 
      <div className="mt-10 flex justify-end">
        <button
          onClick={submit}
          disabled={submitting}
          className={`px-8 py-2 rounded-lg font-medium transition-all
            ${submitting
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-slate-800 text-white hover:bg-slate-700 hover:shadow-lg"
            }`}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registering...
            </span>
          ) : (
            "Register Asset"
          )}
        </button>
      </div>
    </div>
  );
}
 
 