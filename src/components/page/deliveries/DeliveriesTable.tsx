/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignDriverModal from "@/components/modals/AssignDriverModal";
import toast from "react-hot-toast";

const initialDeliveries = [
  {
    id: "#ORD-29481",
    userName: "Alex Thompson",
    userEmail: "alex.t@example.com",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    fromLocation: "Motijheel",
    toLocation: "Gulshan-1",
    status: "PENDING",
  },
  {
    id: "#ORD-29482",
    userName: "Sarah Jenkins",
    userEmail: "s.jenkins@cloud.net",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
    fromLocation: "Dhanmondi",
    toLocation: "Uttara",
    status: "PENDING",
  },
  {
    id: "#ORD-29483",
    userName: "Marcus Wei",
    userEmail: "m.wei@techcorp.io",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    fromLocation: "Mirpur-10",
    toLocation: "Banani",
    status: "PENDING",
  },
  {
    id: "#ORD-29484",
    userName: "Elena Rodriguez",
    userEmail: "elena.rod@global.com",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
    fromLocation: "Paltan",
    toLocation: "Bashundhara",
    status: "PENDING",
  },
];

export default function DeliveriesTable() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    customerName: string;
  } | null>(null);

  const handleOpenAssign = (order: { id: string; customerName: string }) => {
    setSelectedOrder(order);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = (driverName: string) => {
    if (selectedOrder) {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === selectedOrder.id ? { ...d, status: "ASSIGNED" } : d
        )
      );
      toast.success(`Driver ${driverName} assigned to ${selectedOrder.id}`);
    }
  };

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.toLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
            onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={() => setStatusFilter("ALL")}
              className="text-xs font-semibold"
            >
              ALL
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter("PENDING")}
              className="text-xs font-semibold"
            >
              PENDING
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter("ASSIGNED")}
              className="text-xs font-semibold"
            >
              ASSIGNED
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
              {filteredDeliveries.map((row) => (
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
                    {row.status === "PENDING" ? (
                      <span className="inline-flex items-center gap-1.5 bg-[#E0F2FE] text-[#0284C7] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <span className="size-1.5 rounded-full bg-[#0284C7]" />
                        <span>PENDING</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <span className="size-1.5 rounded-full bg-[#10B981]" />
                        <span>ASSIGNED</span>
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/products/details?id=${row.id}`} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
                            <Eye className="h-4 w-4 text-slate-500" />
                            <span>View Request</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleOpenAssign({
                              id: row.id,
                              customerName: row.userName,
                            })
                          }
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                        >
                          <Bike className="h-4 w-4 text-slate-600" />
                          <span>Assign Driver</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Assign Driver Modal */}
      {selectedOrder && (
        <AssignDriverModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          orderId={selectedOrder.id}
          customerName={selectedOrder.customerName}
          onConfirmAssignment={handleConfirmAssignment}
        />
      )}
    </div>
  );
}
