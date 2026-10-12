import React from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  PauseCircle,
  Bike,
} from "lucide-react";

export type StatusType = string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  uppercase?: boolean;
}

export default function StatusBadge({
  status,
  className = "",
  uppercase = false,
}: StatusBadgeProps) {
  const raw = (status || "").toLowerCase().trim();
  const rawUpper = (status || "").toUpperCase().trim();

  // Success / Completed / Active / Approved / Delivered / Resolved
  if (
    [
      "active",
      "completed",
      "approved",
      "delivered",
      "resolved",
      "success",
      "paid",
    ].includes(raw)
  ) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60 ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>{uppercase ? rawUpper : raw.charAt(0).toUpperCase() + raw.slice(1)}</span>
      </span>
    );
  }

  // Pending / Created / Processing / In Progress / Open
  if (
    [
      "pending",
      "created",
      "processing",
      "in_progress",
      "in-progress",
      "in progress",
      "open",
      "resubmitted",
    ].includes(raw)
  ) {
    const isBlue = ["pending", "created", "open"].includes(raw);
    const bgClass = isBlue
      ? "bg-[#E0F2FE] text-[#0284C7] border-sky-200/60"
      : "bg-[#FEF3C7] text-[#D97706] border-amber-200/60";
    const label = uppercase
      ? rawUpper.replace(/_/g, " ")
      : raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return (
      <span
        className={`inline-flex items-center gap-1.5 ${bgClass} text-xs font-semibold px-3 py-1 rounded-full border ${className}`}
      >
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </span>
    );
  }

  // Driver / Delivery progress statuses
  if (
    [
      "rider_assigned",
      "partner_assigned",
      "on_the_way_to_pickup",
      "picked_up",
      "on_the_way_to_delivery",
      "assigned",
    ].includes(raw)
  ) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200/60 ${className}`}
      >
        <Bike className="h-3 w-3 shrink-0" />
        <span>{rawUpper.replace(/_/g, " ")}</span>
      </span>
    );
  }

  // Suspended / Blocked / Restricted
  if (["suspended", "blocked", "restricted"].includes(raw)) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/60 ${className}`}
      >
        <XCircle className="h-3.5 w-3.5 shrink-0" />
        <span>{uppercase ? rawUpper : raw.charAt(0).toUpperCase() + raw.slice(1)}</span>
      </span>
    );
  }

  // Cancelled / Failed / Rejected
  if (["cancelled", "canceled", "failed", "rejected"].includes(raw)) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-200/60 ${className}`}
      >
        <XCircle className="h-3.5 w-3.5 shrink-0" />
        <span>{uppercase ? rawUpper : raw.charAt(0).toUpperCase() + raw.slice(1)}</span>
      </span>
    );
  }

  // Default Inactive / Fallback
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/60 ${className}`}
    >
      <PauseCircle className="h-3.5 w-3.5 shrink-0" />
      <span>
        {uppercase
          ? rawUpper || "INACTIVE"
          : (raw || "Inactive").charAt(0).toUpperCase() + (raw || "inactive").slice(1)}
      </span>
    </span>
  );
}
