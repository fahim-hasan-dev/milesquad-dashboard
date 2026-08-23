"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  Loader2,
} from "lucide-react";
import SuspendUserModal from "@/components/modals/SuspendUserModal";
import TrackDriverModal from "@/components/modals/TrackDriverModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { SERVER_URL } from "@/config/env-config";

interface DriverDetailData {
  id: string;
  name: string;
  email: string;
  contact: string;
  location: string;
  role: string;
  vehicle: string;
  verification: string;
  status: string;
  avatar: string;
  joinedDate: string;
  nidFront: string | null;
  nidBack: string | null;
  drivingLicense: string | null;
}

function getImageUrl(path?: string | null): string {
  if (!path) return "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SERVER_URL || "http://localhost:5003"}${cleanPath}`;
}

function RiderDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const targetId = queryId || routeId;

  const [rider, setRider] = useState<DriverDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const fetchRiderDetails = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await myFetch(`/user/${targetId}`);
      if (res.success && res.data) {
        const d = res.data;
        setRider({
          id: d._id,
          name: d.fullName || d.name || "N/A",
          email: d.email || "N/A",
          contact: d.phone || "N/A",
          location: d.location || d.address || "N/A",
          role: "Driver",
          vehicle: d.driverInfo?.vehicleType || "Motorcycle / Van",
          verification: (d.driverInfo?.profileVerification || "pending").toLowerCase(),
          status:
            d.status === "ACTIVE"
              ? "Active"
              : d.status === "RESTRICTED" || d.status === "BLOCKED"
              ? "Suspended"
              : "Inactive",
          avatar:
            d.image ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
          joinedDate: d.createdAt
            ? new Date(d.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A",
          nidFront: d.driverInfo?.nidFront || null,
          nidBack: d.driverInfo?.nidBack || null,
          drivingLicense: d.driverInfo?.drivingLicense || null,
        });
      } else {
        toast.error(res.message || "Failed to load driver details");
      }
    } catch (err) {
      console.error("Error loading driver detail:", err);
      toast.error("Network error while loading driver details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderDetails();
  }, [targetId]);

  const handleApproveDriver = async () => {
    if (!targetId) return;
    toast.loading("Approving driver verification...", { id: "approve-driver" });
    try {
      const res = await myFetch(`/user/driver-verification/${targetId}`, {
        method: "PATCH",
        body: { status: "approved" },
      });
      if (res.success) {
        toast.success("Driver verification approved successfully!", {
          id: "approve-driver",
        });
        fetchRiderDetails();
      } else {
        toast.error(res.message || res.error || "Failed to approve driver", {
          id: "approve-driver",
        });
      }
    } catch {
      toast.error("Error approving driver", { id: "approve-driver" });
    }
  };

  const handleRejectDriver = async () => {
    if (!targetId) return;
    const reason = window.prompt(
      "Enter reason for rejecting driver profile:",
      "Invalid or incomplete document scans"
    );
    if (reason === null) return;

    toast.loading("Rejecting driver verification...", { id: "reject-driver" });
    try {
      const res = await myFetch(`/user/driver-verification/${targetId}`, {
        method: "PATCH",
        body: {
          status: "rejected",
          rejectReason: reason.trim() || "Invalid or incomplete document scans",
        },
      });
      if (res.success) {
        toast.success("Driver verification rejected successfully!", { id: "reject-driver" });
        fetchRiderDetails();
      } else {
        toast.error(res.message || res.error || "Failed to reject driver", {
          id: "reject-driver",
        });
      }
    } catch {
      toast.error("Error rejecting driver", { id: "reject-driver" });
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
        <span className="text-sm font-medium">Loading rider details...</span>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium space-y-4">
        <p>Driver details not found.</p>
        <Link
          href="/riders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#10B981] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Riders</span>
        </Link>
      </div>
    );
  }

  const isPending = rider.verification !== "approved";

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

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          {isPending ? (
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
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
            >
              Track User
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Profile Summary & Personal Info */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Card: Summary Card */}
        <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          {/* Avatar Picture */}
          <div className="relative mb-3">
            <Image
              src={rider.avatar}
              alt={rider.name}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
            />
          </div>

          {/* User Name & ID */}
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
            {rider.name}
          </h2>
          <span className="text-xs font-medium text-slate-400 mt-0.5 mb-3 block">
            #{rider.id}
          </span>

          {/* Status & Driver Badge */}
          <div className="flex items-center gap-2 mb-2">
            {renderStatusBadge(rider.verification === "APPROVED" ? "Active" : "Pending")}
            <span className="inline-block bg-[#FFF7ED] text-[#EA580C] text-xs font-bold px-3 py-1 rounded-full border border-amber-200/50">
              {rider.vehicle}
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
                  {rider.role}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">
                  {isPending ? "Date Applied" : "Joined"}
                </span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {rider.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Personal Information */}
        <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
          <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
            Personal Information & Vehicle Specs
          </h3>

          <div className="flex items-center gap-4">
            <Image
              src={rider.avatar}
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

          <div className="w-full border-t border-slate-100 my-6" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Full Name</span>
                <span className="font-bold text-[#18181B]">{rider.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Email</span>
                <span className="font-bold text-[#18181B]">{rider.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
                <span className="font-bold text-[#18181B]">{rider.contact}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bike className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Vehicle Type</span>
                <span className="font-bold text-[#18181B]">{rider.vehicle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Document Scans Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* National ID Card */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 px-1">National ID Card</h4>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
            <div className="relative flex-1 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src={getImageUrl(rider.nidFront)}
                alt="ID Card Front"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src={getImageUrl(rider.nidBack)}
                alt="ID Card Back"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Driving License */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 px-1">Driving License</h4>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src={getImageUrl(rider.drivingLicense)}
                alt="Driving License"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track Driver Live Google Map Modal */}
      <TrackDriverModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        driverName={rider.name}
        driverAvatar={rider.avatar}
        vehicle={rider.vehicle}
        contact={rider.contact}
        locationName={rider.location}
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
