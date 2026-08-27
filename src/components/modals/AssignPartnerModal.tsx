"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Building2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";

interface PartnerItem {
  _id: string;
  partnerId?: string;
  fullName: string;
  email?: string;
  phone?: string;
  rolePosition?: string;
}

interface AssignPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelId?: string;
  customerName?: string;
  onConfirmPartnerAssignment?: (partnerName: string) => void;
}

export default function AssignPartnerModal({
  isOpen,
  onClose,
  parcelId,
  customerName = "Customer",
  onConfirmPartnerAssignment,
}: AssignPartnerModalProps) {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await myFetch("/partner?limit=50");
      if (res.success && res.data) {
        const list = res.data.partners || res.data.data || res.data || [];
        setPartners(list);
        if (list.length > 0) {
          setSelectedPartnerId(list[0]._id);
        }
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPartners();
    }
  }, [isOpen, fetchPartners]);

  const handleConfirm = async () => {
    if (!parcelId || !selectedPartnerId) {
      toast.error("Please select a partner to assign");
      return;
    }

    setSubmitting(true);
    toast.loading("Assigning partner...", { id: "assign-partner" });

    try {
      const res = await myFetch(`/parcel/assign/${parcelId}`, {
        method: "PATCH",
        body: { partnerId: selectedPartnerId },
      });

      if (res.success) {
        const selectedPartner = partners.find((p) => p._id === selectedPartnerId);
        const partnerName = selectedPartner?.fullName || "Partner";
        toast.success(`Partner ${partnerName} assigned successfully!`, { id: "assign-partner" });
        if (onConfirmPartnerAssignment) {
          onConfirmPartnerAssignment(partnerName);
        }
        onClose();
      } else {
        toast.error(res.message || "Failed to assign partner", { id: "assign-partner" });
      }
    } catch (error) {
      console.error("Assign partner error:", error);
      toast.error("Network error. Could not assign partner.", { id: "assign-partner" });
    } finally {
      setSubmitting(false);
    }
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
            Order #{parcelId?.slice(-8).toUpperCase()}
          </DialogTitle>
          <p className="text-xs text-slate-400 font-medium">Customer: {customerName}</p>
        </DialogHeader>

        {/* Partners List */}
        <div className="space-y-3">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AVAILABLE PARTNERS ({partners.length})
          </span>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />
              <span className="text-xs font-medium">Loading partners...</span>
            </div>
          ) : partners.length > 0 ? (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {partners.map((partner) => {
                const isSelected = selectedPartnerId === partner._id;
                const initials = partner.fullName
                  ? partner.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "PT";

                return (
                  <div
                    key={partner._id}
                    onClick={() => setSelectedPartnerId(partner._id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#10B981] bg-[#E6F4EA]/50 shadow-sm"
                        : "border-slate-100 bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Left Avatar + Info */}
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {partner.fullName}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {partner.email || partner.phone || "Partner"}
                        </p>
                      </div>
                    </div>

                    {/* Right Select Check */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {partner.partnerId ? `#${partner.partnerId}` : ""}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-[#10B981] fill-[#10B981] text-white shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No partners found.
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || !selectedPartnerId}
            className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <span>Confirm Assignment</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
