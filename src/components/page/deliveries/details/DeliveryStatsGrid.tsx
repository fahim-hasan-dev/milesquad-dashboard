import React from "react";
import { Calendar, FileText, Bike, Ruler, Clock } from "lucide-react";
import { ParcelDetail } from "./types";

interface DeliveryStatsGridProps {
  parcel: ParcelDetail;
  createdAtDate: string;
  createdAtTime: string;
}

export default function DeliveryStatsGrid({
  parcel,
  createdAtDate,
  createdAtTime,
}: DeliveryStatsGridProps) {
  const dist = parcel.dropDistance ?? parcel.distance ?? parcel.pickUpDistance;
  const formattedDistance =
    dist !== undefined && dist !== null ? `${Number(dist).toFixed(1)} km` : "N/A";

  const dur = parcel.dropDuration ?? parcel.duration ?? parcel.pickUpDuration;
  const formattedDuration =
    dur !== undefined && dur !== null ? `${Math.round(Number(dur))} mins` : "N/A";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Date & Time */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
        <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">
            DATE & TIME
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{createdAtDate}</h4>
          <span className="text-xs text-slate-400 font-medium">{createdAtTime}</span>
        </div>
      </div>

      {/* Parcel Type */}
      <div className="bg-[#E6F4EA]/30 rounded-2xl p-5 border border-emerald-100/60 shadow-sm space-y-2">
        <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">
            GOOD TYPE
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5 capitalize">
            {parcel.goodType || "General"}
          </h4>
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
        <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <Bike className="h-4 w-4" />
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">
            VEHICLE TYPE
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5 capitalize">
            {parcel.vehicleType || "Motorcycle"}
          </h4>
        </div>
      </div>

      {/* Distance */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
        <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <Ruler className="h-4 w-4" />
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">
            DISTANCE
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
            {formattedDistance}
          </h4>
        </div>
      </div>

      {/* Duration */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
        <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase">
            DURATION
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
            {formattedDuration}
          </h4>
        </div>
      </div>
    </div>
  );
}
