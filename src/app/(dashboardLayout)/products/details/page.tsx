"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Ruler,
  Clock,
  Star,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Bike,
  Building2,
} from "lucide-react";
import AssignDriverModal from "@/components/modals/AssignDriverModal";
import AssignPartnerModal from "@/components/modals/AssignPartnerModal";
import toast from "react-hot-toast";
import {
  masterDeliveriesList,
  DeliveryRecord,
} from "@/demoData/deliveriesManagementData";

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const rawId = queryId || routeId || "#ORD-29481";
  const formattedId = rawId.startsWith("#") ? rawId : `#${rawId}`;

  // Find delivery record dynamically
  const matchedOrder = masterDeliveriesList.find(
    (d) => d.id.toUpperCase() === formattedId.toUpperCase()
  );

  const initialOrder: DeliveryRecord = matchedOrder || masterDeliveriesList[0];
  const [orderStatus, setOrderStatus] = useState<string>(initialOrder.status);
  const [assignedDriverName, setAssignedDriverName] = useState<string | undefined>(
    initialOrder.driverName
  );
  const [assignedPartnerName, setAssignedPartnerName] = useState<string | undefined>(
    undefined
  );
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignPartnerModalOpen, setIsAssignPartnerModalOpen] = useState(false);

  const isPending = orderStatus === "PENDING";

  const handleConfirmDriverAssignment = (driverName: string) => {
    setOrderStatus("ASSIGNED");
    setAssignedDriverName(driverName);
    setAssignedPartnerName(undefined);
    toast.success(`Driver ${driverName} assigned to ${initialOrder.id}!`);
  };

  const handleConfirmPartnerAssignment = (partnerName: string) => {
    setOrderStatus("ASSIGNED");
    setAssignedPartnerName(partnerName);
    setAssignedDriverName(undefined);
    toast.success(`Partner ${partnerName} assigned to ${initialOrder.id}!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Deliveries</span>
        </Link>
      </div>

      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            {isPending ? "Pending Order Request" : "Delivery Details"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500 font-normal">Order ID:</span>
            <span className="text-sm font-bold text-[#10B981]">{initialOrder.id}</span>
          </div>
        </div>

        {/* Top Right Action Buttons (Conditional based on Status) */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <>
              <button
                onClick={() => setIsAssignDriverModalOpen(true)}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2"
              >
                <Bike className="h-4 w-4" />
                <span>Assign Driver</span>
              </button>

              <button
                onClick={() => setIsAssignPartnerModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                <span>Assign Partner</span>
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>{orderStatus}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Route & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Delivery Route Card */}
          <div className="bg-[#FFFDF5] rounded-3xl p-6 md:p-8 border border-amber-100/60 shadow-sm space-y-6">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              DELIVERY ROUTE
            </span>

            {/* Route Timeline */}
            <div className="space-y-6 relative pl-2">
              {/* Vertical dotted connecting line */}
              <div className="absolute left-[13px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-300" />

              {/* Pickup */}
              <div className="flex items-start gap-4 relative z-10">
                <span className="size-3 rounded-full bg-[#10B981] mt-1 shrink-0 ring-4 ring-[#E6F4EA]" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pickup Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                    {initialOrder.fromLocation}
                  </p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-4 relative z-10">
                <span className="size-3 rounded-full bg-slate-700 mt-1 shrink-0 ring-4 ring-slate-100" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dropoff Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                    {initialOrder.toLocation}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-normal">
                    {initialOrder.userAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Preview Grid */}
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-inner flex items-center justify-center">
              <iframe
                title="Delivery Route Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  initialOrder.fromLocation + ", Dhaka"
                )}&t=m&z=13&ie=UTF8&iwloc=&output=embed`}
              />

              {/* Map Pins Simulation Badge Overlay */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200/80">
                <MapPin className="h-4 w-4 text-[#10B981]" />
                <span className="text-xs font-bold text-slate-800">
                  {initialOrder.fromLocation} ➔ {initialOrder.toLocation}
                </span>
              </div>
            </div>
          </div>

          {/* 5 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Date & Time */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  DATE & TIME
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{initialOrder.date}</h4>
                <span className="text-xs text-slate-400 font-medium">{initialOrder.time}</span>
              </div>
            </div>

            {/* Parcel Type */}
            <div className="bg-[#E6F4EA]/30 rounded-2xl p-5 border border-emerald-100/60 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  PARCEL TYPE
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{initialOrder.parcelType}</h4>
                <span className="text-xs text-slate-400 font-medium">Standard Courier</span>
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <Bike className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  VEHICLE TYPE
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  Motorcycle
                </h4>
              </div>
            </div>

            {/* Distance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <Ruler className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  DISTANCE
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{initialOrder.distance}</h4>
                <span className="text-xs text-slate-400 font-medium">City Route</span>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  EST. DURATION
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{initialOrder.duration}</h4>
                <span className="text-xs text-slate-400 font-medium">On schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Driver Info / Partner Info, Customer Info, Price */}
        <div className="space-y-6">
          {/* Assigned Driver Card */}
          {assignedDriverName && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ASSIGNED DRIVER
              </span>

              <div className="flex items-center gap-3.5">
                <Image
                  src={
                    initialOrder.driverAvatar ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"
                  }
                  alt={assignedDriverName}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{assignedDriverName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold mt-0.5">
                    <Star className="h-3.5 w-3.5 fill-[#10B981] text-[#10B981]" />
                    <span>{initialOrder.driverRating || 4.8} Rating</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {initialOrder.driverVehicle || "Truck"} Delivery
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Partner Card */}
          {assignedPartnerName && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ASSIGNED PARTNER
              </span>

              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-2xl bg-[#10B981] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                  {assignedPartnerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{assignedPartnerName}</h4>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#10B981] text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                    <Building2 className="h-3 w-3" />
                    <span>Business Partner</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Customer / Sender Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CUSTOMER / SENDER INFO
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src={initialOrder.userAvatar}
                  alt={initialOrder.userName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{initialOrder.userName}</h4>
                  <span className="text-xs text-slate-400 font-normal">{initialOrder.userEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{initialOrder.userPhone}</span>
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed pt-1">
                {initialOrder.userAddress}
              </p>
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PRICE BREAKDOWN
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Base fare</span>
                <span>{initialOrder.price}</span>
              </div>

              <div className="w-full border-t border-slate-100 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Total Amount</span>
                <span className="text-lg font-black text-[#10B981]">{initialOrder.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={isAssignDriverModalOpen}
        onClose={() => setIsAssignDriverModalOpen(false)}
        orderId={initialOrder.id}
        customerName={initialOrder.userName}
        onConfirmAssignment={handleConfirmDriverAssignment}
      />

      {/* Assign Partner Modal */}
      <AssignPartnerModal
        isOpen={isAssignPartnerModalOpen}
        onClose={() => setIsAssignPartnerModalOpen(false)}
        orderId={initialOrder.id}
        customerName={initialOrder.userName}
        onConfirmPartnerAssignment={handleConfirmPartnerAssignment}
      />
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 font-medium">
          Loading delivery details...
        </div>
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}
