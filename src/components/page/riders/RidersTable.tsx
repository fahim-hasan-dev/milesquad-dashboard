"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Bike,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  X,
  Download,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import ExportDataModal from "@/components/modals/ExportDataModal";
import { BASE_URL } from "@/config/env-config";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/common/Pagination";
import { DriverItem } from "./types";
import ActiveRidersTable from "./ActiveRidersTable";
import PendingRidersTable from "./PendingRidersTable";

export default function RidersTable() {
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [activeRiders, setActiveRiders] = useState<DriverItem[]>([]);
  const [newRequests, setNewRequests] = useState<DriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, activeTab]);

  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    pendingRequests: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const [allRes, activeRes, pendingRes] = await Promise.all([
        myFetch("/user?role=driver&limit=1"),
        myFetch("/user?role=driver&driverInfo.profileVerification=approved&limit=1"),
        myFetch("/user?role=driver&driverInfo.profileVerification=pending,resubmitted,rejected&limit=1"),
      ]);

      setStats({
        totalDrivers: allRes?.data?.meta?.total || allRes?.data?.meta?.totalDoc || 0,
        activeDrivers: activeRes?.data?.meta?.total || activeRes?.data?.meta?.totalDoc || 0,
        pendingRequests: pendingRes?.data?.meta?.total || pendingRes?.data?.meta?.totalDoc || 0,
      });
    } catch (err) {
      console.error("Error fetching driver stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.set("role", "driver");
    queryParams.set("page", currentPage.toString());
    queryParams.set("limit", "10");

    if (activeTab === "active") {
      queryParams.set("driverInfo.profileVerification", "approved");
      if (statusFilter !== "All") {
        const statusValue = statusFilter === "Suspended" ? "restricted" : statusFilter.toLowerCase();
        queryParams.set("status", statusValue);
      }
    } else {
      queryParams.set("driverInfo.profileVerification", "pending,resubmitted,rejected");
    }

    if (debouncedSearch.trim()) {
      queryParams.set("searchTerm", debouncedSearch.trim());
    }

    try {
      const res = await myFetch(`/user?${queryParams.toString()}`);
      if (res.success && res.data) {
        const rawDrivers = res.data.users || [];
        const formattedDrivers: DriverItem[] = rawDrivers.map((d: any) => {
          const rawStatus = (d.status || "").toLowerCase();
          const verificationStatus = (d.driverInfo?.profileVerification || "pending").toLowerCase();

          return {
            id: d._id,
            userId: d.userId || d._id,
            name: d.fullName || d.name || "N/A",
            email: d.email || "N/A",
            contact: d.phone || "N/A",
            location: d.location || d.address || "N/A",
            role: "Driver",
            vehicle: (() => {
              const rawV = d.driverInfo?.vehicleType || d.vehicleType;
              if (!rawV) return "N/A";
              if (rawV.toLowerCase() === "small_cargo") return "Small Cargo";
              return rawV.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            })(),
            verification: verificationStatus,
            status:
              rawStatus === "active"
                ? "Active"
                : rawStatus === "restricted" || rawStatus === "blocked"
                ? "Suspended"
                : "Active",
            avatar: d.image ? getImageUrl(d.image) : "",
            dateApplied: d.createdAt
              ? new Date(d.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
            joinedDate: d.createdAt
              ? new Date(d.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
          };
        });

        if (activeTab === "active") {
          setActiveRiders(formattedDrivers);
        } else {
          setNewRequests(formattedDrivers);
        }

        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPage || 1);
        }
      } else {
        toast.error(res.message || "Failed to fetch drivers");
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
      toast.error("Network error while fetching drivers");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter, activeTab]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleApprove = async (id: string) => {
    toast.loading("Approving driver verification...", { id: "approve-driver" });
    try {
      const res = await myFetch(`/user/driver-verification/${id}`, {
        method: "PATCH",
        body: { status: "approved" },
      });
      if (res.success) {
        toast.success("Driver verification approved successfully!", { id: "approve-driver" });
        fetchDrivers();
        fetchStats();
      } else {
        toast.error(res.message || res.error || "Failed to approve driver", {
          id: "approve-driver",
        });
      }
    } catch {
      toast.error("Error approving driver", { id: "approve-driver" });
    }
  };

  const [rejectDriverItem, setRejectDriverItem] = useState<DriverItem | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const [deleteDriverId, setDeleteDriverId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmReject = async (reason: string) => {
    if (!rejectDriverItem) return;
    setIsRejecting(true);
    toast.loading("Rejecting driver verification...", { id: "reject-driver" });
    try {
      const res = await myFetch(`/user/driver-verification/${rejectDriverItem.id}`, {
        method: "PATCH",
        body: {
          status: "rejected",
          rejectReason: reason,
        },
      });
      if (res.success) {
        toast.success("Driver verification rejected successfully!", { id: "reject-driver" });
        setRejectDriverItem(null);
        fetchDrivers();
        fetchStats();
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

  const handleConfirmDelete = async () => {
    if (!deleteDriverId) return;
    setIsDeleting(true);
    toast.loading("Removing driver...", { id: "remove-driver" });
    try {
      const res = await myFetch(`/user/${deleteDriverId}`, { method: "DELETE" });
      if (res.success) {
        toast.success("Driver removed successfully", { id: "remove-driver" });
        setDeleteDriverId(null);
        fetchDrivers();
        fetchStats();
      } else {
        toast.error(res.message || res.error || "Failed to remove driver", {
          id: "remove-driver",
        });
      }
    } catch {
      toast.error("Error removing driver", { id: "remove-driver" });
    } finally {
      setIsDeleting(false);
    }
  };



  const handleExportRiders = async (exportParams: {
    startDate: string;
    endDate: string;
    filter: string;
  }) => {
    toast.loading("Preparing riders export...", { id: "export-riders" });
    try {
      const token =
        (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
        (typeof document !== "undefined" &&
          document.cookie.match(/(?:^|; )accessToken=([^;]*)/)?.[1]) ||
        "";

      const queryParams = new URLSearchParams();
      queryParams.set("role", "DRIVER");
      if (exportParams.startDate) queryParams.set("startDate", exportParams.startDate);
      if (exportParams.endDate) queryParams.set("endDate", exportParams.endDate);
      if (exportParams.filter) queryParams.set("filter", exportParams.filter);

      const response = await fetch(`${BASE_URL}/user/export?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export riders data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Riders_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Riders data exported successfully!", { id: "export-riders" });
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error(err?.message || "Failed to export data", { id: "export-riders" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards (Dynamic counts from backend) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            TOTAL DRIVERS
          </span>
          <h2 className="text-3xl font-black text-slate-900">{stats.totalDrivers}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            ACTIVE DRIVERS
          </span>
          <h2 className="text-3xl font-black text-slate-900">{stats.activeDrivers}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            PENDING REQUESTS
          </span>
          <h2 className="text-3xl font-black text-slate-900">{stats.pendingRequests}</h2>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {activeTab === "active" && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
                <span>{statusFilter}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => { setStatusFilter("All"); setCurrentPage(1); }}
                  className="text-xs font-semibold cursor-pointer"
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { setStatusFilter("Active"); setCurrentPage(1); }}
                  className="text-xs font-semibold cursor-pointer"
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { setStatusFilter("Suspended"); setCurrentPage(1); }}
                  className="text-xs font-semibold cursor-pointer"
                >
                  Suspended
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { setStatusFilter("Pending"); setCurrentPage(1); }}
                  className="text-xs font-semibold cursor-pointer"
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { setStatusFilter("Inactive"); setCurrentPage(1); }}
                  className="text-xs font-semibold cursor-pointer"
                >
                  Inactive
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
        )}
      </div>

      {/* Sub-Tabs Pill Controls */}
      <div className="bg-slate-100/70 p-1.5 rounded-2xl w-fit flex items-center gap-2 border border-slate-200/60">
        <button
          onClick={() => {
            setActiveTab("active");
            setCurrentPage(1);
          }}
          className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "active"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Active Riders ({stats.activeDrivers})
        </button>

        <button
          onClick={() => {
            setActiveTab("requests");
            setCurrentPage(1);
          }}
          className={`relative px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "requests"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>New Requests ({stats.pendingRequests})</span>
          {stats.pendingRequests > 0 && (
            <span className="absolute top-1.5 right-2 size-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          {activeTab === "active" ? (
            <ActiveRidersTable
              activeRiders={activeRiders}
              loading={loading}
              onDeleteDriver={(id) => setDeleteDriverId(id)}
            />
          ) : (
            <PendingRidersTable
              newRequests={newRequests}
              loading={loading}
              onApproveDriver={handleApprove}
              onRejectDriver={(driver) => setRejectDriverItem(driver)}
              onDeleteDriver={(id) => setDeleteDriverId(id)}
            />
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Download Riders Data"
        filterLabel="Rider Status"
        filterOptions={[
          { label: "All Statuses", value: "ALL" },
          { label: "Active", value: "Active" },
          { label: "Suspended", value: "Suspended" },
          { label: "Pending", value: "Pending" },
        ]}
        onDownload={handleExportRiders}
      />
      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={Boolean(rejectDriverItem)}
        onClose={() => setRejectDriverItem(null)}
        onConfirm={handleConfirmReject}
        loading={isRejecting}
        driverName={rejectDriverItem?.name || "Driver"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteDriverId)}
        onClose={() => setDeleteDriverId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Remove Driver Account?"
        description="Are you sure you want to remove this driver? This action cannot be undone."
        actionBtnText="Remove Driver"
      />
    </div>
  );
}
