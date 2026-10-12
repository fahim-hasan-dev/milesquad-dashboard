import React from "react";
import Image from "next/image";
import { Star, Building2, Send, Phone } from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";
import { ParcelDetail } from "./types";

interface DeliveryParticipantsCardProps {
  parcel: ParcelDetail;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar: string;
  pickupAddress: string;
}

export default function DeliveryParticipantsCard({
  parcel,
  customerName,
  customerPhone,
  customerEmail,
  customerAvatar,
  pickupAddress,
}: DeliveryParticipantsCardProps) {
  return (
    <>
      {/* Assigned Driver Card */}
      {parcel.driver && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            ASSIGNED DRIVER
          </span>

          <div className="flex items-center gap-3.5">
            {parcel.driver.image ? (
              <Image
                src={getImageUrl(parcel.driver.image)}
                alt={parcel.driver.fullName || "Driver"}
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#10B981] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                {(parcel.driver.fullName || "D").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {parcel.driver.fullName}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold mt-0.5">
                <Star className="h-3.5 w-3.5 fill-[#10B981] text-[#10B981]" />
                <span>
                  {parcel.driver.driverInfo?.averageRating || 4.8} Rating
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {parcel.driver.phone || "Active Driver"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Partner Card */}
      {parcel.partner && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            ASSIGNED PARTNER
          </span>

          <div className="flex items-center gap-3.5">
            <div className="size-14 rounded-2xl bg-[#10B981] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
              {(parcel.partner.fullName || "P").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {parcel.partner.fullName}
              </h4>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#10B981] text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                <Building2 className="h-3 w-3" />
                <span>Partner #{parcel.partner.partnerId || "PARTNER"}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Customer / Sender Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Send className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            CUSTOMER / SENDER INFO
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {customerAvatar ? (
              <Image
                src={customerAvatar}
                alt={customerName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                {customerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-900">{customerName}</h4>
              <span className="text-xs text-slate-400 font-normal">{customerEmail}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-2">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{customerPhone}</span>
          </div>
          <p className="text-xs text-slate-400 font-normal leading-relaxed pt-1">
            {pickupAddress}
          </p>
        </div>
      </div>
    </>
  );
}
