import React from "react";
import Image from "next/image";
import { Shield, Calendar, Star, Wallet, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { DriverDetailData } from "./types";

interface RiderSummaryCardProps {
  rider: DriverDetailData;
  isPending: boolean;
}

export default function RiderSummaryCard({
  rider,
  isPending,
}: RiderSummaryCardProps) {
  const isApproved =
    rider.verification === "approved" || rider.verification === "APPROVED";
  const isRejected =
    rider.verification === "rejected" || rider.verification === "REJECTED";
  const statusString = isApproved ? "Active" : isRejected ? "Suspended" : "Pending";

  return (
    <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
      {/* Avatar Picture */}
      <div className="relative mb-3">
        {rider.avatar ? (
          <Image
            src={rider.avatar}
            alt={rider.name}
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#10B981] text-white font-black flex items-center justify-center text-2xl shadow-sm border-4 border-slate-50">
            {(rider.name || "R").charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* User Name & ID */}
      <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
        {rider.name}
      </h2>
      <span className="text-xs font-medium text-slate-400 mt-0.5 mb-3 block">
        #{rider.id}
      </span>

      {/* Status & Driver Badge */}
      <div className="flex items-center gap-2 mb-2">
        <StatusBadge status={statusString} />
        <span className="inline-block bg-[#FFF7ED] text-[#EA580C] text-xs font-bold px-3 py-1 rounded-full border border-amber-200/50">
          {rider.vehicle}
        </span>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-slate-100 my-5" />

      {/* Metadata Rows */}
      <div className="w-full space-y-3.5 text-left">
        <div className="flex items-start gap-3.5">
          <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">Role</span>
            <span className="block text-sm font-bold text-[#18181B] mt-0.5">
              {rider.role}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">
              {isPending ? "Date Applied" : "Joined"}
            </span>
            <span className="block text-sm font-bold text-[#18181B] mt-0.5">
              {rider.joinedDate}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <Star className="h-4 w-4 text-amber-500 fill-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-[#18181B]">
                {rider.averageRating ? rider.averageRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ({rider.totalRating || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <Wallet className="h-4 w-4 text-[#10B981] mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">Driver Wallet</span>
            <span className="block text-sm font-bold text-[#10B981] mt-0.5">
              ${rider.wallet ? Number(rider.wallet).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        {/* Rejection notice if driver was rejected */}
        {rider.rejectReason && rider.verification === "rejected" && (
          <div className="w-full mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Rejection Reason</span>
            </div>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              {rider.rejectReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
