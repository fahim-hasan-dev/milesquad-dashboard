/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Clock, Bike, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import CopyButton from "@/components/common/CopyButton";

interface ParcelItem {
  _id: string;
  parcelId?: string;
  goodType?: string;
  status: string;
  totalDeliveryFee?: number;
  totalToPay?: number;
  pickupLocation?: {
    address?: string;
    name?: string;
  };
  dropLocation?: {
    address?: string;
    name?: string;
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
  };
  createdAt?: string;
}

export default function CompletedOrdersTable() {
  const [deliveries, setDeliveries] = useState<ParcelItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentDeliveries = async () => {
    setLoading(true);
    try {
      const res = await myFetch("/parcel?page=1&limit=8");
      if (res.success && res.data) {
        const rawList = res.data.parcels || res.data.result || res.data.data || (Array.isArray(res.data) ? res.data : []);
        setDeliveries(rawList);
      }
    } catch (err) {
      console.error("Failed to load recent orders for overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentDeliveries();
  }, []);

  const renderStatusBadge = (status: string) => {
    const raw = (status || "").toUpperCase();
    const formatted = raw.replace(/_/g, " ");

    if (raw === "CREATED" || raw === "PENDING") {
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6">
      {/* Table Header & View All Link */}
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

      {/* Deliveries Table Card */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-4">ORDER ID</th>
              <th className="py-4 px-4">USER NAME</th>
              <th className="py-4 px-4">ROUTE</th>
              <th className="py-4 px-4">STATUS</th>
              <th className="py-4 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-[#10B981]" />
                    <span className="text-xs font-medium">Loading recent orders...</span>
                  </div>
                </td>
              </tr>
            ) : deliveries.length > 0 ? (
              deliveries.map((row) => {
                const displayId = row.parcelId || `#${row._id.slice(-6).toUpperCase()}`;
                const customerName = row.sender?.fullName || "Guest Customer";
                const customerPhone = row.sender?.phone || row.receiverPhone || "N/A";
                const customerAvatar = getImageUrl(row.sender?.image);

                const pickupStr = row.pickupLocation?.address || row.pickupLocation?.name || "Pickup";
                const dropStr = row.dropLocation?.address || row.dropLocation?.name || "Dropoff";

                return (
                  <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ORDER ID */}
                    <td className="py-4 px-4 text-xs font-semibold text-[#10B981]">
                      <div className="flex items-center gap-1.5">
                        <span>{displayId}</span>
                        <CopyButton text={displayId} label="Order ID" />
                      </div>
                    </td>

                    {/* USER NAME */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {customerAvatar ? (
                          <Image
                            src={customerAvatar}
                            alt={customerName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#E6F4EA] text-[#10B981] font-bold text-xs flex items-center justify-center border border-emerald-100 shrink-0">
                            {customerName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {customerName}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {customerPhone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ROUTE */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col max-w-xs">
                        <span className="text-xs font-semibold text-slate-700 truncate" title={pickupStr}>
                          From: {pickupStr}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 truncate mt-0.5" title={dropStr}>
                          To: {dropStr}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4">{renderStatusBadge(row.status)}</td>

                    {/* ACTION */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/products/details?id=${row._id}&from=/`}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-[#10B981] hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
