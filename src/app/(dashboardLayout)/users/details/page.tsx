"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
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
  Search,
  Bike,
} from "lucide-react";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import Pagination from "@/components/common/Pagination";

interface UserOrderItem {
  sl: number;
  rawId: string;
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
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Pagination & Search Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  // 1. Fetch User Profile Info
  useEffect(() => {
    if (!targetId) return;

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userRes = await myFetch(`/user/${targetId}`);

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
            totalOrders: 0,
            totalSpent: "$0.00",
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

  // 2. Fetch User Order History with Pagination (limit=10) & Search Filtering
  const fetchUserOrders = useCallback(async () => {
    if (!targetId) return;
    setOrdersLoading(true);

    let query = `/parcel/user-orders/${targetId}?page=${currentPage}&limit=10`;
    if (searchTerm.trim()) {
      query += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
    }
    if (statusFilter !== "All") {
      query += `&status=${encodeURIComponent(statusFilter)}`;
    }

    try {
      const parcelRes = await myFetch(query);

      if (parcelRes.success && parcelRes.data) {
        const rawParcels = parcelRes.data.parcels || (Array.isArray(parcelRes.data) ? parcelRes.data : []);
        const meta = parcelRes.data.meta;

        const ordersList: UserOrderItem[] = rawParcels.map((p: any, idx: number) => {
          const numPrice = Number(
            p.totalToPay || p.totalPrice || p.pricingDetails?.customer?.totalToPay || p.totalDeliveryFee || p.price || p.itemValue || 0
          );

          return {
            sl: (currentPage - 1) * 10 + idx + 1,
            rawId: p._id || p.id,
            bookingId: p.parcelId || p._id || `BKG-${idx + 1}`,
            pickupLocation: p.pickupLocation?.address || "N/A",
            deliveryLocation: p.dropLocation?.address || "N/A",
            price: `${numPrice.toFixed(2)} XOF`,
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

        setUserOrders(ordersList);

        const totalCount = meta?.total !== undefined ? meta.total : (parcelRes.data.totalOrders !== undefined ? parcelRes.data.totalOrders : ordersList.length);
        const totalSpentAmount = parcelRes.data.totalSpent !== undefined ? parcelRes.data.totalSpent : 0;

        setTotalOrdersCount(totalCount);
        setTotalPages(meta?.totalPage || Math.ceil(totalCount / 10) || 1);

        setUser((prev) =>
          prev
            ? {
              ...prev,
              totalOrders: totalCount,
              totalSpent: `${totalSpentAmount.toFixed(2)} XOF`,
            }
            : prev
        );
      }
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, [targetId, currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

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

  const renderOrderStatusBadge = (status: string) => {
    const raw = (status || "").toUpperCase();
    const formatted = raw.replace(/_/g, " ");

    if (raw === "CREATED" || raw === "PENDING" || raw === "CONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#E0F2FE] text-[#0284C7] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-sky-200/60">
          <Clock className="h-3 w-3" />
          <span>PENDING</span>
        </span>
      );
    }
    if (
      [
        "RIDER_ASSIGNED",
        "PARTNER_ASSIGNED",
        "ON_THE_WAY_TO_PICKUP",
        "PICKED_UP",
        "ON_THE_WAY_TO_DELIVERY",
        "ASSIGNED",
        "IN_PROGRESS",
      ].includes(raw)
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200/60">
          <Bike className="h-3 w-3" />
          <span>{formatted}</span>
        </span>
      );
    }
    if (raw === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300/60">
          <CheckCircle2 className="h-3 w-3" />
          <span>DELIVERED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200/60">
        <XCircle className="h-3 w-3" />
        <span>{formatted || "CANCELLED"}</span>
      </span>
    );
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
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile Picture"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-xl shadow-sm border border-slate-100 shrink-0">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
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
                <span className="font-bold text-[#10B981]">{user.totalSpent || "0 XOF"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Orders Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#18181B]">
              User Order History
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              List of all delivery bookings placed by {user.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] w-48 sm:w-60 bg-slate-50/50"
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-slate-50/50 text-slate-700 font-semibold cursor-pointer outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="ON_THE_WAY_TO_DELIVERY">In Transit</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <span className="bg-emerald-50 text-[#10B981] border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap">
              {totalOrdersCount || user.totalOrders || 0} Orders Total
            </span>
          </div>
        </div>

        {/* Orders Table Container with Dynamic Height */}
        <div className={`w-full overflow-x-auto relative ${userOrders.length > 0 ? "min-h-[480px]" : "min-h-0"}`}>
          {/* Smooth Subtle Loading Overlay when Switching Pages */}
          {ordersLoading && userOrders.length > 0 && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all duration-200 rounded-xl">
              <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 text-slate-700 font-semibold text-xs">
                <Loader2 className="h-4 w-4 animate-spin text-[#10B981]" />
                <span>Updating orders...</span>
              </div>
            </div>
          )}

          <table
            className={`w-full text-left text-xs font-medium text-slate-600 border-collapse transition-opacity duration-200 ${ordersLoading && userOrders.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
          >
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
              {ordersLoading && userOrders.length === 0 ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse h-14 border-b border-slate-100">
                    <td className="py-4 px-3"><div className="h-4 w-4 bg-slate-100 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-28 bg-slate-100 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-36 bg-slate-100 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-36 bg-slate-100 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="py-4 px-3"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 w-20 bg-slate-100 rounded-full mx-auto" /></td>
                    <td className="py-4 px-3 text-right"><div className="h-6 w-6 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : userOrders.length > 0 ? (
                userOrders.map((row) => (
                  <tr key={row.bookingId} className="hover:bg-slate-50/80 transition-colors h-14">
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
                      {renderOrderStatusBadge(row.status)}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link
                        href={`/products/details?id=${row.rawId || row.bookingId}&from=${encodeURIComponent(`/users/details?id=${targetId}`)}`}
                        className="p-1.5 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-32">
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium text-sm">
                    No delivery bookings found for this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalItems={totalOrdersCount}
          itemsPerPage={10}
        />
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
