"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  driverAvatar?: string;
  vehicle?: string;
  contact?: string;
  locationName?: string;
}

export default function TrackDriverModal({
  isOpen,
  onClose,
  driverName = "Sumon Mia",
  driverAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
  vehicle = "Truck",
  locationName = "Downtown District, Sector 4",
}: TrackDriverModalProps) {
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");

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
                <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-[#10B981] animate-ping" />
                  Live
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

          {/* Embedded Google Map */}
          <iframe
            title="Google Map Live Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=23.746187,90.374528&t=${
              mapType === "satellite" ? "k" : "m"
            }&z=14&ie=UTF8&iwloc=&output=embed`}
          />

          {/* Center Pin Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
            <div className="bg-[#18181B] text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-xl border border-emerald-400 flex items-center gap-1.5 mb-1 animate-bounce">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{driverName} ({vehicle})</span>
            </div>
            <div className="relative flex items-center justify-center">
              <span className="absolute size-10 rounded-full bg-emerald-400/40 animate-ping" />
              <div className="size-7 rounded-full bg-[#10B981] border-2 border-white shadow-lg flex items-center justify-center">
                <Navigation className="h-3.5 w-3.5 text-white fill-white rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <MapPin className="h-4 w-4 text-[#10B981]" />
            <span>Current Location: <strong className="text-slate-900">{locationName}</strong></span>
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
