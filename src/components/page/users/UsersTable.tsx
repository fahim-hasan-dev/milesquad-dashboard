"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { masterUsersList } from "@/demoData/usersManagementData";

const initialUsersData = masterUsersList;

const ITEMS_PER_PAGE = 10;

export default function UsersTable() {
  const [users, setUsers] = useState(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusChange = (id: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    toast.success(`User status updated to ${newStatus}`);
  };

  const handleRemove = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User removed");
  };

  // Filter users based on search term and status filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.contact.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      u.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination (10 items per page)
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate pagination page numbers
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

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
            <span>{statusFilter}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => {
                setStatusFilter("All");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold cursor-pointer"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setStatusFilter("Active");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold cursor-pointer"
            >
              Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setStatusFilter("Suspended");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold cursor-pointer"
            >
              Suspended
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setStatusFilter("Pending");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold cursor-pointer"
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setStatusFilter("Inactive");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold cursor-pointer"
            >
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Table Card Container */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
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
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Profile Cell */}
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

                    {/* Role Cell */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#E0F2FE] text-[#0284C7] text-xs font-semibold px-3 py-1 rounded-full">
                        <User className="h-3 w-3" />
                        <span>{row.role}</span>
                      </span>
                    </td>

                    {/* Contact Cell */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-slate-700">
                        <Phone className="h-3.5 w-3.5 text-slate-300" />
                        <span>{row.contact}</span>
                      </div>
                    </td>

                    {/* Status Cell */}
                    <td className="py-4 px-4">
                      {row.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </span>
                      ) : row.status === "Suspended" ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Suspended</span>
                        </span>
                      ) : row.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/users/details?id=${row.id}`} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
                              <Eye className="h-4 w-4 text-slate-500" />
                              <span>View Profile</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleStatusChange(row.id, "Active")}
                            className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                            <span>Active User</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleStatusChange(row.id, "Suspended")}
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
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
}
