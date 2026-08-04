"use client";

import React, { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // e.g. "Download Deliveries Data"
  filterLabel?: string; // e.g. "Order Status", "User Role", "Transaction Type"
  filterOptions?: { label: string; value: string }[];
  onDownload?: (exportParams: {
    startDate: string;
    endDate: string;
    filter: string;
    format: string;
  }) => void;
}

export default function ExportDataModal({
  isOpen,
  onClose,
  title,
  filterLabel = "Filter Status",
  filterOptions = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Pending", value: "PENDING" },
  ],
  onDownload,
}: ExportDataModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(
    filterOptions[0]?.value || "ALL"
  );
  const [outputFormat, setOutputFormat] = useState("CSV (Spreadsheet)");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onDownload) {
      onDownload({
        startDate,
        endDate,
        filter: selectedFilter,
        format: outputFormat,
      });
    }

    toast.success(`Export initiated! Downloading ${outputFormat}...`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-6 md:p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Date & End Date Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start Date */}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="startDate" className="text-xs font-semibold text-slate-700">
                Start Date
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-xs font-medium text-slate-800 shadow-none px-3"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="endDate" className="text-xs font-semibold text-slate-700">
                End Date
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-xs font-medium text-slate-800 shadow-none px-3"
                />
              </div>
            </div>
          </div>

          {/* Filter Field (e.g. User Role, Order Status) */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="exportFilter" className="text-xs font-semibold text-slate-700">
              {filterLabel}
            </Label>
            <div className="relative">
              <select
                id="exportFilter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl bg-[#F8FAFC] border border-slate-200/80 px-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] shadow-none cursor-pointer pr-9"
              >
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Output Format Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="outputFormat" className="text-xs font-semibold text-slate-700">
              Output Format
            </Label>
            <div className="relative">
              <select
                id="outputFormat"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl bg-[#F8FAFC] border border-slate-200/80 px-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] shadow-none cursor-pointer pr-9"
              >
                <option value="CSV (Spreadsheet)">CSV (Spreadsheet)</option>
                <option value="Excel (.xlsx)">Excel (.xlsx)</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Download Now Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm rounded-xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Now</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
