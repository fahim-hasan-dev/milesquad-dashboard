"use client";

import React from "react";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white rounded-3xl p-6 border-none shadow-2xl flex flex-col gap-5 text-center">
        {/* Warning Icon Header */}
        <div className="mx-auto size-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0">
          <LogOut className="h-7 w-7" />
        </div>

        {/* Text Content */}
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-xl font-bold text-slate-900 text-center">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed text-center">
            Are you sure you want to log out of your admin account? You will need to log back in to access the dashboard.
          </DialogDescription>
        </DialogHeader>

        {/* Buttons Action Bar */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-none cursor-pointer"
          >
            Yes, Logout
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
