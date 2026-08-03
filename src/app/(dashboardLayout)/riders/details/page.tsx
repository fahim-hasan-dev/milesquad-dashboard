"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Calendar,
  Clock,
  User,
  Mail,
  Bike,
  Phone,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Star,
  PackageCheck,
  Check,
  X,
} from "lucide-react";
import SuspendUserModal from "@/components/modals/SuspendUserModal";
import TrackDriverModal from "@/components/modals/TrackDriverModal";
import toast from "react-hot-toast";
import {
  masterRidersList,
  newRiderRequestsList,
  RiderRecord,
} from "@/demoData/ridersManagementData";

function RiderDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const rawId = queryId || routeId || "RDR-00101";
  const riderId = rawId.toUpperCase();

  // Find rider from active list or requests list
  const matchedActive = masterRidersList.find(
    (r) => r.id.toUpperCase() === riderId
  );
  const matchedRequest = newRiderRequestsList.find(
    (r) => r.id.toUpperCase() === riderId
  );

  const isNewRequest = Boolean(matchedRequest) || riderId.startsWith("REQ");

  const fallbackRider: RiderRecord = {
    id: riderId,
    name: matchedRequest ? matchedRequest.name : "Sumon Mia",
    location: "Downtown District",
    role: "Driver",
    vehicle: matchedRequest ? matchedRequest.vehicle : "Truck",
    contact: "+1 654 656 5656",
    email: matchedRequest ? matchedRequest.email : "sumon.mia@milesquad.com",
    status: matchedRequest ? "Pending" : "Active",
    joinedDate: matchedRequest ? matchedRequest.dateApplied : "Jan 15, 2024",
    lastActive: "10 mins ago",
    rating: 4.8,
    completedDeliveries: 142,
    avatar: matchedRequest
      ? matchedRequest.avatar
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
  };

  const initialRider: RiderRecord = matchedActive || fallbackRider;
  const [riderStatus, setRiderStatus] = useState<string>(initialRider.status);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const handleConfirmSuspend = () => {
    setRiderStatus("Suspended");
    setIsSuspendModalOpen(false);
    toast.success(`Rider ${initialRider.name} account suspended`);
  };

  const handleActivate = () => {
    setRiderStatus("Active");
    toast.success(`Rider ${initialRider.name} account activated`);
  };

  const handleApproveDriver = () => {
    setRiderStatus("Active");
    toast.success(`Driver ${initialRider.name} registration approved!`);
  };

  const handleRejectDriver = () => {
    setRiderStatus("Inactive");
    toast.success(`Driver ${initialRider.name} registration rejected`);
  };

  const handleTrackUser = () => {
    setIsTrackModalOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3.5 py-1 rounded-full border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active</span>
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3.5 py-1 rounded-full border border-amber-200/60">
            <XCircle className="h-3.5 w-3.5" />
            <span>Suspended</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3.5 py-1 rounded-full border border-blue-200/60">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending</span>
          </span>
        );
      case "Inactive":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3.5 py-1 rounded-full border border-slate-200/60">
            <PauseCircle className="h-3.5 w-3.5" />
            <span>Inactive</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/riders"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Riders</span>
        </Link>
      </div>

      {/* Page Title & Top Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            View Rider Details
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Complete information about this rider account and vehicle specs.
          </p>
        </div>

        {/* Top Right Actions: Different for New Requests vs Active Riders */}
        <div className="flex items-center gap-3">
          {isNewRequest ? (
            <>
              <button
                onClick={handleApproveDriver}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Approve Driver</span>
              </button>
              <button
                onClick={handleRejectDriver}
                className="border border-red-200 text-red-500 hover:bg-red-50 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                <span>Reject Driver</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleTrackUser}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
              >
                Track User
              </button>
              {riderStatus === "Active" ? (
                <button
                  onClick={() => setIsSuspendModalOpen(true)}
                  className="border border-red-200/90 text-red-500 hover:bg-red-50/70 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none"
                >
                  Suspend User
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  className="border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none"
                >
                  Activate User
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Row 1: Profile Summary & Personal Info */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Card: Summary Card (Fixed ~360px on desktop) */}
        <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          {/* Avatar Picture */}
          <div className="relative mb-3">
            <Image
              src={initialRider.avatar}
              alt={initialRider.name}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
            />
          </div>

          {/* User Name & ID */}
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
            {initialRider.name}
          </h2>
          <span className="text-xs font-medium text-slate-400 mt-0.5 mb-3 block">
            #{initialRider.id}
          </span>

          {/* Status & Driver Badge */}
          <div className="flex items-center gap-2 mb-2">
            {renderStatusBadge(riderStatus)}
            <span className="inline-block bg-[#FFF7ED] text-[#EA580C] text-xs font-bold px-3 py-1 rounded-full border border-amber-200/50">
              {initialRider.vehicle}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-5" />

          {/* Metadata Rows */}
          <div className="w-full space-y-4 text-left">
            <div className="flex items-start gap-3.5">
              <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Role</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {initialRider.role}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">
                  {isNewRequest ? "Date Applied" : "Joined"}
                </span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {initialRider.joinedDate}
                </span>
              </div>
            </div>

            {!isNewRequest && (
              <div className="flex items-start gap-3.5">
                <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs font-semibold text-slate-400">Last Active</span>
                  <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                    {initialRider.lastActive}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Personal Information */}
        <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
          {/* Section Title */}
          <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
            Personal Information & Vehicle Specs
          </h3>

          {/* Profile Picture Row */}
          <div className="flex items-center gap-4">
            <Image
              src={initialRider.avatar}
              alt="Profile Picture"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
            />
            <div>
              <h4 className="text-sm md:text-base font-bold text-[#18181B]">
                Profile Picture
              </h4>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Driver&apos;s photo application
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-6" />

          {/* Personal Info Rows */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Full Name</span>
                <span className="font-bold text-[#18181B]">{initialRider.name}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Email</span>
                <span className="font-bold text-[#18181B]">{initialRider.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
                <span className="font-bold text-[#18181B]">{initialRider.contact}</span>
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="flex items-center gap-3">
              <Bike className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Vehicle Type</span>
                <span className="font-bold text-[#18181B]">{initialRider.vehicle}</span>
              </div>
            </div>

            {!isNewRequest && (
              <>
                {/* Performance Rating */}
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex items-center gap-6 text-sm">
                    <span className="w-32 md:w-44 font-medium text-slate-500">Rating</span>
                    <span className="font-bold text-[#18181B]">{initialRider.rating} / 5.0</span>
                  </div>
                </div>

                {/* Total Deliveries */}
                <div className="flex items-center gap-3">
                  <PackageCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="flex items-center gap-6 text-sm">
                    <span className="w-32 md:w-44 font-medium text-slate-500">Completed Orders</span>
                    <span className="font-bold text-[#10B981]">{initialRider.completedDeliveries} Deliveries</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Document Scans Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* National ID Card (2 images: Front & Back) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 px-1">National ID Card</h4>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
            <div className="relative flex-1 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400"
                alt="ID Card Front"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400"
                alt="ID Card Back"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Driving License / ID Card (1 image) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 px-1">Driving License</h4>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400"
                alt="Driving License"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Confirmation Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
      />

      {/* Track Driver Live Google Map Modal */}
      <TrackDriverModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        driverName={initialRider.name}
        driverAvatar={initialRider.avatar}
        vehicle={initialRider.vehicle}
        contact={initialRider.contact}
        locationName={initialRider.location}
      />
    </div>
  );
}

export default function RiderDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 font-medium">
          Loading rider details...
        </div>
      }
    >
      <RiderDetailsContent />
    </Suspense>
  );
}
