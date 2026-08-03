"use client";

import React, { useState } from "react";
import { CheckCircle2, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { masterPartnersList } from "@/demoData/partnersManagementData";

interface AssignPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  customerName?: string;
  onConfirmPartnerAssignment?: (partnerName: string) => void;
}

export default function AssignPartnerModal({
  isOpen,
  onClose,
  orderId = "#ORD-29483",
  customerName = "Marcus Wei",
  onConfirmPartnerAssignment,
}: AssignPartnerModalProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("P-001");

  const handleConfirm = () => {
    const partner = masterPartnersList.find((p) => p.id === selectedPartnerId);
    const partnerName = partner ? partner.name : "Partner";

    if (onConfirmPartnerAssignment) {
      onConfirmPartnerAssignment(partnerName);
    } else {
      toast.success(`Assigned partner ${partnerName} to ${orderId}`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Modal Header */}
        <DialogHeader className="text-left space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-[#10B981]" />
            <span>ASSIGN PARTNER</span>
          </span>
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            {orderId}
          </DialogTitle>
          <p className="text-xs text-slate-400 font-medium">{customerName}</p>
        </DialogHeader>

        {/* Partners List */}
        <div className="space-y-3">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AVAILABLE PARTNERS ({masterPartnersList.length})
          </span>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {masterPartnersList.map((partner) => {
              const isSelected = selectedPartnerId === partner.id;

              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[#10B981] bg-[#E6F4EA]/50 shadow-sm"
                      : "border-slate-100 bg-white hover:bg-slate-50/80"
                  }`}
                >
                  {/* Left Avatar + Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-full ${partner.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {partner.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {partner.email}
                      </p>
                    </div>
                  </div>

                  {/* Right Select Check */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">
                      #{partner.id}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] fill-[#10B981] text-white shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-none"
          >
            Confirm Assignment
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
