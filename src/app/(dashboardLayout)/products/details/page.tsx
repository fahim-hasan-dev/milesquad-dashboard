/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Ruler,
  Clock,
  Star,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
import AssignDriverModal from "@/components/modals/AssignDriverModal";
import toast from "react-hot-toast";

export default function OrderDetailsPage() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isPendingOrder, setIsPendingOrder] = useState(false);

  const handleConfirmAssignment = (driverName: string) => {
    setIsPendingOrder(false);
    toast.success(`Driver ${driverName} assigned to order!`);
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

      {/* Page Title & Order ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            {isPendingOrder ? "Pending Order" : "History Details"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500 font-normal">Order ID:</span>
            <span className="text-sm font-bold text-[#10B981]">#1432566411</span>
          </div>
        </div>

        {/* Toggle Mode Button (for previewing Pending vs Completed) */}
        <button
          onClick={() => setIsPendingOrder(!isPendingOrder)}
          className="text-xs font-semibold text-slate-500 underline hover:text-slate-900 self-start sm:self-auto"
        >
          Switch View Mode: {isPendingOrder ? "Pending Mode" : "History Mode"}
        </button>
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
                  <h4 className="text-sm font-bold text-slate-900">Pickup</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    123 Main St, Downtown
                  </p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-4 relative z-10">
                <span className="size-3 rounded-full bg-slate-700 mt-1 shrink-0 ring-4 ring-slate-100" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dropoff</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    456 Oak Ave, Uptown
                  </p>
                </div>
              </div>
            </div>

            {/* Map Preview Grid */}
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-inner flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#b0b0b0_1px,transparent_1px),linear-gradient(to_bottom,#b0b0b0_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="absolute inset-0 bg-[#E0E0E0]/60" />

              {/* Map Pins Simulation */}
              <div className="relative z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-slate-200/80">
                <MapPin className="h-4 w-4 text-[#10B981]" />
                <span className="text-xs font-bold text-slate-800">
                  Live City Route View
                </span>
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Date & Time */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  DATE & TIME
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Apr 4, 2026</h4>
                <span className="text-xs text-slate-400 font-medium">2:30 PM</span>
              </div>
            </div>

            {/* Parcel Type */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  PARCEL TYPE
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Small</h4>
                <span className="text-xs text-slate-400 font-medium">Standard Courier</span>
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
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">4.2 km</h4>
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
                  DURATION
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">18 min</h4>
                <span className="text-xs text-slate-400 font-medium">Ahead of schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Driver Info, Proofs, Sender Info, Price */}
        <div className="space-y-6">
          {/* Driver Information Card (Only in History mode) */}
          {!isPendingOrder && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                DRIVER INFORMATION
              </span>

              <div className="flex items-center gap-3.5">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"
                  alt="John Smith"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">John Smith</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold mt-0.5">
                    <Star className="h-3.5 w-3.5 fill-[#10B981] text-[#10B981]" />
                    <span>4.8 Rating</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Motorcycle Delivery
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Proof from Sender */}
          {!isPendingOrder && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Proof from Sender</h4>
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500"
                  alt="Proof from Sender"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Delivery Proof */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Delivery Proof</h4>
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500"
                alt="Delivery Proof"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Sender Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                SENDER INFO
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Shakir Ahmed</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>user@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>+123456789</span>
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed pt-1">
                Chandgaon R/A, b-block, house no-313, road no-03, flat no-D7
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
                <span>$4.00</span>
              </div>

              <div className="w-full border-t border-slate-100 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-lg font-black text-[#10B981]">$4.00</span>
              </div>

              {/* Rating Banner */}
              {!isPendingOrder && (
                <div className="bg-[#E6F4EA] rounded-2xl p-4 flex items-start gap-3 mt-3">
                  <div className="flex items-center text-[#10B981] shrink-0 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#10B981] text-[#10B981]" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#10B981] leading-snug">
                    You rated this delivery 5 out of 5 stars
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assign Driver Button (In Pending Mode) */}
          {isPendingOrder && (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Assign Driver</span>
            </button>
          )}
        </div>
      </div>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        orderId="#ORD-29483"
        customerName="Marcus Wei"
        onConfirmAssignment={handleConfirmAssignment}
      />
    </div>
  );
}
