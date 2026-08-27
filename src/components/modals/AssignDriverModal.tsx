"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle2, Loader2, Bike } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";

interface DriverItem {
  _id: string;
  fullName: string;
  phone?: string;
  email?: string;
  image?: string;
  distanceText?: string;
  driverInfo?: {
    vehicleType?: string;
    averageRating?: number;
    totalRating?: number;
  };
  distanceKm?: number;
}

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelId?: string;
  customerName?: string;
  onConfirmAssignment?: (driverName: string) => void;
}

export default function AssignDriverModal({
  isOpen,
  onClose,
  parcelId,
  customerName = "Customer",
  onConfirmAssignment,
}: AssignDriverModalProps) {
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  const fetchAvailableDrivers = useCallback(async () => {
    if (!parcelId) return;
    setLoading(true);
    try {
      // 1. Try available drivers for parcel endpoint
      const res = await myFetch(`/parcel/${parcelId}/available-drivers`);
      if (res.success && res.data?.drivers && res.data.drivers.length > 0) {
        setDrivers(res.data.drivers);
        setSelectedDriverId(res.data.drivers[0]._id);
      } else {
        // 2. Fallback to fetching all active drivers
        const fallbackRes = await myFetch(`/user?role=driver&status=active&limit=20`);
        if (fallbackRes.success && fallbackRes.data) {
          const list = fallbackRes.data.users || fallbackRes.data.data || fallbackRes.data || [];
          setDrivers(list);
          if (list.length > 0) {
            setSelectedDriverId(list[0]._id);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
      toast.error("Failed to load available drivers");
    } finally {
      setLoading(false);
    }
  }, [parcelId]);

  useEffect(() => {
    if (isOpen && parcelId) {
      fetchAvailableDrivers();
    }
  }, [isOpen, parcelId, fetchAvailableDrivers]);

  const handleConfirm = async () => {
    if (!parcelId || !selectedDriverId) {
      toast.error("Please select a driver to assign");
      return;
    }

    setSubmitting(true);
    toast.loading("Assigning driver...", { id: "assign-driver" });

    try {
      const res = await myFetch(`/parcel/assign/${parcelId}`, {
        method: "PATCH",
        body: { driverId: selectedDriverId },
      });

      if (res.success) {
        const selectedDriver = drivers.find((d) => d._id === selectedDriverId);
        const driverName = selectedDriver?.fullName || "Driver";
        toast.success(`Driver ${driverName} assigned successfully!`, { id: "assign-driver" });
        if (onConfirmAssignment) {
          onConfirmAssignment(driverName);
        }
        onClose();
      } else {
        toast.error(res.message || "Failed to assign driver", { id: "assign-driver" });
      }
    } catch (error) {
      console.error("Assign driver error:", error);
      toast.error("Network error. Could not assign driver.", { id: "assign-driver" });
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
            <Bike className="h-3.5 w-3.5 text-[#10B981]" />
            <span>ASSIGN DRIVER</span>
          </span>
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            Order #{parcelId?.slice(-8).toUpperCase()}
          </DialogTitle>
          <p className="text-xs text-slate-400 font-medium">Customer: {customerName}</p>
        </DialogHeader>

        {/* Drivers List */}
        <div className="space-y-3">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AVAILABLE DRIVERS ({drivers.length})
          </span>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />
              <span className="text-xs font-medium">Fetching nearby drivers...</span>
            </div>
          ) : drivers.length > 0 ? (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {drivers.map((driver) => {
                const isSelected = selectedDriverId === driver._id;
                const initials = driver.fullName
                  ? driver.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "DR";

                return (
                  <div
                    key={driver._id}
                    onClick={() => setSelectedDriverId(driver._id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#10B981] bg-[#E6F4EA]/50 shadow-sm"
                        : "border-slate-100 bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Left Avatar + Info */}
                    <div className="flex items-center gap-3">
                      {driver.image ? (
                        <img
                          src={getImageUrl(driver.image)}
                          alt={driver.fullName}
                          className="size-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {driver.fullName}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {driver.driverInfo?.vehicleType || "Driver"}
                          {driver.distanceText ? ` · ${driver.distanceText}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Right Rating + Check */}
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-800">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{driver.driverInfo?.averageRating || 4.8}</span>
                        </div>
                        <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                          {driver.phone || "Active"}
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
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No active drivers found.
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
            disabled={submitting || !selectedDriverId}
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
