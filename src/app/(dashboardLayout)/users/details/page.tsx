"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  ShoppingBag,
  DollarSign,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";

interface UserOrderItem {
  sl: number;
  bookingId: string;
  pickupLocation: string;
  deliveryLocation: string;
  price: string;
  bookingDate: string;
  status: string;
}

interface UserDetailData {
  id: string;
  userId?: string;
  name: string;
  email: string;
  contact: string;
  location: string;
  role: string;
  status: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: string;
}

function UserDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const targetId = queryId || routeId;

  const [user, setUser] = useState<UserDetailData | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const [userRes, parcelRes] = await Promise.all([
          myFetch(`/user/${targetId}`),
          myFetch(`/parcel?sender=${targetId}`),
        ]);

        let ordersList: UserOrderItem[] = [];
        let computedTotalSpent = 0;

        if (parcelRes.success && parcelRes.data) {
          const rawParcels = parcelRes.data.parcels || [];
          ordersList = rawParcels.map((p: any, idx: number) => {
            const numPrice = Number(
              p.pricingDetails?.customer?.totalToPay || p.totalToPay || p.totalDeliveryFee || p.price || 0
            );
            computedTotalSpent += numPrice;

            return {
              sl: idx + 1,
              bookingId: p._id || `BKG-${idx + 1}`,
              pickupLocation: p.pickupLocation?.address || "N/A",
              deliveryLocation: p.dropLocation?.address || "N/A",
              price: `$${numPrice.toFixed(2)}`,
              bookingDate: p.createdAt
                ? new Date(p.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "N/A",
              status: (p.status || "PENDING").toUpperCase(),
            };
          });
        }
        setUserOrders(ordersList);

        if (userRes.success && userRes.data) {
          const u = userRes.data;
          const userStatusRaw = (u.status || "").toLowerCase();
          const displayStatus =
            userStatusRaw === "active"
              ? "Active"
              : userStatusRaw === "restricted" || userStatusRaw === "blocked"
                ? "Suspended"
                : userStatusRaw === "pending"
                  ? "Pending"
                  : "Active";

          setUser({
            id: u._id,
            userId: u.userId || u._id,
            name: u.fullName || u.name || "N/A",
            email: u.email || "N/A",
            contact: u.phone || "N/A",
            location:
              typeof u.address === "string" && u.address
                ? u.address
                : Array.isArray(u.location) && u.location.length === 2
                  ? `Lat: ${u.location[1]}, Lng: ${u.location[0]}`
                  : typeof u.location === "string" && u.location
                    ? u.location
                    : "N/A",
            role: u.role || "Customer",
            status: displayStatus,
            avatar: u.image ? getImageUrl(u.image) : "",
            joinedDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : "N/A",
            totalOrders: ordersList.length,
            totalSpent: `$${computedTotalSpent.toFixed(2)}`,
          });
        } else {
          toast.error(userRes.message || "Failed to load user details");
        }
      } catch (err) {
        console.error("Error fetching user detail:", err);
        toast.error("Error loading user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [targetId]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active</span>
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/60">
            <XCircle className="h-3.5 w-3.5" />
            <span>Suspended</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/60">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending</span>
          </span>
        );
      case "Inactive":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/60">
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
        <span className="text-sm font-medium">Loading user details...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium space-y-4">
        <p>User details not found.</p>
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#10B981] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Page Header Title & Top Right Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            View User Details
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Complete information about this user account.
          </p>
        </div>
      </div>

      {/* 2-Card Layout Container */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Card: Summary Card (Fixed ~360px on desktop) */}
        <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          {/* Avatar Picture */}
          <div className="relative mb-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={112}
                height={112}
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-50 shadow-sm"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#10B981] text-white font-black flex items-center justify-center text-3xl shadow-sm border-4 border-slate-50">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Name & ID */}
          <h2 className="text-xl md:text-2xl font-bold text-[#18181B] tracking-tight">
            {user.name}
          </h2>
          <span className="text-xs font-medium text-slate-400 mt-1 mb-3 block tracking-wide">
            #{user.userId || user.id}
          </span>

          {/* Status Badge */}
          <div className="mb-2">{renderStatusBadge(user.status)}</div>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-6" />

          {/* Metadata Rows */}
          <div className="w-full space-y-5 text-left">
            <div className="flex items-start gap-3.5">
              <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Role</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Location</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {user.location}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Joined</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {user.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Personal & Account Information (Takes remaining width) */}
        <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
          {/* Section Title */}
          <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
            Personal Information
          </h3>

          {/* Profile Picture Row */}
          <div className="flex items-center gap-4">
            <Image
              src={user.avatar}
              alt="Profile Picture"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
            />
            <div>
              <h4 className="text-sm md:text-base font-bold text-[#18181B]">
                Profile Picture
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                User&apos;s profile image
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
                <span className="font-bold text-[#18181B]">{user.name}</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Email Address</span>
                <span className="font-bold text-[#18181B]">{user.email}</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
                <span className="font-bold text-[#18181B]">{user.contact}</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Total Orders</span>
                <span className="font-bold text-[#18181B]">{user.totalOrders || 0} Orders</span>
              </div>
            </div>

            {/* Total Revenue / Spent */}
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Total Volume</span>
                <span className="font-bold text-[#10B981]">{user.totalSpent || "$0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Orders Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#18181B]">
              User Order History
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              List of all delivery bookings placed by {user.name}
            </p>
          </div>
          <span className="bg-emerald-50 text-[#10B981] border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
            {user.totalOrders || 0} Orders Total
          </span>
        </div>

        {/* Orders Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">SL</th>
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Pickup Location</th>
                <th className="py-3 px-3">Delivery Location</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Booking Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userOrders.length > 0 ? (
                userOrders.map((row) => (
                  <tr key={row.bookingId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-3 text-slate-500">{row.sl}</td>
                    <td className="py-4 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-slate-700">{row.bookingId}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(row.bookingId);
                            toast.success(`Copied ${row.bookingId}`);
                          }}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                          title="Copy Booking ID"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-700 font-medium">{row.pickupLocation}</td>
                    <td className="py-4 px-3 text-slate-700 font-medium">{row.deliveryLocation}</td>
                    <td className="py-4 px-3 font-bold text-blue-600">{row.price}</td>
                    <td className="py-4 px-3 text-slate-500">{row.bookingDate}</td>
                    <td className="py-4 px-3 text-center">
                      {row.status === "DELIVERED" ? (
                        <span className="inline-block border border-emerald-300 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
                          DELIVERED
                        </span>
                      ) : row.status === "ON_THE_WAY_TO_DELIVERY" || row.status === "ON_THE_WAY_TO_PICKUP" || row.status === "PICKED_UP" ? (
                        <span className="inline-block border border-blue-300 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
                          IN TRANSIT
                        </span>
                      ) : row.status === "CANCELLED" ? (
                        <span className="inline-block border border-red-300 bg-red-50 text-red-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
                          CANCELLED
                        </span>
                      ) : (
                        <span className="inline-block border border-amber-300 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link
                        href={`/orders/details?id=${row.bookingId}`}
                        className="p-1.5 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No delivery bookings found for this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 font-medium">
          Loading user details...
        </div>
      }
    >
      <UserDetailsContent />
    </Suspense>
  );
}
