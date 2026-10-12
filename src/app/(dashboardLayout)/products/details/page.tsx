"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Bike,
  Building2,
  Loader2,
  Download,
} from "lucide-react";
import AssignDriverModal from "@/components/modals/AssignDriverModal";
import AssignPartnerModal from "@/components/modals/AssignPartnerModal";
import TrackDriverModal from "@/components/modals/TrackDriverModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import { getTrackingSocket } from "@/utils/socket";
import { BASE_URL } from "@/config/env-config";
import { ParcelDetail } from "@/components/page/deliveries/details/types";
import DeliveryRouteCard from "@/components/page/deliveries/details/DeliveryRouteCard";
import DeliveryStatsGrid from "@/components/page/deliveries/details/DeliveryStatsGrid";
import DeliveryParticipantsCard from "@/components/page/deliveries/details/DeliveryParticipantsCard";
import DeliveryPriceBreakdown from "@/components/page/deliveries/details/DeliveryPriceBreakdown";

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const targetId = queryId || routeId;

  const fromUrl = searchParams.get("from");
  const backLinkHref = fromUrl || "/products";
  const backLinkText =
    fromUrl && fromUrl.includes("/users/details")
      ? "Back to User Details"
      : "Back to Deliveries";

  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignPartnerModalOpen, setIsAssignPartnerModalOpen] = useState(false);
  const [isTrackDriverModalOpen, setIsTrackDriverModalOpen] = useState(false);
  const [liveDriverCoords, setLiveDriverCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const fetchParcelDetails = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await myFetch(`/parcel/${targetId}`);
      if (res.success && res.data) {
        setParcel(res.data);
      } else {
        toast.error(res.message || "Delivery details not found");
      }
    } catch (err) {
      console.error("Error fetching parcel detail:", err);
      toast.error("Failed to load delivery details");
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchParcelDetails();
  }, [fetchParcelDetails]);

  useEffect(() => {
    if (!targetId || !parcel) return;

    const normalizedStatus = parcel.status?.toUpperCase() || "";
    const isTerminated = [
      "DELIVERED",
      "CANCELLED",
      "COMPLETED",
      "FAILED",
      "RETURNED",
    ].includes(normalizedStatus);

    if (isTerminated) {
      setLiveDriverCoords(null);
      return;
    }

    const socket = getTrackingSocket();
    socket.emit("user:track-parcel", { parcelId: targetId });

    const handleParcelUpdate = (rawPayload: any) => {
      const data =
        typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
      if (data && data.lat && data.lng) {
        setLiveDriverCoords({ lat: Number(data.lat), lng: Number(data.lng) });
      }
    };

    socket.on("parcel:tracking-update", handleParcelUpdate);

    return () => {
      socket.emit("user:untrack-parcel", { parcelId: targetId });
      socket.off("parcel:tracking-update", handleParcelUpdate);
    };
  }, [targetId, parcel]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
        <span className="text-xs font-semibold">Loading delivery details...</span>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          href={backLinkHref}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLinkText}</span>
        </Link>
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium">
          Delivery request not found.
        </div>
      </div>
    );
  }

  const normalizedStatus = (parcel.status || "").trim().toUpperCase();
  const isPending =
    normalizedStatus === "PENDING" ||
    normalizedStatus === "CREATED" ||
    normalizedStatus === "CONFIRMED" ||
    (!parcel.driver &&
      !["DELIVERED", "CANCELLED", "COMPLETED"].includes(normalizedStatus));
  const displayId = parcel.parcelId || `#${parcel._id.slice(-8).toUpperCase()}`;

  const pickupAddress =
    parcel.pickupLocation?.address ||
    parcel.pickupLocation?.name ||
    "Pickup Location";
  const dropAddress =
    parcel.dropLocation?.address ||
    parcel.dropLocation?.name ||
    "Dropoff Location";

  const customerName = parcel.sender?.fullName || "Guest Customer";
  const customerEmail = parcel.sender?.email || "N/A";
  const customerPhone = parcel.sender?.phone || parcel.receiverPhone || "N/A";
  const customerAvatar = getImageUrl(parcel.sender?.image);

  const totalFee =
    parcel.deliveryFee ??
    parcel.totalDeliveryFee ??
    parcel.totalToPay ??
    parcel.pricingDetails?.admin?.deliveryFee ??
    parcel.pricingDetails?.customer?.deliveryFee ??
    0;
  const createdAtDate = parcel.createdAt
    ? new Date(parcel.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const createdAtTime = parcel.createdAt
    ? new Date(parcel.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleDownloadInvoice = async () => {
    if (!parcel?._id) return;
    toast.loading("Generating invoice PDF...", { id: "download-invoice" });
    try {
      const token =
        (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
        (typeof document !== "undefined" &&
          document.cookie.match(/(?:^|; )accessToken=([^;]*)/)?.[1]) ||
        "";
      const response = await fetch(`${BASE_URL}/parcel/invoice/${parcel._id}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.message || errData?.error || "Failed to download invoice"
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${displayId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!", {
        id: "download-invoice",
      });
    } catch (err: any) {
      console.error("Error downloading invoice:", err);
      toast.error(err?.message || "Failed to download invoice", {
        id: "download-invoice",
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href={backLinkHref}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLinkText}</span>
        </Link>
      </div>

      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            {isPending ? "Pending Delivery Request" : "Delivery Details"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500 font-normal">Order ID:</span>
            <span className="text-sm font-bold text-[#10B981]">{displayId}</span>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="border border-[#10B981] text-[#10B981] hover:bg-[#E6F4EA] font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2 bg-white"
          >
            <Download className="h-4 w-4" />
            <span>Download Invoice</span>
          </button>

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
              <span>{(parcel.status || "").replace(/_/g, " ").toUpperCase()}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Route & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <DeliveryRouteCard
            parcel={parcel}
            pickupAddress={pickupAddress}
            dropAddress={dropAddress}
            liveDriverCoords={liveDriverCoords}
          />
          <DeliveryStatsGrid
            parcel={parcel}
            createdAtDate={createdAtDate}
            createdAtTime={createdAtTime}
          />
        </div>

        {/* Right 1 Column: Participants & Price Breakdown */}
        <div className="space-y-6">
          <DeliveryParticipantsCard
            parcel={parcel}
            customerName={customerName}
            customerPhone={customerPhone}
            customerEmail={customerEmail}
            customerAvatar={customerAvatar}
            pickupAddress={pickupAddress}
          />
          <DeliveryPriceBreakdown parcel={parcel} totalFee={totalFee} />
        </div>
      </div>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={isAssignDriverModalOpen}
        onClose={() => setIsAssignDriverModalOpen(false)}
        parcelId={parcel._id}
        customerName={customerName}
        onConfirmAssignment={fetchParcelDetails}
      />

      {/* Assign Partner Modal */}
      <AssignPartnerModal
        isOpen={isAssignPartnerModalOpen}
        onClose={() => setIsAssignPartnerModalOpen(false)}
        parcelId={parcel._id}
        customerName={customerName}
        onConfirmPartnerAssignment={fetchParcelDetails}
      />

      {/* Live Track Driver Modal */}
      {parcel.driver && isTrackDriverModalOpen && liveDriverCoords && (
        <TrackDriverModal
          isOpen={isTrackDriverModalOpen}
          onClose={() => setIsTrackDriverModalOpen(false)}
          driverId={parcel.driver._id}
          parcelId={parcel._id}
          driverName={parcel.driver.fullName}
          driverAvatar={getImageUrl(parcel.driver.image)}
          vehicle={parcel.driver.driverInfo?.vehicleType || parcel.vehicleType}
          initialLat={liveDriverCoords.lat}
          initialLng={liveDriverCoords.lng}
        />
      )}
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
