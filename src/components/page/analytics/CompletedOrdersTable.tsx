"use client";

import React from "react";
import Link from "next/link";
import { Copy, ArrowRight, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { OrderItem } from "@/data/overviewData";

const defaultOrders: OrderItem[] = [
  { sl: 1, bookingId: "FM-BKG-000050", customerName: "Donald Trump", providerContact: "+27 791 135 003", price: "$3,600", operationalFee: "$360", platformFee: "$180", bookingDate: "11 Jun 2026", status: "DELIVERED" },
  { sl: 2, bookingId: "FM-BKG-000049", customerName: "Sarah Connor", providerContact: "+27 656 648 349", price: "$1,250", operationalFee: "$125", platformFee: "$62.50", bookingDate: "08 Jun 2026", status: "IN TRANSIT" },
  { sl: 3, bookingId: "FM-BKG-000048", customerName: "Marcus Wei", providerContact: "+27 824 551 902", price: "$850", operationalFee: "$85", platformFee: "$42.50", bookingDate: "04 Jun 2026", status: "PENDING" },
  { sl: 4, bookingId: "FM-BKG-000047", customerName: "Emma Watson", providerContact: "+27 712 990 411", price: "$2,100", operationalFee: "$210", platformFee: "$105", bookingDate: "28 May 2026", status: "DELIVERED" },
  { sl: 5, bookingId: "FM-BKG-000046", customerName: "David Kim", providerContact: "+27 839 201 114", price: "$1,750", operationalFee: "$175", platformFee: "$87.50", bookingDate: "25 May 2026", status: "CANCELLED" },
  { sl: 6, bookingId: "FM-BKG-000045", customerName: "Jessica Alba", providerContact: "+27 721 883 490", price: "$2,850", operationalFee: "$285", platformFee: "$142.50", bookingDate: "20 May 2026", status: "IN TRANSIT" },
  { sl: 7, bookingId: "FM-BKG-000044", customerName: "Michael Scott", providerContact: "+27 614 332 990", price: "$1,900", operationalFee: "$190", platformFee: "$95", bookingDate: "15 May 2026", status: "DELIVERED" },
  { sl: 8, bookingId: "FM-BKG-000043", customerName: "Priya Patel", providerContact: "+27 799 441 203", price: "$3,100", operationalFee: "$310", platformFee: "$155", bookingDate: "10 May 2026", status: "PENDING" },
];

interface CompletedOrdersTableProps {
  orders?: OrderItem[];
}

export default function CompletedOrdersTable({ orders = defaultOrders }: CompletedOrdersTableProps) {
  const displayOrders = orders && orders.length >= 8 ? orders.slice(0, 8) : defaultOrders;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied ${id}`);
  };

  const getStatusBadge = (status: string) => {
    const upper = status.toUpperCase();
    if (upper === "DELIVERED" || upper === "COMPLETED") {
      return (
        <span className="inline-block border border-emerald-300 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
          {status}
        </span>
      );
    } else if (upper === "IN TRANSIT" || upper === "DISPATCHED") {
      return (
        <span className="inline-block border border-blue-300 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
          {status}
        </span>
      );
    } else if (upper === "CANCELLED" || upper === "FAILED") {
      return (
        <span className="inline-block border border-red-300 bg-red-50 text-red-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-block border border-amber-300 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6">
      {/* Table Header & View All Action Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>

        <Link
          href="/products"
          className="flex items-center gap-2 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white text-xs font-semibold rounded-xl px-4 py-2 transition-all cursor-pointer shadow-none"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs font-medium text-slate-600 border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">SL</th>
              <th className="py-3 px-3">Booking ID</th>
              <th className="py-3 px-3">Customer Name</th>
              <th className="py-3 px-3">Provider Contact</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Operational Fee</th>
              <th className="py-3 px-3">Platform Fee</th>
              <th className="py-3 px-3">Booking Date</th>
              <th className="py-3 px-3 text-center">Order Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayOrders.map((row) => (
              <tr key={row.bookingId} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-3 text-slate-500">{row.sl}</td>
                <td className="py-4 px-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span>{row.bookingId}</span>
                    <button
                      onClick={() => handleCopy(row.bookingId)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                      title="Copy Booking ID"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-3 text-slate-700 font-semibold">{row.customerName}</td>
                <td className="py-4 px-3 text-slate-500">{row.providerContact}</td>
                <td className="py-4 px-3 font-bold text-blue-600">{row.price}</td>
                <td className="py-4 px-3 font-bold text-blue-600">{row.operationalFee}</td>
                <td className="py-4 px-3 font-bold text-blue-600">{row.platformFee}</td>
                <td className="py-4 px-3 text-slate-500">{row.bookingDate}</td>
                <td className="py-4 px-3 text-center">
                  {getStatusBadge(row.status)}
                </td>
                <td className="py-4 px-3 text-right">
                  <Link
                    href={`/products/details?id=${row.bookingId}`}
                    className="p-1.5 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View Order Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
