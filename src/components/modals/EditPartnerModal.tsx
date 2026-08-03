"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { PartnerRecord } from "@/demoData/partnersManagementData";

interface EditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerRecord | null;
  onUpdatePartner: (updated: PartnerRecord) => void;
}

export default function EditPartnerModal({
  isOpen,
  onClose,
  partner,
  onUpdatePartner,
}: EditPartnerModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (partner) {
      setName(partner.name || "");
      setEmail(partner.email || "");
      setPhone(partner.phone || "");
    }
  }, [partner]);

  if (!partner) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const updatedPartner: PartnerRecord = {
      ...partner,
      name,
      initials: initials || partner.initials,
      email,
      phone,
    };

    onUpdatePartner(updatedPartner);
    toast.success("Partner updated successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Modal Header */}
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            Edit Partner Details
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Update contact and profile information for {partner.name}.
          </p>
        </DialogHeader>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editFullName" className="text-xs font-semibold text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="editFullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editEmail" className="text-xs font-semibold text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="editEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editPhone" className="text-xs font-semibold text-slate-700">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="editPhone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
