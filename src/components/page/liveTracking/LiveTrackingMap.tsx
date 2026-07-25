/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Star, X } from "lucide-react";

const activeDrivers = [
  {
    id: "d1",
    name: "Ibrahim Sow",
    status: "Disponible",
    vehicle: "Truck",
    vehicleSub: "1000kg cap",
    rating: 4.4,
    totalDone: 45,
    eta: "In 2.5 min",
    initials: "IS",
    bg: "bg-amber-500",
    lat: 25.2048,
    lng: 55.2708,
  },
  {
    id: "d2",
    name: "Moussa Diop",
    status: "En course",
    vehicle: "Bike",
    vehicleSub: "Motorcycle",
    rating: 4.8,
    totalDone: 112,
    eta: "In 5 min",
    initials: "MD",
    bg: "bg-cyan-500",
    lat: 25.2150,
    lng: 55.2850,
  },
  {
    id: "d3",
    name: "Amadou Diallo",
    status: "Disponible",
    vehicle: "Van",
    vehicleSub: "500kg cap",
    rating: 4.6,
    totalDone: 78,
    eta: "In 1 min",
    initials: "AD",
    bg: "bg-purple-500",
    lat: 25.2100,
    lng: 55.2600,
  },
  {
    id: "d4",
    name: "Oumar Ndiaye",
    status: "Disponible",
    vehicle: "Car",
    vehicleSub: "Sedan",
    rating: 4.9,
    totalDone: 130,
    eta: "In 3 min",
    initials: "ON",
    bg: "bg-emerald-500",
    lat: 25.1950,
    lng: 55.2750,
  },
];

export default function LiveTrackingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(activeDrivers[0]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let isSubscribed = true;

    import("leaflet").then((L) => {
      if (!isSubscribed || !mapRef.current) return;

      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [25.2048, 55.2708],
        zoom: 13,
        zoomControl: false,
      });

      leafletInstance.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Render markers
      activeDrivers.forEach((driver) => {
        const isSelected = selectedDriver?.id === driver.id;

        const customHtml = `
          <div class="relative cursor-pointer">
            <div class="w-10 h-10 rounded-full ${driver.bg} text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white ${isSelected ? 'ring-4 ring-[#10B981]' : ''}">
              <span class="w-2 h-2 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5" />
              ▲
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: "custom-tracking-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(map);

        marker.on("click", () => {
          setSelectedDriver(driver);
        });
      });
    });

    return () => {
      isSubscribed = false;
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [selectedDriver]);

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Selected Driver Interactive Popup Card Overlay */}
      {selectedDriver && (
        <div className="absolute bottom-6 left-6 z-[1000] w-80 bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Row: Avatar + Name + Status + Close */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`size-11 rounded-2xl ${selectedDriver.bg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {selectedDriver.initials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {selectedDriver.name}
                </h4>
                <span className="inline-block bg-[#E6F4EA] text-[#10B981] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1">
                  {selectedDriver.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDriver(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 3 Stat Box Grid */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/80 mb-3">
            <div className="text-center">
              <span className="block text-xs font-bold text-slate-800">
                {selectedDriver.vehicle}
              </span>
              <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                {selectedDriver.vehicleSub}
              </span>
            </div>

            <div className="text-center border-x border-slate-200/60 px-1">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{selectedDriver.rating}</span>
              </div>
              <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                rating
              </span>
            </div>

            <div className="text-center">
              <span className="block text-xs font-bold text-slate-800">
                {selectedDriver.totalDone}
              </span>
              <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                deliveries
              </span>
            </div>
          </div>

          {/* Bottom ETA Indicator */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] px-1">
            <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{selectedDriver.eta}</span>
          </div>
        </div>
      )}
    </div>
  );
}
