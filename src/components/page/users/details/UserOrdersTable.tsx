import React from "react";
import Link from "next/link";
import { Search, Loader2, Copy, Eye } from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import { UserOrderItem } from "./types";

interface UserOrdersTableProps {
  userName: string;
  userId: string;
  userOrders: UserOrderItem[];
  ordersLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  totalOrdersCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function UserOrdersTable({
  userName,
  userId,
  userOrders,
  ordersLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalOrdersCount,
  currentPage,
  totalPages,
  onPageChange,
}: UserOrdersTableProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#18181B]">
            User Order History
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            List of all delivery bookings placed by {userName}
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] w-48 sm:w-60 bg-slate-50/50"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-slate-50/50 text-slate-700 font-semibold cursor-pointer outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="ON_THE_WAY_TO_DELIVERY">In Transit</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <span className="bg-emerald-50 text-[#10B981] border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap">
            {totalOrdersCount} Orders Total
          </span>
        </div>
      </div>

      {/* Orders Table Container */}
      <div
        className={`w-full overflow-x-auto relative ${
          userOrders.length > 0 ? "min-h-[480px]" : "min-h-0"
        }`}
      >
        {ordersLoading && userOrders.length > 0 && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all duration-200 rounded-xl">
            <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 text-slate-700 font-semibold text-xs">
              <Loader2 className="h-4 w-4 animate-spin text-[#10B981]" />
              <span>Updating orders...</span>
            </div>
          </div>
        )}

        <table
          className={`w-full text-left text-xs font-medium text-slate-600 border-collapse transition-opacity duration-200 ${
            ordersLoading && userOrders.length > 0
              ? "opacity-50 pointer-events-none"
              : "opacity-100"
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
                    <StatusBadge status={row.status} uppercase />
                  </td>
                  <td className="py-4 px-3 text-right">
                    <Link
                      href={`/products/details?id=${row.rawId || row.bookingId}&from=${encodeURIComponent(`/users/details?id=${userId}`)}`}
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
        onPageChange={onPageChange}
        totalItems={totalOrdersCount}
        itemsPerPage={10}
      />
    </div>
  );
}
