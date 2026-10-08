"use client";

import React, { useState } from "react";
import { MapPin, X, Navigation, CheckCircle2 } from "lucide-react";

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (data: { address: string; zipCode: string; borough: string }) => void;
  currentAddress?: string;
  currentZip?: string;
}

// Manchester NH and Southern NH Zones for interactive pin selection
const nhZones = [
  { name: "Downtown Manchester", borough: "Manchester", zip: "03101", x: 50, y: 48, landmark: "Elm St & Merrimack St" },
  { name: "North End Manchester", borough: "Manchester", zip: "03104", x: 52, y: 32, landmark: "Webster St & River Rd" },
  { name: "South End Manchester", borough: "Manchester", zip: "03103", x: 48, y: 64, landmark: "South Willow St / Mall of NH" },
  { name: "West Side Manchester", borough: "Manchester", zip: "03102", x: 38, y: 46, landmark: "Kelley St & McGregor St" },
  { name: "Bedford Village", borough: "Bedford", zip: "03110", x: 30, y: 55, landmark: "Route 101 & Constitution Dr" },
  { name: "Merrimack Center", borough: "Merrimack", zip: "03054", x: 34, y: 72, landmark: "DW Highway & Baboosic Lake Rd" },
  { name: "Downtown Concord", borough: "Concord", zip: "03301", x: 54, y: 15, landmark: "Main St & Centre St" },
  { name: "Hooksett Village", borough: "Hooksett", zip: "03106", x: 58, y: 28, landmark: "Hooksett Rd & West River Rd" },
  { name: "Downtown Nashua", borough: "Nashua", zip: "03060", x: 36, y: 88, landmark: "Main St & Amherst St" },
  { name: "Derry Center", borough: "Derry", zip: "03038", x: 68, y: 65, landmark: "Broadway & Crystal Ave" },
  { name: "Londonderry Center", borough: "Londonderry", zip: "03053", x: 58, y: 74, landmark: "Mammoth Rd & Nashua Rd" },
  { name: "Salem Depot", borough: "Salem", zip: "03079", x: 74, y: 84, landmark: "Route 28 & Rockingham Park" },
];

