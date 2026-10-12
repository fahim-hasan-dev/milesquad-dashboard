"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
} from "lucide-react";
import TrackDriverModal from "@/components/modals/TrackDriverModal";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getTrackingSocket } from "@/utils/socket";
import { getImageUrl } from "@/utils/imageUrl";
import { DriverDetailData } from "@/components/page/riders/details/types";
import RiderSummaryCard from "@/components/page/riders/details/RiderSummaryCard";
import RiderPersonalInfoCard from "@/components/page/riders/details/RiderPersonalInfoCard";
import RiderVerificationDocs from "@/components/page/riders/details/RiderVerificationDocs";
import DocumentPreviewModal from "@/components/page/riders/details/DocumentPreviewModal";

function RiderDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const targetId = queryId || routeId;

  const [rider, setRider] = useState<DriverDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isCheckingLiveLocation, setIsCheckingLiveLocation] = useState(false);
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleTrackDriverClick = () => {
    if (!rider?.id) return;
    setIsCheckingLiveLocation(true);

    const socket = getTrackingSocket();
    let isHandled = false;

    const timeoutId = setTimeout(() => {
      if (!isHandled) {
        isHandled = true;
        setIsCheckingLiveLocation(false);
        socket.off("single-driver:location-updated", handleLocationReceived);
        socket.off("single-driver:offline", handleDriverOffline);
        toast.error("Driver is currently offline. Live location unavailable.");
      }
    }, 3000);

    const handleLocationReceived = (rawPayload: any) => {
      if (isHandled) return;
      const data = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
      if (data && data.lat && data.lng) {
        isHandled = true;
        clearTimeout(timeoutId);
        setIsCheckingLiveLocation(false);
        socket.off("single-driver:location-updated", handleLocationReceived);
        socket.off("single-driver:offline", handleDriverOffline);
        setLiveCoords({ lat: Number(data.lat), lng: Number(data.lng) });
        setIsTrackModalOpen(true);
      }
    };

    const handleDriverOffline = () => {
      if (isHandled) return;
      isHandled = true;
      clearTimeout(timeoutId);
      setIsCheckingLiveLocation(false);
      socket.off("single-driver:location-updated", handleLocationReceived);
      socket.off("single-driver:offline", handleDriverOffline);
      toast.error("Driver is currently offline. Live location unavailable.");
    };

    socket.on("single-driver:location-updated", handleLocationReceived);
    socket.on("single-driver:offline", handleDriverOffline);
    socket.emit("admin:track-single-driver", { driverId: rider.id });
  };

  const fetchRiderDetails = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await myFetch(`/user/${targetId}`);
      if (res.success && res.data) {
        const d = res.data;
        const rawDocs = d.driverInfo?.vehicleDocuments;
        const vehicleDocsList: string[] = Array.isArray(rawDocs)
          ? rawDocs.filter(Boolean)
          : typeof rawDocs === "string" && rawDocs.trim()
          ? [rawDocs]
          : [];

        setRider({
          id: d._id,
          name: d.fullName || d.name || "N/A",
          email: d.email || "N/A",
          contact: d.phone || "N/A",
          location:
            d.address ||
            (Array.isArray(d.location) ? d.location.join(", ") : d.location) ||
            "N/A",
          role: "Driver",
          vehicle: d.driverInfo?.vehicleType || "Motorcycle / Van",
          verification: (d.driverInfo?.profileVerification || "pending").toLowerCase(),
          status:
            d.status === "ACTIVE"
              ? "Active"
              : d.status === "RESTRICTED" || d.status === "BLOCKED"
              ? "Suspended"
              : "Inactive",
          avatar: d.image ? getImageUrl(d.image) : "",
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
          criminalReport: d.driverInfo?.criminalReport || null,
          vehicleInsurance: d.driverInfo?.vehicleInsurance || null,
          vehicleDocuments: vehicleDocsList,
          rejectReason: d.driverInfo?.rejectReason || null,
          totalRating: d.driverInfo?.totalRating ?? 0,
          averageRating: d.driverInfo?.averageRating ?? 0,
          wallet: d.driverInfo?.wallet ?? 0,
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

  const handleConfirmRejectDriver = async (reason: string) => {
    if (!targetId) return;
    setIsRejecting(true);
    toast.loading("Rejecting driver verification...", { id: "reject-driver" });
    try {
      const res = await myFetch(`/user/driver-verification/${targetId}`, {
        method: "PATCH",
        body: {
          status: "rejected",
          rejectReason: reason,
        },
      });
      if (res.success) {
        toast.success("Driver verification rejected successfully!", { id: "reject-driver" });
        setIsRejectModalOpen(false);
        fetchRiderDetails();
      } else {
        toast.error(res.message || res.error || "Failed to reject driver", {
          id: "reject-driver",
        });
      }
    } catch {
      toast.error("Error rejecting driver", { id: "reject-driver" });
    } finally {
      setIsRejecting(false);
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
                onClick={() => setIsRejectModalOpen(true)}
                className="border border-red-200 text-red-500 hover:bg-red-50 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                <span>Reject Driver</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleTrackDriverClick}
              disabled={isCheckingLiveLocation}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {isCheckingLiveLocation && <Loader2 className="h-4 w-4 animate-spin text-white" />}
              <span>{isCheckingLiveLocation ? "Checking Live GPS..." : "Track User"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Profile Summary & Personal Info */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        <RiderSummaryCard rider={rider} isPending={isPending} />
        <RiderPersonalInfoCard rider={rider} />
      </div>

      {/* Row 2: Document Scans & Verification Documents */}
      <RiderVerificationDocs
        rider={rider}
        onPreview={(doc) => setPreviewDoc(doc)}
      />

      {/* Full-Screen Document Preview Modal */}
      <DocumentPreviewModal
        previewDoc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* Track Driver Live Google Map Modal */}
      {isTrackModalOpen && liveCoords && (
        <TrackDriverModal
          isOpen={isTrackModalOpen}
          onClose={() => setIsTrackModalOpen(false)}
          driverId={rider.id}
          driverName={rider.name}
          driverAvatar={rider.avatar}
          vehicle={rider.vehicle}
          contact={rider.contact}
          locationName={rider.location}
          initialLat={liveCoords.lat}
          initialLng={liveCoords.lng}
        />
      )}

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmRejectDriver}
        loading={isRejecting}
        driverName={rider.name}
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
