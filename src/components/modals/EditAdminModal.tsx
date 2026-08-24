"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Phone, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";

export interface AdminData {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  status: "active" | "inactive" | "blocked" | "deleted";
  createdAt?: string;
  updatedAt?: string;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminData | null;
  onSuccess: () => void;
}

export default function EditAdminModal({
  isOpen,
  onClose,
  admin,
  onSuccess,
}: EditAdminModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName || "");
      setEmail(admin.email || "");
      setPhone(admin.phone || "");
    }
  }, [admin]);

  if (!admin) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    toast.loading("Updating admin...", { id: "update-admin" });

    try {
      const res = await myFetch(`/admin/${admin._id}`, {
        method: "PATCH",
        body: {
          fullName,
          email,
          phone: phone || undefined,
        },
      });

      if (res.success) {
        toast.success("Admin details updated successfully!", {
          id: "update-admin",
        });
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || res.error || "Failed to update admin", {
          id: "update-admin",
        });
      }
    } catch {
      toast.error("Error connecting to server", { id: "update-admin" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-center space-y-1">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <UserCheck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-center">
            Edit Admin Details
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Update administrator name, email, or contact number.
          </p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editAdminName" className="text-xs font-semibold text-slate-700">
              Admin Full Name <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="editAdminName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editAdminEmail" className="text-xs font-semibold text-slate-700">
              Email Address <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="editAdminEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editAdminPhone" className="text-xs font-semibold text-slate-700">
              Phone Number
            </Label>
            <Input
              id="editAdminPhone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +16541234567"
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
