/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPartner: (newPartner: any) => void;
}

export default function AddPartnerModal({
  isOpen,
  onClose,
  onAddPartner,
}: AddPartnerModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("fullName") as string;
    const role = formData.get("role") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!name || !role || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newPartner = {
      id: `P-${Date.now()}`,
      name,
      initials: initials || "PA",
      avatarBg: "bg-cyan-500",
      role,
      email,
      phone,
      dateAdded: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    onAddPartner(newPartner);
    toast.success("Partner added successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Modal Header */}
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            Add Partner
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Fill in the details below to add a new partner.
          </p>
        </DialogHeader>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g. Sarah Mitchell"
                required
                className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
              />
            </div>
          </div>

          {/* Role / Position */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="role" className="text-xs font-semibold text-slate-700">
              Role / Position
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="role"
                name="role"
                type="text"
                placeholder="e.g. Distribution Manager"
                required
                className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. sarah@company.com"
                required
                className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                name="phone"
                type="text"
                placeholder="e.g. +16541234567"
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
              Add Partner
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
