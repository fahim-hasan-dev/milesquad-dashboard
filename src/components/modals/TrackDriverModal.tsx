"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTrackingSocket } from "@/utils/socket";
import { MAP_API_KEY } from "@/config/env-config";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@/components/common/InteractiveMap"),
  { ssr: false }
);

interface TrackDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId?: string;
  parcelId?: string;
  driverName?: string;
  driverAvatar?: string;
  vehicle?: string;
  contact?: string;
  locationName?: string;
  initialLat: number;
  initialLng: number;
}

export default function TrackDriverModal({
  isOpen,
  onClose,
  driverId,
  parcelId,
  driverName = "Driver",
  driverAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
  vehicle = "Vehicle",
  locationName = "Current Location",
  initialLat,
  initialLng,
}: TrackDriverModalProps) {
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  useEffect(() => {
    if (!isOpen) return;

    setCoords({ lat: initialLat, lng: initialLng });
    setIsLive(true);

    const socket = getTrackingSocket();

    const handleSingleDriverUpdate = (rawPayload: any) => {
      const data = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
      if (data && data.lat && data.lng) {
        setCoords({ lat: Number(data.lat), lng: Number(data.lng) });
        setIsLive(true);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    };

    const handleDriverOffline = () => {
      setIsLive(false);
    };

    const handleParcelUpdate = (rawPayload: any) => {
      const data = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
      if (data && data.lat && data.lng) {
        setCoords({ lat: Number(data.lat), lng: Number(data.lng) });
        setIsLive(true);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    };

    if (driverId) {
      socket.emit("admin:track-single-driver", { driverId });
      socket.on("single-driver:location-updated", handleSingleDriverUpdate);
      socket.on("single-driver:offline", handleDriverOffline);
    }

    if (parcelId) {
      socket.emit("user:track-parcel", { parcelId });
      socket.on("parcel:tracking-update", handleParcelUpdate);
    }

    return () => {
      if (driverId) {
        socket.emit("admin:untrack-single-driver", { driverId });
        socket.off("single-driver:location-updated", handleSingleDriverUpdate);
        socket.off("single-driver:offline", handleDriverOffline);
      }
      if (parcelId) {
        socket.emit("user:untrack-parcel", { parcelId });
        socket.off("parcel:tracking-update", handleParcelUpdate);
      }
    };
  }, [isOpen, driverId, parcelId, initialLat, initialLng]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[92vw] bg-white rounded-3xl p-6 md:p-8 border-none shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <DialogHeader className="flex flex-row items-center justify-between gap-4 pb-2 border-b border-slate-100 space-y-0">
          <div className="flex items-center gap-3.5">
            <Image
              src={driverAvatar}
              alt={driverName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg md:text-xl font-bold text-[#18181B] tracking-tight">
                  Live Location: {driverName}
                </DialogTitle>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isLive ? "bg-[#E6F4EA] text-[#10B981]" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isLive ? "bg-[#10B981] animate-ping" : "bg-slate-400"
                    }`}
                  />
                  {isLive ? "Live GPS" : "Connecting Socket..."}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Vehicle: <span className="font-bold text-slate-700">{vehicle}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Map Container */}
        <div className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
          {/* Map Mode Controls Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setMapType("standard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === "standard"
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType("satellite")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === "satellite"
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Interactive Map Component */}
          <InteractiveMap
            center={[coords.lat, coords.lng]}
            zoom={15}
            mapType={mapType}
            markers={[
              {
                id: "driver",
                lat: coords.lat,
                lng: coords.lng,
                title: `${driverName} (${vehicle})`,
                popupText: `Live Location: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
                iconType: "driver",
              },
            ]}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <MapPin className="h-4 w-4 text-[#10B981]" />
            <span>
              Coordinates:{" "}
              <strong className="text-slate-900">
                {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </strong>
              {isLive && <span className="ml-2 text-emerald-600 font-bold">({lastUpdated})</span>}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
