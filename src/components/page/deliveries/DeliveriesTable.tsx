"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ArrowRight,
  MoreVertical,
  Eye,
  Bike,
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignDriverModal from "@/components/modals/AssignDriverModal";
import AssignPartnerModal from "@/components/modals/AssignPartnerModal";
import ExportDataModal from "@/components/modals/ExportDataModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import { BASE_URL } from "@/config/env-config";
import CopyButton from "@/components/common/CopyButton";
import Pagination from "@/components/common/Pagination";

export interface ParcelItem {
  _id: string;
  parcelId?: string;
  goodType?: string;
  status: string;
  totalDeliveryFee?: number;
  totalToPay?: number;
  vehicleType?: string;
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
  };
  partner?: {
    _id?: string;
    partnerId?: string;
    fullName?: string;
    phone?: string;
    email?: string;
  };
  createdAt?: string;
}

export default function DeliveriesTable() {
  const [deliveries, setDeliveries] = useState<ParcelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignPartnerModalOpen, setIsAssignPartnerModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    customerName: string;
  } | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", currentPage.toString());
      queryParams.set("limit", "10");
      if (searchTerm.trim()) {
        queryParams.set("searchTerm", searchTerm.trim());
      }
      if (statusFilter !== "ALL") {
        if (statusFilter === "PENDING") {
          queryParams.set("status", "PENDING,CREATED,CONFIRMED");
        } else if (statusFilter === "ASSIGNED") {
          queryParams.set("status", "RIDER_ASSIGNED,PARTNER_ASSIGNED,ON_THE_WAY_TO_PICKUP,PICKED_UP,ON_THE_WAY_TO_DELIVERY");
        } else if (statusFilter === "DELIVERED") {
          queryParams.set("status", "DELIVERED");
        } else if (statusFilter === "CANCELLED") {
          queryParams.set("status", "CANCELLED");
        }
      }

      const res = await myFetch(`/parcel?${queryParams.toString()}`);
      if (res.success && res.data) {
        const list = res.data.parcels || res.data.data || [];
        const meta = res.data.meta || {};
        setDeliveries(list);
        setTotalPages(meta.totalPage || 1);
        setTotalItems(meta.total || list.length);
      }
    } catch (error) {
      console.error("Failed to fetch parcels:", error);
      toast.error("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleOpenAssignDriver = (order: { id: string; customerName: string }) => {
    setSelectedOrder(order);
    setIsAssignDriverModalOpen(true);
  };

  const handleOpenAssignPartner = (order: { id: string; customerName: string }) => {
    setSelectedOrder(order);
    setIsAssignPartnerModalOpen(true);
  };

  const handleConfirmDriverAssignment = () => {
    fetchDeliveries();
  };

  const handleConfirmPartnerAssignment = () => {
    fetchDeliveries();
  };

  const handleDownloadInvoice = async (parcelId: string, customBookingId?: string) => {
    toast.loading("Generating invoice PDF...", { id: "download-invoice" });
    try {
      const token =
        (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
        (typeof document !== "undefined" &&
          document.cookie.match(/(?:^|; )accessToken=([^;]*)/)?.[1]) ||
        "";
      const response = await fetch(`${BASE_URL}/parcel/invoice/${parcelId}`, {
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
      link.download = `Invoice-${customBookingId || parcelId.slice(-6)}.pdf`;
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

  const handleExportDeliveries = async (exportParams: {
    startDate: string;
    endDate: string;
    filter: string;
    format: string;
  }) => {
    toast.loading("Preparing deliveries export...", { id: "export-deliveries" });
    try {
      const token =
        (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
        (typeof document !== "undefined" &&
          document.cookie.match(/(?:^|; )accessToken=([^;]*)/)?.[1]) ||
        "";

      const isExcel =
        exportParams.format?.toLowerCase().includes("excel") ||
        exportParams.format?.toLowerCase().includes("xlsx");

      const queryParams = new URLSearchParams();
      if (exportParams.startDate) queryParams.set("startDate", exportParams.startDate);
      if (exportParams.endDate) queryParams.set("endDate", exportParams.endDate);
      if (exportParams.filter) queryParams.set("filter", exportParams.filter);
      queryParams.set("format", isExcel ? "excel" : "csv");

      const response = await fetch(`${BASE_URL}/parcel/export?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export deliveries data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileExt = isExcel ? "xlsx" : "csv";
      link.download = `Deliveries_Export_${new Date().toISOString().slice(0, 10)}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(
        `Deliveries data exported successfully as ${isExcel ? "Excel (.xlsx)" : "CSV"}!`,
        { id: "export-deliveries" }
      );
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error(err?.message || "Failed to export data", { id: "export-deliveries" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, email, phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
              <span>Status: {statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("ALL");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                ALL
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("PENDING");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                PENDING
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("ASSIGNED");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                ASSIGNED
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("DELIVERED");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                DELIVERED
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("CANCELLED");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                CANCELLED
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Data Action Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="h-11 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Download Deliveries Data"
        filterLabel="Order Status"
        filterOptions={[
          { label: "All Statuses", value: "ALL" },
          { label: "Pending", value: "PENDING" },
          { label: "Assigned", value: "ASSIGNED" },
          { label: "Delivered", value: "DELIVERED" },
          { label: "Cancelled", value: "CANCELLED" },
        ]}
        onDownload={handleExportDeliveries}
      />

      {/* Deliveries Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
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
                      <span className="text-xs font-medium">Loading deliveries from server...</span>
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
                  const isPending = row.status === "created" || row.status === "pending";

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
                              className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
                              {customerName}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {customerPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ROUTE */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="text-[#10B981] max-w-[140px] truncate" title={pickupStr}>
                            {pickupStr}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                          <span className="text-[#EA580C] max-w-[140px] truncate" title={dropStr}>
                            {dropStr}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4">{renderStatusBadge(row.status)}</td>

                      {/* ACTION */}
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1"
                          >
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link
                                href={`/products/details?id=${row._id}`}
                                className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2"
                              >
                                <Eye className="h-4 w-4 text-slate-500" />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDownloadInvoice(row._id, displayId)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                            >
                              <Download className="h-4 w-4 text-[#10B981]" />
                              <span>Download Invoice</span>
                            </DropdownMenuItem>

                            {isPending && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenAssignDriver({
                                      id: row._id,
                                      customerName,
                                    })
                                  }
                                  className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                                >
                                  <Bike className="h-4 w-4 text-[#10B981]" />
                                  <span>Assign Driver</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenAssignPartner({
                                      id: row._id,
                                      customerName,
                                    })
                                  }
                                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 py-2 cursor-pointer"
                                >
                                  <Building2 className="h-4 w-4 text-slate-700" />
                                  <span>Assign Partner</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No deliveries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      {/* Assign Driver Modal */}
      {selectedOrder && (
        <AssignDriverModal
          isOpen={isAssignDriverModalOpen}
          onClose={() => setIsAssignDriverModalOpen(false)}
          parcelId={selectedOrder.id}
          customerName={selectedOrder.customerName}
          onConfirmAssignment={handleConfirmDriverAssignment}
        />
      )}

      {/* Assign Partner Modal */}
      {selectedOrder && (
        <AssignPartnerModal
          isOpen={isAssignPartnerModalOpen}
          onClose={() => setIsAssignPartnerModalOpen(false)}
          parcelId={selectedOrder.id}
          customerName={selectedOrder.customerName}
          onConfirmPartnerAssignment={handleConfirmPartnerAssignment}
        />
      )}
    </div>
  );
}
