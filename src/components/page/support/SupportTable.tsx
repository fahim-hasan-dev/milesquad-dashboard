"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Phone,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Eye,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import Pagination from "@/components/common/Pagination";
import {
  masterSupportTicketsList,
  SupportTicketRecord,
} from "@/demoData/supportManagementData";

const ITEMS_PER_PAGE = 10;

export default function SupportTable() {
  const [requests, setRequests] = useState<SupportTicketRecord[]>(masterSupportTicketsList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const handleRemove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Support ticket removed");
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination (10 per page)
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );



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
              onClick={() => { setStatusFilter("All"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setStatusFilter("Pending"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setStatusFilter("Solved"); setCurrentPage(1); }}
              className="text-xs font-semibold cursor-pointer"
            >
              Solved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Support Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">USER</th>
                <th className="py-4 px-4">TITLE</th>
                <th className="py-4 px-4">CONTACT</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* USER */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={row.userAvatar}
                          alt={row.userName}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {row.userName}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-medium">
                            <MapPin className="h-3 w-3 text-slate-300" />
                            <span>{row.userLocation}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* TITLE */}
                    <td className="py-4 px-4 text-xs font-bold text-slate-900">
                      {row.title}
                    </td>

                    {/* CONTACT */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Phone className="h-3.5 w-3.5 text-slate-300" />
                        <span>{row.contact}</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4">
                      {row.status === "Solved" ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3.5 py-1 rounded-full border border-amber-200">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/support/details?id=${row.id}`} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
                              <Eye className="h-4 w-4 text-slate-500" />
                              <span>View Request</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleRemove(row.id)}
                            className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span>Remove Request</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No support tickets found matching your search.
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
    </div>
  );
}
