"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import SuspendUserModal from "@/components/modals/SuspendUserModal";
import ExportDataModal from "@/components/modals/ExportDataModal";
import {
  masterRidersList,
  newRiderRequestsList,
  RiderRecord,
  RiderRequestRecord,
} from "@/demoData/ridersManagementData";

const ITEMS_PER_PAGE = 10;

export default function RidersTable() {
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [activeRiders, setActiveRiders] = useState<RiderRecord[]>(masterRidersList);
  const [newRequests, setNewRequests] = useState<RiderRequestRecord[]>(newRiderRequestsList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleOpenSuspend = (id: string) => {
    setSelectedUserId(id);
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (selectedUserId) {
      setActiveRiders((prev) =>
        prev.map((r) => (r.id === selectedUserId ? { ...r, status: "Suspended" } : r))
      );
      toast.success("Rider account suspended");
    }
  };

  const handleMarkActive = (id: string) => {
    setActiveRiders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Active" } : r))
    );
    toast.success("Rider marked as Active");
  };

  const handleRemove = (id: string) => {
    setActiveRiders((prev) => prev.filter((r) => r.id !== id));
    toast.success("Rider removed");
  };

  const handleApprove = (id: string) => {
    const req = newRequests.find((r) => r.id === id);
    if (req) {
      const newRider: RiderRecord = {
        id: req.id.replace("REQ", "RDR"),
        name: req.name,
        location: "Downtown District",
        role: "Driver",
        vehicle: req.vehicle,
        contact: "+1 654 000 1122",
        email: req.email,
        status: "Active",
        joinedDate: "Just now",
        lastActive: "Just now",
        rating: 5.0,
        completedDeliveries: 0,
        avatar: req.avatar,
      };
      setActiveRiders((prev) => [newRider, ...prev]);
    }
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Driver registration approved!");
  };

  const handleReject = (id: string) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Driver registration rejected");
  };

  // Filter Active Riders
  const filteredActive = activeRiders.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Filter New Requests
  const filteredRequests = newRequests.filter((r) => {
    return (
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const currentDatasetLength = activeTab === "active" ? filteredActive.length : filteredRequests.length;
  const totalPages = Math.ceil(currentDatasetLength / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const paginatedActive = filteredActive.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards (Visible in New Requests mode or Overview) */}
      {activeTab === "requests" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL VEHICLES
            </span>
            <h2 className="text-3xl font-black text-slate-900">142</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ACTIVE DRIVERS
            </span>
            <h2 className="text-3xl font-black text-slate-900">{activeRiders.length}</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PENDING REQUESTS
            </span>
            <h2 className="text-3xl font-black text-slate-900">{newRequests.length}</h2>
          </div>
        </div>
      )}

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
          Active Riders ({activeRiders.length})
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
          <span>New Requests ({newRequests.length})</span>
          {newRequests.length > 0 && (
            <span className="absolute top-1.5 right-2 size-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          {activeTab === "active" ? (
            /* Active Riders Table */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">USER</th>
                  <th className="py-4 px-4">ROLE & VEHICLE</th>
                  <th className="py-4 px-4">CONTACT</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedActive.length > 0 ? (
                  paginatedActive.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={row.avatar}
                            alt={row.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {row.name}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-medium">
                              <MapPin className="h-3 w-3 text-slate-300" />
                              <span>{row.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 bg-[#FFF7ED] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/50">
                          <Bike className="h-3.5 w-3.5" />
                          <span>{row.role} • {row.vehicle}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-slate-700">
                          <Phone className="h-3.5 w-3.5 text-slate-300" />
                          <span>{row.contact}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {row.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </span>
                        ) : row.status === "Suspended" ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/60">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Suspended</span>
                          </span>
                        ) : row.status === "Pending" ? (
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/60">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/60">
                            <PauseCircle className="h-3.5 w-3.5" />
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/riders/details?id=${row.id}`} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
                                <Eye className="h-4 w-4 text-slate-500" />
                                <span>View Profile</span>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleMarkActive(row.id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                              <span>Active User</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleOpenSuspend(row.id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-[#D97706] py-2 cursor-pointer"
                            >
                              <XCircle className="h-4 w-4 text-[#D97706]" />
                              <span>Suspend User</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleRemove(row.id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span>Remove User</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                      No active riders found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* New Requests Table */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">DRIVER NAME</th>
                  <th className="py-4 px-4">VEHICLE TYPE</th>
                  <th className="py-4 px-4">DATE APPLIED</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={row.avatar}
                            alt={row.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {row.name}
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">{row.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 bg-[#FFF7ED] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/50">
                          <Bike className="h-3.5 w-3.5" />
                          <span>{row.vehicle}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                        {row.dateApplied}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/riders/details?id=${row.id}`} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
                                <Eye className="h-4 w-4 text-slate-500" />
                                <span>View Profile</span>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleApprove(row.id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                            >
                              <Check className="h-4 w-4 text-[#10B981]" />
                              <span>Approve Driver</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleReject(row.id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-[#D97706] py-2 cursor-pointer"
                            >
                              <X className="h-4 w-4 text-[#D97706]" />
                              <span>Reject Driver</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 font-medium text-sm">
                      No pending driver requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls - Restored Original Design (rounded-full circular buttons) */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => setCurrentPage(page)}
              className={`size-9 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="text-slate-400 font-semibold text-xs px-1">
              ...
            </span>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Suspend Confirmation Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
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
      />
    </div>
  );
}
