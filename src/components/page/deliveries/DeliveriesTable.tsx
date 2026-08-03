"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignDriverModal from "@/components/modals/AssignDriverModal";
import AssignPartnerModal from "@/components/modals/AssignPartnerModal";
import toast from "react-hot-toast";
import {
  masterDeliveriesList,
  DeliveryRecord,
} from "@/demoData/deliveriesManagementData";

const ITEMS_PER_PAGE = 10;

export default function DeliveriesTable() {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(masterDeliveriesList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignPartnerModalOpen, setIsAssignPartnerModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    customerName: string;
  } | null>(null);

  const handleOpenAssignDriver = (order: { id: string; customerName: string }) => {
    setSelectedOrder(order);
    setIsAssignDriverModalOpen(true);
  };

  const handleOpenAssignPartner = (order: { id: string; customerName: string }) => {
    setSelectedOrder(order);
    setIsAssignPartnerModalOpen(true);
  };

  const handleConfirmDriverAssignment = (driverName: string) => {
    if (selectedOrder) {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === selectedOrder.id ? { ...d, status: "ASSIGNED", driverName } : d
        )
      );
      toast.success(`Driver ${driverName} assigned to ${selectedOrder.id}`);
    }
  };

  const handleConfirmPartnerAssignment = (partnerName: string) => {
    if (selectedOrder) {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === selectedOrder.id ? { ...d, status: "ASSIGNED" } : d
        )
      );
      toast.success(`Partner ${partnerName} assigned to ${selectedOrder.id}`);
    }
  };

  // Filter deliveries based on search and status
  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.toLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination (10 per page)
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDeliveries = filteredDeliveries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#E0F2FE] text-[#0284C7] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-sky-200/60">
            <Clock className="h-3 w-3" />
            <span>PENDING</span>
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200/60">
            <Bike className="h-3 w-3" />
            <span>ASSIGNED</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300/60">
            <CheckCircle2 className="h-3 w-3" />
            <span>DELIVERED</span>
          </span>
        );
      case "CANCELLED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200/60">
            <XCircle className="h-3 w-3" />
            <span>CANCELLED</span>
          </span>
        );
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
            placeholder="Search anything..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
            <span>{statusFilter}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => { setStatusFilter("ALL"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              ALL
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setStatusFilter("PENDING"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              PENDING
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setStatusFilter("ASSIGNED"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              ASSIGNED
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setStatusFilter("DELIVERED"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              DELIVERED
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setStatusFilter("CANCELLED"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              CANCELLED
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
              {paginatedDeliveries.length > 0 ? (
                paginatedDeliveries.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ORDER ID */}
                    <td className="py-4 px-4 text-xs font-semibold text-[#10B981]">
                      {row.id}
                    </td>

                    {/* USER NAME */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={row.userAvatar}
                          alt={row.userName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
                            {row.userName}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {row.userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ROUTE */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-[#10B981]">{row.fromLocation}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-[#EA580C]">{row.toLocation}</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4">
                      {renderStatusBadge(row.status)}
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/products/details?id=${row.id}`} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
                              <Eye className="h-4 w-4 text-slate-500" />
                              <span>View Request</span>
                            </Link>
                          </DropdownMenuItem>

                          {row.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenAssignDriver({
                                    id: row.id,
                                    customerName: row.userName,
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
                                    id: row.id,
                                    customerName: row.userName,
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No deliveries found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls - Restored Circular rounded-full Design */}
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

      {/* Assign Driver Modal */}
      {selectedOrder && (
        <AssignDriverModal
          isOpen={isAssignDriverModalOpen}
          onClose={() => setIsAssignDriverModalOpen(false)}
          orderId={selectedOrder.id}
          customerName={selectedOrder.customerName}
          onConfirmAssignment={handleConfirmDriverAssignment}
        />
      )}

      {/* Assign Partner Modal */}
      {selectedOrder && (
        <AssignPartnerModal
          isOpen={isAssignPartnerModalOpen}
          onClose={() => setIsAssignPartnerModalOpen(false)}
          orderId={selectedOrder.id}
          customerName={selectedOrder.customerName}
          onConfirmPartnerAssignment={handleConfirmPartnerAssignment}
        />
      )}
    </div>
  );
}
