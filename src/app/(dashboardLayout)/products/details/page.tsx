"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
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
import { MAP_API_KEY, BASE_URL } from "@/config/env-config";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@/components/common/InteractiveMap"),
  { ssr: false }
);

interface ParcelDetail {
  _id: string;
  parcelId?: string;
  goodType?: string;
  status: string;
  totalDeliveryFee?: number;
  totalToPay?: number;
  vehicleType?: string;
  distance?: number;
  duration?: number;
  baseFee?: number;
  fuelCost?: number;
  timeCost?: number;
  serviceFee?: number;
  goodRisks?: number;
  overhead?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  isPaid?: boolean;
  driverPricing?: {
    baseFee?: number;
    timeCost?: number;
    fuelCost?: number;
    totalPrice?: number;
    additionalCost?: number;
    totalRun?: number;
  };
  customerPricing?: {
    totalOfRun?: number;
    serviceFee?: number;
    goodInsurance?: number;
    totalToPay?: number;
  };
  adminPricing?: {
    overhead?: number;
    milesquadInsurance?: number;
    marginMilesquad?: number;
  };
  pickupLocation?: {
    address?: string;
    name?: string;
    coordinates?: [number, number];
  };
  dropLocation?: {
    address?: string;
    name?: string;
    coordinates?: [number, number];
  };
  receiverPhone?: string;
  sender?: {
    _id?: string;
    userId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    image?: string;
  };
  driver?: {
    _id?: string;
    userId?: string;
    fullName?: string;
    phone?: string;
    image?: string;
    driverInfo?: {
      vehicleType?: string;
      averageRating?: number;
    };
  };
  partner?: {
    _id?: string;
    partnerId?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    rolePosition?: string;
  };
  createdAt?: string;
}

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const targetId = queryId || routeId;

  const fromUrl = searchParams.get("from");
  const backLinkHref = fromUrl || "/products";
  const backLinkText = fromUrl && fromUrl.includes("/users/details") ? "Back to User Details" : "Back to Deliveries";

  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignPartnerModalOpen, setIsAssignPartnerModalOpen] = useState(false);
  const [isTrackDriverModalOpen, setIsTrackDriverModalOpen] = useState(false);
  const [liveDriverCoords, setLiveDriverCoords] = useState<{ lat: number; lng: number } | null>(null);

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
    const isTerminated = ["DELIVERED", "CANCELLED", "COMPLETED", "FAILED", "RETURNED"].includes(normalizedStatus);

    if (isTerminated) {
      setLiveDriverCoords(null);
      return;
    }

    const socket = getTrackingSocket();
    socket.emit("user:track-parcel", { parcelId: targetId });

    const handleParcelUpdate = (rawPayload: any) => {
      const data = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
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

  const isPending = parcel.status === "created" || parcel.status === "pending";
  const displayId = parcel.parcelId || `#${parcel._id.slice(-8).toUpperCase()}`;

  const pickupAddress = parcel.pickupLocation?.address || parcel.pickupLocation?.name || "Pickup Location";
  const dropAddress = parcel.dropLocation?.address || parcel.dropLocation?.name || "Dropoff Location";

  const customerName = parcel.sender?.fullName || "Guest Customer";
  const customerEmail = parcel.sender?.email || "N/A";
  const customerPhone = parcel.sender?.phone || parcel.receiverPhone || "N/A";
  const customerAvatar = getImageUrl(parcel.sender?.image);

  const totalFee = parcel.totalDeliveryFee || parcel.totalToPay || 0;
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
        throw new Error(errData?.message || errData?.error || "Failed to download invoice");
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

      toast.success("Invoice downloaded successfully!", { id: "download-invoice" });
    } catch (err: any) {
      console.error("Error downloading invoice:", err);
      toast.error(err?.message || "Failed to download invoice", { id: "download-invoice" });
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

        {/* Top Right Action Buttons (Conditional based on Status) */}
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
                  <p className="text-xs text-slate-600 mt-0.5 font-semibold">{pickupAddress}</p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-4 relative z-10">
                <span className="size-3 rounded-full bg-slate-700 mt-1 shrink-0 ring-4 ring-slate-100" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dropoff Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-semibold">{dropAddress}</p>
                </div>
              </div>
            </div>

            {/* Map Preview Grid */}
            <div className="relative w-full h-[240px] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-inner">
              <InteractiveMap
                center={
                  liveDriverCoords
                    ? [liveDriverCoords.lat, liveDriverCoords.lng]
                    : [
                        parcel.pickupLocation?.coordinates?.[1] || 23.746187,
                        parcel.pickupLocation?.coordinates?.[0] || 90.374528,
                      ]
                }
                zoom={13}
                markers={[
                  {
                    lat: parcel.pickupLocation?.coordinates?.[1] || 23.746187,
                    lng: parcel.pickupLocation?.coordinates?.[0] || 90.374528,
                    title: "Pickup Location",
                    popupText: pickupAddress,
                    iconType: "pickup",
                  },
                  {
                    lat: parcel.dropLocation?.coordinates?.[1] || 23.750187,
                    lng: parcel.dropLocation?.coordinates?.[0] || 90.380528,
                    title: "Dropoff Location",
                    popupText: dropAddress,
                    iconType: "dropoff",
                  },
                  ...(liveDriverCoords &&
                  !["DELIVERED", "CANCELLED", "COMPLETED", "FAILED", "RETURNED"].includes(
                    parcel.status?.toUpperCase() || ""
                  )
                    ? [
                        {
                          lat: liveDriverCoords.lat,
                          lng: liveDriverCoords.lng,
                          title: parcel.driver?.fullName || "Live Driver",
                          popupText: "Live Location Ping",
                          iconType: "driver" as const,
                        },
                      ]
                    : []),
                ]}
              />

              {/* Status Badge Overlay */}
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                {parcel.status?.toUpperCase() === "DELIVERED" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 text-white shadow-md">
                    ✓ Parcel Delivered
                  </span>
                ) : parcel.status?.toUpperCase() === "CANCELLED" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-600 text-white shadow-md">
                    ✕ Delivery Cancelled
                  </span>
                ) : liveDriverCoords ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/95 text-emerald-600 shadow-md border border-slate-200/80">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Driver Location
                  </span>
                ) : null}
              </div>

              {/* Map Pins Simulation Badge Overlay */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 max-w-[90%] pointer-events-none">
                <MapPin className="h-4 w-4 text-[#10B981] shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {pickupAddress} ➔ {dropAddress}
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
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{createdAtDate}</h4>
                <span className="text-xs text-slate-400 font-medium">{createdAtTime}</span>
              </div>
            </div>

            {/* Parcel Type */}
            <div className="bg-[#E6F4EA]/30 rounded-2xl p-5 border border-emerald-100/60 shadow-sm space-y-2">
              <div className="size-8 rounded-xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  GOOD TYPE
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5 capitalize">
                  {parcel.goodType || "General"}
                </h4>
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
                <h4 className="text-sm font-bold text-slate-900 mt-0.5 capitalize">
                  {parcel.vehicleType || "Motorcycle"}
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
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {parcel.distance ? `${parcel.distance} km` : "N/A"}
                </h4>
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
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {parcel.duration ? `${parcel.duration} mins` : "N/A"}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Driver Info / Partner Info, Customer Info, Price */}
        <div className="space-y-6">
          {/* Assigned Driver Card */}
          {parcel.driver && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ASSIGNED DRIVER
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {parcel.driver.image ? (
                  <Image
                    src={getImageUrl(parcel.driver.image)}
                    alt={parcel.driver.fullName || "Driver"}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#10B981] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                    {(parcel.driver.fullName || "D").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {parcel.driver.fullName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold mt-0.5">
                    <Star className="h-3.5 w-3.5 fill-[#10B981] text-[#10B981]" />
                    <span>
                      {parcel.driver.driverInfo?.averageRating || 4.8} Rating
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {parcel.driver.phone || "Active Driver"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Partner Card */}
          {parcel.partner && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ASSIGNED PARTNER
              </span>

              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-2xl bg-[#10B981] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                  {(parcel.partner.fullName || "P").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {parcel.partner.fullName}
                  </h4>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#10B981] text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                    <Building2 className="h-3 w-3" />
                    <span>Partner #{parcel.partner.partnerId || "PARTNER"}</span>
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
                {customerAvatar ? (
                  <Image
                    src={customerAvatar}
                    alt={customerName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    {customerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{customerName}</h4>
                  <span className="text-xs text-slate-400 font-normal">{customerEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{customerPhone}</span>
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed pt-1">
                {pickupAddress}
              </p>
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                PRICE BREAKDOWN
              </span>
              {parcel.paymentMethod && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  {parcel.paymentMethod.replace(/_/g, " ")}
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              {typeof parcel.baseFee === "number" && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Fee</span>
                  <span className="font-semibold text-slate-900">${parcel.baseFee.toFixed(2)}</span>
                </div>
              )}

              {typeof parcel.fuelCost === "number" && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Fuel Cost</span>
                  <span className="font-semibold text-slate-900">${parcel.fuelCost.toFixed(2)}</span>
                </div>
              )}

              {typeof parcel.timeCost === "number" && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Time Cost</span>
                  <span className="font-semibold text-slate-900">${parcel.timeCost.toFixed(2)}</span>
                </div>
              )}

              {typeof parcel.serviceFee === "number" && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Service Fee</span>
                  <span className="font-semibold text-slate-900">${parcel.serviceFee.toFixed(2)}</span>
                </div>
              )}

              {typeof parcel.goodRisks === "number" && parcel.goodRisks > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Goods Risk</span>
                  <span className="font-semibold text-slate-900">${parcel.goodRisks.toFixed(2)}</span>
                </div>
              )}

              {typeof parcel.overhead === "number" && parcel.overhead > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Overhead</span>
                  <span className="font-semibold text-slate-900">${parcel.overhead.toFixed(2)}</span>
                </div>
              )}

              {/* Total To Pay */}
              <div className="w-full border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Total To Pay</span>
                <span className="text-xl font-black text-[#10B981]">
                  ${totalFee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
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
