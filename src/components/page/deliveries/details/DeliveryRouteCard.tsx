import React from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { ParcelDetail } from "./types";

const InteractiveMap = dynamic(
  () => import("@/components/common/InteractiveMap"),
  { ssr: false }
);

interface DeliveryRouteCardProps {
  parcel: ParcelDetail;
  pickupAddress: string;
  dropAddress: string;
  liveDriverCoords: { lat: number; lng: number } | null;
}

export default function DeliveryRouteCard({
  parcel,
  pickupAddress,
  dropAddress,
  liveDriverCoords,
}: DeliveryRouteCardProps) {
  const isDelivered = parcel.status?.toUpperCase() === "DELIVERED";
  const isCancelled = parcel.status?.toUpperCase() === "CANCELLED";

  const pickupLat = parcel.pickupLocation?.coordinates?.[1] || 23.746187;
  const pickupLng = parcel.pickupLocation?.coordinates?.[0] || 90.374528;
  const dropLat = parcel.dropLocation?.coordinates?.[1] || 23.750187;
  const dropLng = parcel.dropLocation?.coordinates?.[0] || 90.380528;

  const showLiveDriverMarker =
    liveDriverCoords &&
    !["DELIVERED", "CANCELLED", "COMPLETED", "FAILED", "RETURNED"].includes(
      parcel.status?.toUpperCase() || ""
    );

  return (
    <div className="bg-[#FFFDF5] rounded-3xl p-6 md:p-8 border border-amber-100/60 shadow-sm space-y-6">
      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        DELIVERY ROUTE
      </span>

      {/* Route Timeline */}
      <div className="space-y-6 relative pl-2">
        <div className="absolute left-[13px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-300" />

        {/* Pickup */}
        <div className="flex items-start gap-4 relative z-10">
          <span className="size-3 rounded-full bg-[#10B981] mt-1 shrink-0 ring-4 ring-[#E6F4EA]" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Pickup Location</h4>
            <p className="text-xs text-slate-600 mt-0.5 font-semibold">{pickupAddress}</p>
          </div>
        </div>

        {/* Dropoff */}
        <div className="flex items-start gap-4 relative z-10">
          <span className="size-3 rounded-full bg-slate-700 mt-1 shrink-0 ring-4 ring-slate-100" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Dropoff Location</h4>
            <p className="text-xs text-slate-600 mt-0.5 font-semibold">{dropAddress}</p>
          </div>
        </div>
      </div>

      {/* Map Preview */}
      <div className="relative w-full h-[240px] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-inner">
        <InteractiveMap
          center={
            liveDriverCoords
              ? [liveDriverCoords.lat, liveDriverCoords.lng]
              : [pickupLat, pickupLng]
          }
          zoom={13}
          markers={[
            {
              lat: pickupLat,
              lng: pickupLng,
              title: "Pickup Location",
              popupText: pickupAddress,
              iconType: "pickup",
            },
            {
              lat: dropLat,
              lng: dropLng,
              title: "Dropoff Location",
              popupText: dropAddress,
              iconType: "dropoff",
            },
            ...(showLiveDriverMarker
              ? [
                  {
                    lat: liveDriverCoords.lat,
                    lng: liveDriverCoords.lng,
                    title: parcel.driver?.fullName || "Live Driver",
                    popupText: "Live Location Ping",
                    iconType: "driver" as const,
                  },
                ]
              : []),
          ]}
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          {isDelivered ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 text-white shadow-md">
              ✓ Parcel Delivered
            </span>
          ) : isCancelled ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-600 text-white shadow-md">
              ✕ Delivery Cancelled
            </span>
          ) : liveDriverCoords ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/95 text-emerald-600 shadow-md border border-slate-200/80">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              Live Driver Location
            </span>
          ) : null}
        </div>

        {/* Map Pins Simulation Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 max-w-[90%] pointer-events-none">
          <MapPin className="h-4 w-4 text-[#10B981] shrink-0" />
          <span className="text-xs font-bold text-slate-800 truncate">
            {pickupAddress} ➔ {dropAddress}
          </span>
        </div>
      </div>
    </div>
  );
}
