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
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import SuspendUserModal from "@/components/modals/SuspendUserModal";

const activeRidersData = [
  {
    id: "USR-00124",
    name: "Metro Mart",
    location: "Downtown District",
    role: "Driver",
    contact: "+16546565656",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
  },
  {
    id: "USR-00125",
    name: "Fresh Farms LLC",
    location: "Valley Region",
    role: "Driver",
    contact: "+16546565656",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
  },
  {
    id: "USR-00126",
    name: "City Grocers",
    location: "Westside",
    role: "Driver",
    contact: "+16546565656",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
  },
  {
    id: "USR-00127",
    name: "Grain Masters",
    location: "North Hills",
    role: "Driver",
    contact: "+16546565656",
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
  },
];

const newRequestsData = [
  {
    id: "REQ-001",
    name: "Julian Dashwood",
    email: "julian.d@example.com",
    dateApplied: "Oct 12, 2023",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300",
  },
  {
    id: "REQ-002",
    name: "Maya West",
    email: "maya.w@webmail.com",
    dateApplied: "Oct 12, 2023",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300",
  },
  {
    id: "REQ-003",
    name: "Ryan Kholin",
    email: "r.kholin@logistics.co",
    dateApplied: "Oct 12, 2023",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300",
  },
];

export default function RidersTable() {
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [activeRiders, setActiveRiders] = useState(activeRidersData);
  const [newRequests, setNewRequests] = useState(newRequestsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
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

  const handleApprove = (id: string) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Driver registration approved!");
  };

  const handleReject = (id: string) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Driver registration rejected");
  };

  const filteredActive = activeRiders.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = newRequests.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h2 className="text-3xl font-black text-slate-900">128</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              AVAILABLE REQUESTS
            </span>
            <h2 className="text-3xl font-black text-slate-900">13</h2>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
            <span>All</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem className="text-xs font-semibold">All Roles</DropdownMenuItem>
            <DropdownMenuItem className="text-xs font-semibold">Active</DropdownMenuItem>
            <DropdownMenuItem className="text-xs font-semibold">Suspended</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sub-Tabs Pill Controls */}
      <div className="bg-slate-100/70 p-1.5 rounded-2xl w-fit flex items-center gap-2 border border-slate-200/60">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === "active"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Active Riders
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`relative px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === "requests"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>New Requests</span>
          <span className="absolute top-1.5 right-2 size-2 bg-red-500 rounded-full" />
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
                  <th className="py-4 px-4">ROLE</th>
                  <th className="py-4 px-4">CONTACT</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActive.map((row) => (
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
                      <span className="inline-flex items-center gap-1.5 bg-[#FFF7ED] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-full">
                        <Bike className="h-3.5 w-3.5" />
                        <span>Driver</span>
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
                        <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Suspended</span>
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

                          <DropdownMenuItem className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer">
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

                          <DropdownMenuItem className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span>Remove User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* New Requests Table */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">DRIVER NAME</th>
                  <th className="py-4 px-4">DATE APPLIED</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((row) => (
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`size-9 rounded-full text-xs font-semibold transition-colors ${
              currentPage === num
                ? "bg-[#10B981] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {num}
          </button>
        ))}

        <span className="text-slate-400 font-semibold text-xs px-1">...</span>

        <button
          onClick={() => setCurrentPage(10)}
          className={`size-9 rounded-full text-xs font-semibold transition-colors ${
            currentPage === 10
              ? "bg-[#10B981] text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          10
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
          className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
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
    </div>
  );
}
