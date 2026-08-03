"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Building2,
  User,
  CreditCard,
  Calendar,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    customerOrRecipient: string;
    type?: string;
    amount: string;
    method: string;
    status: string;
    date: string;
  } | null;
}

export default function ViewReceiptModal({
  isOpen,
  onClose,
  data,
}: ViewReceiptModalProps) {
  if (!data) return null;

  const handlePrintDownload = () => {
    toast.success(`Receipt for ${data.id} downloaded!`);
  };

  const renderStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Completed</span>
        </span>
      );
    }
    if (status === "Pending" || status === "Processing") {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
          <Clock className="h-3.5 w-3.5" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
        <XCircle className="h-3.5 w-3.5" />
        <span>Failed</span>
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Modal Header */}
        <DialogHeader className="text-left space-y-1 border-b border-slate-100 pb-4">
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            Transaction Receipt
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Payment summary and confirmation details.
          </p>
        </DialogHeader>

        {/* Amount Banner */}
        <div className="bg-[#FFFDF5] border border-amber-100 p-5 rounded-2xl text-center space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            TOTAL AMOUNT
          </span>
          <h2 className="text-2xl font-black text-slate-900">{data.amount}</h2>
          <div className="pt-1 flex justify-center">{renderStatusBadge(data.status)}</div>
        </div>

        {/* Receipt Details Grid */}
        <div className="space-y-3.5 text-left text-xs md:text-sm">
          {/* Reference ID */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-400" />
              <span>Reference ID</span>
            </span>
            <span className="font-bold text-slate-900">{data.id}</span>
          </div>

          {/* Customer / Recipient */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span>{data.type ? "Recipient" : "Customer"}</span>
            </span>
            <span className="font-bold text-slate-900">{data.customerOrRecipient}</span>
          </div>

          {/* Recipient Type (If Payout) */}
          {data.type && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>Account Type</span>
              </span>
              <span className="font-bold text-[#10B981]">{data.type}</span>
            </div>
          )}

          {/* Payment Method */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <span>Payment Method</span>
            </span>
            <span className="font-bold text-slate-900">{data.method}</span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Transaction Date</span>
            </span>
            <span className="font-bold text-slate-900">{data.date}</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrintDownload}
            className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-none flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
