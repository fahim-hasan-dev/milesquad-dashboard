/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const markersData = [
  { id: "r1", type: "rider", lat: 25.2048, lng: 55.2708, label: "R1" },
  { id: "r2", type: "rider", lat: 25.2120, lng: 55.2820, label: "R2" },
  { id: "r3", type: "rider", lat: 25.1980, lng: 55.2650, label: "R3" },
  { id: "r4", type: "rider", lat: 25.1950, lng: 55.2720, label: "R4" },
  { id: "r5", type: "rider", lat: 25.2080, lng: 55.2600, label: "R5" },
  { id: "d12", type: "delivery", lat: 25.2060, lng: 55.2750, label: "12" },
  { id: "d24", type: "delivery", lat: 25.2150, lng: 55.2880, label: "24" },
  { id: "d8", type: "delivery", lat: 25.2200, lng: 55.2950, label: "8" },
  { id: "d13", type: "delivery", lat: 25.1920, lng: 55.2840, label: "13" },
  { id: "d6", type: "delivery", lat: 25.1880, lng: 55.2740, label: "6" },
  { id: "dm", type: "orange", lat: 25.1900, lng: 55.2680, label: "M" },
];

export default function LivePlatformMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let isSubscribed = true;

    import("leaflet").then((L) => {
      if (!isSubscribed || !mapRef.current) return;

      // Clean up previous instance if exists
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }

      // Initialize map centered at coordinates
      const map = L.map(mapRef.current, {
        center: [25.2048, 55.2708],
        zoom: 13,
        zoomControl: false,
      });

      leafletInstance.current = map;

      // Add high-resolution clean map tile layer (CartoDB Voyager tile layer)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Add custom Leaflet zoom control
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Render markers directly on Leaflet map layer so they move dynamically with map drag/zoom
      markersData.forEach((item) => {
        let customHtml = "";

        if (item.type === "rider") {
          customHtml = `
            <div class="relative flex items-center justify-center">
              <div class="w-9 h-9 rounded-full bg-[#10B981]/30 flex items-center justify-center animate-pulse">
                <div class="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold text-[10px] flex items-center justify-center shadow-lg border-2 border-white">
                  ▲
                </div>
              </div>
            </div>
          `;
        } else if (item.type === "delivery") {
          customHtml = `
            <div class="w-7 h-7 rounded-full bg-[#7C3AED] text-white font-bold text-[11px] flex items-center justify-center shadow-lg border-2 border-white">
              ${item.label}
            </div>
          `;
        } else {
          customHtml = `
            <div class="w-7 h-7 rounded-full bg-[#F59E0B] text-white font-bold text-[11px] flex items-center justify-center shadow-lg border-2 border-white">
              ${item.label}
            </div>
          `;
        }

        const icon = L.divIcon({
          html: customHtml,
          className: "custom-leaflet-marker",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([item.lat, item.lng], { icon }).addTo(map);
      });
    });

    return () => {
      isSubscribed = false;
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Live Platform Map</h3>
        <span className="text-xs font-semibold text-[#10B981] bg-[#E6F4EA] px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
          Interactive Dynamic Map
        </span>
      </div>

      {/* Dynamic Leaflet Map Container */}
      <div className="relative w-full h-[360px] rounded-xl overflow-hidden border border-slate-200/80 shadow-inner">
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Bottom Left Floating Badge */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-5 text-xs border border-slate-200/90 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold text-slate-600">Riders</span>
            <span className="font-extrabold text-slate-900">1,245</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#7C3AED]" />
            <span className="font-semibold text-slate-600">Deliveries</span>
            <span className="font-extrabold text-slate-900">648</span>
          </div>
        </div>
      </div>
    </div>
  );
}
