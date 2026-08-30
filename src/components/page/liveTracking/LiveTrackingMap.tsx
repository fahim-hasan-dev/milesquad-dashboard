/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { Star, X, Search, Phone, Radio } from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";
import { getTrackingSocket } from "@/utils/socket";

interface LiveDriverInfo {
  driverId: string;
  customId: string;
  fullName: string;
  phone: string;
  email: string;
  image?: string;
  vehicleType: string;
  rating: number;
  lat: number;
  lng: number;
  status: string;
  updatedAt: number;
  initials: string;
  bg: string;
}

export default function LiveTrackingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const [onlineDrivers, setOnlineDrivers] = useState<LiveDriverInfo[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<LiveDriverInfo | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formatSocketDriver = (data: any, idx: number): LiveDriverInfo => {
    const bgColors = [
      "bg-[#10B981]",
      "bg-emerald-600",
      "bg-teal-600",
      "bg-emerald-500",
    ];

    const driverName = data.fullName || data.name || "Active Driver";
    const initials = driverName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      driverId: data.driverId || data._id || data.id,
      customId: data.customId || data.userId || data.driverId || "DRV",
      fullName: driverName,
      phone: data.phone || "N/A",
      email: data.email || "N/A",
      image: data.image ? getImageUrl(data.image) : "",
      vehicleType: (data.vehicleType || "BIKE").toUpperCase(),
      rating: Number(data.rating) || 4.9,
      lat: Number(data.lat) || 23.8103,
      lng: Number(data.lng) || 90.4125,
      status: (data.status || "ONLINE").toUpperCase(),
      updatedAt: Number(data.updatedAt) || Date.now(),
      initials,
      bg: bgColors[idx % bgColors.length],
    };
  };

  // 1. Socket Connection & Listeners
  useEffect(() => {
    const socket = getTrackingSocket();

    const handleConnect = () => {
      setSocketConnected(true);
      socket.emit("admin:track-all-drivers");
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("all-drivers:initial-list", (rawList: any[]) => {
      if (Array.isArray(rawList)) {
        const activeList = rawList
          .filter((item) => item && (item.lat || item.lng))
          .map((item, idx) => formatSocketDriver(item, idx));
        setOnlineDrivers(activeList);
      }
    });

    socket.on("all-drivers:location-updated", (payload: any) => {
      if (payload && (payload.driverId || payload.id)) {
        const id = payload.driverId || payload.id;
        setOnlineDrivers((prev) => {
          const index = prev.findIndex(
            (d) => d.driverId === id || d.customId === id
          );
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              lat: Number(payload.lat) || updated[index].lat,
              lng: Number(payload.lng) || updated[index].lng,
              status: (payload.status || updated[index].status).toUpperCase(),
              updatedAt: Number(payload.updatedAt) || Date.now(),
            };
            return updated;
          } else {
            const newDriver = formatSocketDriver(payload, prev.length);
            return [...prev, newDriver];
          }
        });
      }
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("all-drivers:initial-list");
      socket.off("all-drivers:location-updated");
      socket.emit("admin:untrack-all-drivers");
    };
  }, []);

  // Filter Online Drivers by Search Term
  const filteredDrivers = useMemo(() => {
    if (!searchTerm.trim()) return onlineDrivers;
    const term = searchTerm.toLowerCase().trim();
    return onlineDrivers.filter(
      (d) =>
        d.fullName.toLowerCase().includes(term) ||
        d.phone.toLowerCase().includes(term) ||
        d.customId.toLowerCase().includes(term)
    );
  }, [onlineDrivers, searchTerm]);

  // 2. Auto-fly to searched driver when typing in search box
  useEffect(() => {
    if (!searchTerm.trim() || !leafletInstance.current || onlineDrivers.length === 0) return;
    const term = searchTerm.toLowerCase().trim();
    const match = onlineDrivers.find(
      (d) =>
        d.customId.toLowerCase().includes(term) ||
        d.fullName.toLowerCase().includes(term) ||
        d.phone.toLowerCase().includes(term)
    );

    if (match) {
      setSelectedDriver(match);
      const map = leafletInstance.current;
      map.flyTo([match.lat, match.lng], 16, { duration: 1.2 });
    }
  }, [searchTerm, onlineDrivers]);

  // 3. Leaflet Map Initialization with Sleek Compact 28px Pin Markers
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let isSubscribed = true;

    import("leaflet").then((L) => {
      if (!isSubscribed || !mapRef.current) return;

      if (!leafletInstance.current) {
        const defaultCenter: [number, number] =
          filteredDrivers.length > 0
            ? [filteredDrivers[0].lat, filteredDrivers[0].lng]
            : [23.8103, 90.4125];

        const map = L.map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          zoomControl: false,
        });

        leafletInstance.current = map;

        // OpenStreetMap Standard Tiles - 100% Free, Crisp & No Watermark!
        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }
        ).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);
      }

      const map = leafletInstance.current;

      const currentMarkerIds = new Set(Object.keys(markersRef.current));
      const activeIds = new Set<string>();

      filteredDrivers.forEach((driver) => {
        activeIds.add(driver.driverId);
        const isSelected = selectedDriver?.driverId === driver.driverId;

        // Sleek, compact 28px x 28px professional marker with drop pin tail
        const customHtml = `
          <div class="relative cursor-pointer group flex flex-col items-center">
            <div class="w-7 h-7 rounded-full bg-[#10B981] text-white font-extrabold text-[10px] flex items-center justify-center shadow-md border-2 border-white transition-all duration-200 group-hover:scale-125 ${isSelected ? 'ring-4 ring-[#10B981]/40 scale-125' : ''}">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping absolute -top-0.5 -right-0.5 border border-white" />
              <span>${driver.initials}</span>
            </div>
            <div class="w-0 h-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-[#10B981] -mt-0.5"></div>
            <div class="absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
              ${driver.fullName} (${driver.customId})
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: "custom-tracking-marker",
          iconSize: [28, 33],
          iconAnchor: [14, 33],
        });

        if (markersRef.current[driver.driverId]) {
          const marker = markersRef.current[driver.driverId];
          marker.setLatLng([driver.lat, driver.lng]);
          marker.setIcon(icon);
        } else {
          const marker = L.marker([driver.lat, driver.lng], { icon }).addTo(map);
          marker.on("click", () => {
            setSelectedDriver(driver);
            map.flyTo([driver.lat, driver.lng], 16, { duration: 1.2 });
          });
          markersRef.current[driver.driverId] = marker;
        }
      });

      // Clear markers for drivers that went offline
      currentMarkerIds.forEach((id) => {
        if (!activeIds.has(id)) {
          map.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });
    });

    return () => {
      isSubscribed = false;
    };
  }, [filteredDrivers, selectedDriver]);

  return (
    <div className="space-y-4">
      {/* Top Header Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Online Drivers Counter */}
        <div className="flex items-center gap-3">
          <span className="bg-emerald-50 text-[#10B981] border border-emerald-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>{onlineDrivers.length} Online Drivers Active</span>
          </span>
        </div>

        {/* Right: Search + Socket Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver ID (e.g. MS-DRV-0000009), name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-slate-50/50 text-slate-900 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap ${
              socketConnected
                ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>{socketConnected ? "Live Socket Connected" : "Connecting Socket..."}</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100">
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Empty State Overlay if No Drivers Online */}
        {onlineDrivers.length === 0 && (
          <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 px-6 py-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 text-slate-700 font-semibold text-xs">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <span>Waiting for online drivers to send GPS pings via WebSocket...</span>
            </div>
          </div>
        )}

        {/* Selected Online Driver Popup Overlay */}
        {selectedDriver && (
          <div className="absolute bottom-6 left-6 z-[1000] w-80 sm:w-96 bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                {selectedDriver.image ? (
                  <img
                    src={selectedDriver.image}
                    alt={selectedDriver.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-2xl ${selectedDriver.bg} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {selectedDriver.initials}
                  </div>
                )}
                <div>
                  <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                    {selectedDriver.fullName}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono font-medium block mt-0.5">
                    ID: {selectedDriver.customId}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#10B981] border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      ONLINE LIVE
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Driver Specs Box */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3">
              <div className="text-center">
                <span className="block text-xs font-bold text-slate-800 uppercase">
                  {selectedDriver.vehicleType}
                </span>
                <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                  Vehicle
                </span>
              </div>

              <div className="text-center border-x border-slate-200 px-1">
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{selectedDriver.rating}</span>
                </div>
                <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                  Rating
                </span>
              </div>

              <div className="text-center">
                <span className="block text-xs font-bold text-slate-800 font-mono">
                  {selectedDriver.phone.slice(-6)}
                </span>
                <span className="block text-[9px] font-medium text-slate-400 mt-0.5">
                  Contact
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-500">
                Lat: {selectedDriver.lat.toFixed(4)}, Lng: {selectedDriver.lng.toFixed(4)}
              </span>

              <a
                href={`tel:${selectedDriver.phone}`}
                className="inline-flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Driver</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
