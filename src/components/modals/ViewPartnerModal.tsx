"use client";

import React from "react";
import { Mail, Phone, Calendar, Hash, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PartnerRecord } from "@/demoData/partnersManagementData";

interface ViewPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerRecord | null;
}

export default function ViewPartnerModal({
  isOpen,
  onClose,
  partner,
}: ViewPartnerModalProps) {
  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Modal Header */}
        <DialogHeader className="text-left space-y-1 border-b border-slate-100 pb-4">
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            Partner Profile
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Detailed information about this partner.
          </p>
        </DialogHeader>

        {/* Partner Profile Header Card */}
        <div className="flex items-center gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
          <div
            className={`size-14 rounded-2xl ${partner.avatarBg} text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm`}
          >
            {partner.initials}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {partner.name}
            </h3>
            <span className="text-xs text-slate-400 font-medium block mt-0.5">
              #{partner.id}
            </span>
          </div>
        </div>

        {/* Partner Info Details List */}
        <div className="space-y-4 text-left">
          {/* Full Name */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <span className="w-28 font-medium text-slate-400">Full Name</span>
              <span className="font-bold text-slate-900">{partner.name}</span>
            </div>
          </div>

          {/* Partner ID */}
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <span className="w-28 font-medium text-slate-400">Partner ID</span>
              <span className="font-bold text-slate-900">#{partner.id}</span>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <span className="w-28 font-medium text-slate-400">Email Address</span>
              <span className="font-bold text-slate-900">{partner.email}</span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <span className="w-28 font-medium text-slate-400">Phone Number</span>
              <span className="font-bold text-slate-900">{partner.phone}</span>
            </div>
          </div>

          {/* Date Added */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <span className="w-28 font-medium text-slate-400">Date Added</span>
              <span className="font-bold text-slate-900">{partner.dateAdded}</span>
            </div>
          </div>
        </div>

        {/* Modal Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Close Details
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
