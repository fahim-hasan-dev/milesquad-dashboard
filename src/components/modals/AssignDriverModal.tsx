"use client";

import React, { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  customerName?: string;
  onConfirmAssignment?: (driverName: string) => void;
}

const availableDrivers = [
  {
    id: "D-1",
    name: "Sumon Mia",
    initials: "SM",
    vehicle: "Truck",
    distance: "4.5 Km",
    rating: 4.7,
    completedToday: "5 done today",
  },
  {
    id: "D-2",
    name: "Sumon Mia",
    initials: "SM",
    vehicle: "Truck",
    distance: "4.5 Km",
    rating: 4.7,
    completedToday: "5 done today",
  },
  {
    id: "D-3",
    name: "Rafiqul Islam",
    initials: "RI",
    vehicle: "Van",
    distance: "4.5 Km",
    rating: 4.8,
    completedToday: "4 done today",
  },
  {
    id: "D-4",
    name: "Jahangir Alam",
    initials: "JA",
    vehicle: "Tricycle",
    distance: "4.5 Km",
    rating: 4.6,
    completedToday: "8 done today",
  },
];

export default function AssignDriverModal({
  isOpen,
  onClose,
  orderId = "#ORD-29483",
  customerName = "Marcus Wei",
  onConfirmAssignment,
}: AssignDriverModalProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string>("D-1");

  const handleConfirm = () => {
    const driver = availableDrivers.find((d) => d.id === selectedDriverId);
    if (driver && onConfirmAssignment) {
      onConfirmAssignment(driver.name);
    } else {
      toast.success(`Assigned driver to ${orderId}`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6 relative">
        {/* Modal Header */}
        <DialogHeader className="text-left space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            ASSIGN DRIVER
          </span>
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            {orderId}
          </DialogTitle>
          <p className="text-xs text-slate-400 font-medium">{customerName}</p>
        </DialogHeader>

        {/* Drivers List */}
        <div className="space-y-3">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AVAILABLE DRIVERS ({availableDrivers.length})
          </span>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {availableDrivers.map((driver) => {
              const isSelected = selectedDriverId === driver.id;

              return (
                <div
                  key={driver.id}
                  onClick={() => setSelectedDriverId(driver.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[#10B981] bg-[#E6F4EA]/50 shadow-sm"
                      : "border-slate-100 bg-white hover:bg-slate-50/80"
                  }`}
                >
                  {/* Left Avatar + Info */}
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                      {driver.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {driver.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {driver.vehicle} · {driver.distance}
                      </p>
                    </div>
                  </div>

                  {/* Right Rating + Check */}
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{driver.rating}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                        {driver.completedToday}
                      </span>
                    </div>

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
