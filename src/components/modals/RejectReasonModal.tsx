"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { XCircle, Loader2 } from "lucide-react";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  loading?: boolean;
  title?: string;
  driverName?: string;
}

export default function RejectReasonModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Reject Driver Profile",
  driverName = "Driver",
}: RejectReasonModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const presetReasons = [
    "Invalid or blurry document scan",
    "Incomplete vehicle specs",
    "Unclear profile photo",
    "Expired driver's license",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for rejecting this driver profile.");
      return;
    }
    setError("");
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md w-[92vw] bg-white rounded-3xl p-6 border-none shadow-2xl space-y-4">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <div className="size-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Rejecting verification for <span className="font-semibold text-slate-800">{driverName}</span>
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Reason for Rejection
            </Label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Explain why this driver profile request is being rejected..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-slate-400 resize-none"
            />
            {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}
          </div>

          {/* Quick Preset Reason Chips */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-400">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetReasons.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setReason(preset);
                    if (error) setError("");
                  }}
                  className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-10 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
              <span>Reject Request</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
