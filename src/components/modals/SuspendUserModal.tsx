"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export default function SuspendUserModal({
  isOpen,
  onClose,
  onConfirm,
}: SuspendUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col items-center text-center relative">
        {/* Top Right Red Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 size-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        <DialogHeader className="flex flex-col items-center pt-2">
          {/* Red Alert Icon */}
          <div className="size-16 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mb-4">
            <AlertCircle className="h-9 w-9 stroke-[1.75]" />
          </div>

          {/* Title */}
          <DialogTitle className="text-xl font-bold text-[#10B981] tracking-tight">
            Suspend User?
          </DialogTitle>
        </DialogHeader>

        {/* Subtitle */}
        <p className="text-sm font-normal text-slate-500 mt-2 mb-6">
          Are you sure you want to suspend this user?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-slate-400 hover:bg-slate-500 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-none"
          >
            Yes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
