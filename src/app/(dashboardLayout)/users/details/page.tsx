"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import {
  UserDetailData,
  UserOrderItem,
} from "@/components/page/users/details/types";
import UserSummaryCard from "@/components/page/users/details/UserSummaryCard";
import UserPersonalInfoCard from "@/components/page/users/details/UserPersonalInfoCard";
import UserOrdersTable from "@/components/page/users/details/UserOrdersTable";

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
        const rawParcels =
          parcelRes.data.parcels ||
          (Array.isArray(parcelRes.data) ? parcelRes.data : []);
        const meta = parcelRes.data.meta;

        const ordersList: UserOrderItem[] = rawParcels.map(
          (p: any, idx: number) => {
            const numPrice = Number(
              p.deliveryFee ||
                p.totalDeliveryFee ||
                p.totalToPay ||
                p.pricingDetails?.admin?.deliveryFee ||
                p.pricingDetails?.customer?.deliveryFee ||
                p.pricingDetails?.customer?.totalToPay ||
                p.totalPrice ||
                p.price ||
                0
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
          }
        );

        setUserOrders(ordersList);

        const totalCount =
          meta?.total !== undefined
            ? meta.total
            : parcelRes.data.totalOrders !== undefined
            ? parcelRes.data.totalOrders
            : ordersList.length;
        const totalSpentAmount =
          parcelRes.data.totalSpent !== undefined
            ? parcelRes.data.totalSpent
            : 0;

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

      {/* Page Header Title */}
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
        <UserSummaryCard user={user} />
        <UserPersonalInfoCard user={user} />
      </div>

      {/* User Orders Section */}
      <UserOrdersTable
        userName={user.name}
        userId={user.userId || user.id}
        userOrders={userOrders}
        ordersLoading={ordersLoading}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
        totalOrdersCount={totalOrdersCount || user.totalOrders || 0}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
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