export function MapLocationPicker({
  isOpen,
  onClose,
  onSelectLocation,
  currentAddress = "",
  currentZip = "",
}: MapLocationPickerProps) {
  const [selectedZone, setSelectedZone] = useState(nhZones[0]);
  const [pinPos, setPinPos] = useState({ x: 50, y: 48 });
  const [customAddress, setCustomAddress] = useState(currentAddress || selectedZone.landmark);
  const [customZip, setCustomZip] = useState(currentZip || selectedZone.zip);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [gpsSuccessNote, setGpsSuccessNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleZoneClick = (zone: typeof nhZones[0]) => {
    setSelectedZone(zone);
    setPinPos({ x: zone.x, y: zone.y });
    setCustomAddress(`${zone.landmark}, ${zone.borough}, NH`);
    setCustomZip(zone.zip);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinPos({ x, y });

    // Find nearest landmark to click coordinates
    let nearest = nhZones[0];
    let minDist = Infinity;
    for (const z of nhZones) {
      const dist = Math.hypot(z.x - x, z.y - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = z;
      }
    }
    setSelectedZone(nearest);
    setCustomAddress(`${nearest.name} (Pin at ${x}%, ${y}%), ${nearest.borough}, NH`);
    setCustomZip(nearest.zip);
  };

  const handleTriggerGPS = () => {
    if (!navigator.geolocation) {
      setGpsSuccessNote("Geolocation not supported by browser.");
      return;
    }
    setGpsDetecting(true);
    setGpsSuccessNote(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsDetecting(false);
        const detected = nhZones[0];
        setSelectedZone(detected);
        setPinPos({ x: detected.x, y: detected.y });
        setCustomAddress(`GPS Point (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) - Near ${detected.name}`);
        setCustomZip(detected.zip);
        setGpsSuccessNote("GPS location acquired successfully!");
      },
      () => {
        setGpsDetecting(false);
        setSelectedZone(nhZones[0]);
        setCustomAddress("Downtown Manchester, NH");
        setCustomZip("03101");
        setGpsSuccessNote("GPS permission denied. Please click on the map or type address.");
      },
      { timeout: 7000 }
    );
  };

  const handleConfirm = () => {
    onSelectLocation({
      address: customAddress,
      zipCode: customZip,
      borough: selectedZone.borough,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pinpoint Your Exact Location
              </h3>
              <p className="text-xs text-slate-500">
                Click anywhere on the Manchester & NH service map or use 1-click GPS detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top GPS Trigger Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
            <div className="text-xs text-emerald-950 font-medium">
              <span className="font-bold">
                Quick Auto-Detect:
              </span>{" "}
              Instantly fetch your coordinates without typing
            </div>
            <button
              type="button"
              onClick={handleTriggerGPS}
              disabled={gpsDetecting}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsDetecting ? "animate-spin" : ""}`} />
              <span>{gpsDetecting ? "Detecting..." : "Use My GPS"}</span>
            </button>
          </div>

          {gpsSuccessNote && (
            <p className="text-xs text-emerald-700 font-semibold px-2">{gpsSuccessNote}</p>
          )}

          {/* Interactive Map Visual Grid (SVG & Coordinates) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Interactive Manchester & NH Grid (Click to Drop Pin):
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                Pin: {pinPos.x}%, {pinPos.y}% ({selectedZone.borough})
              </span>
            </div>

            <div
              onClick={handleMapClick}
              className="relative w-full h-64 sm:h-72 rounded-2xl border-2 border-slate-200 overflow-hidden cursor-crosshair select-none bg-[#f2ede4] shadow-inner"
              style={{
                backgroundImage:
                  "radial-gradient(#d5cebf 1.2px, transparent 1.2px), linear-gradient(to right, #e8e2d5 1px, transparent 1px), linear-gradient(to bottom, #e8e2d5 1px, transparent 1px)",
                backgroundSize: "24px 24px, 48px 48px, 48px 48px",
              }}
            >
              {/* Merrimack River styling approximation */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute left-[47%] top-0 bottom-0 w-7 bg-[#c4dbec] rounded-full" />
              </div>

              {/* Area Labels */}
              <div className="absolute top-4 left-[46%] text-[11px] font-black uppercase tracking-wider text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                Concord
              </div>
              <div className="absolute top-28 left-[40%] text-[11px] font-black uppercase tracking-wider text-slate-800 bg-white/90 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                Manchester
              </div>
              <div className="absolute top-28 left-[20%] text-[11px] font-black uppercase tracking-wider text-slate-700 bg-white/80 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                Bedford
              </div>
              <div className="absolute bottom-12 left-[28%] text-[11px] font-black uppercase tracking-wider text-slate-800 bg-white/90 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                Nashua
              </div>
              <div className="absolute bottom-14 left-[64%] text-[11px] font-black uppercase tracking-wider text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                Derry & Salem
              </div>

              {/* Landmark quick pin targets */}
              {nhZones.map((z) => (
                <button
                  key={z.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoneClick(z);
                  }}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                  title={`${z.name} (ZIP ${z.zip})`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition transform hover:scale-125 cursor-pointer ${
                    selectedZone.name === z.name
                      ? "bg-emerald-600 border-white shadow-md z-20 scale-110"
                      : "bg-slate-700 border-white/80 opacity-80"
                  }`}
                />
              ))}

              {/* Active Marker Pin */}
              <div
                style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-30 transition-all duration-150"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{selectedZone.name}</span>
                  </div>
                  <MapPin className="w-7 h-7 text-emerald-700 fill-emerald-600 drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Selection Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
              Quick Service Areas:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {nhZones.map((z) => (
                <button
                  key={z.name}
                  type="button"
                  onClick={() => handleZoneClick(z)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                    selectedZone.name === z.name
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {z.name} ({z.zip})
                </button>
              ))}
            </div>
          </div>

          {/* Manual Address & ZIP confirmation inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Street Address / Landmark
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NH ZIP
              </label>
              <input
                type="text"
                maxLength={5}
                value={customZip}
                onChange={(e) => setCustomZip(e.target.value.replace(/[^\d]/g, ""))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply This Location to Form</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-sm rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
