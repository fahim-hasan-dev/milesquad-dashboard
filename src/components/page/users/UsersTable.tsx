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

const initialUsersData = [
  {
    id: "USR-00124",
    name: "Metro Mart",
    location: "Downtown District",
    role: "User",
    contact: "+16546565656",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
  },
  {
    id: "USR-00125",
    name: "Fresh Farms LLC",
    location: "Valley Region",
    role: "User",
    contact: "+16546565656",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
  },
  {
    id: "USR-00126",
    name: "City Grocers",
    location: "Westside",
    role: "User",
    contact: "+16546565656",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
  },
  {
    id: "USR-00127",
    name: "Grain Masters",
    location: "North Hills",
    role: "User",
    contact: "+16546565656",
    status: "Suspended",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
  },
];

export default function UsersTable() {
  const [users, setUsers] = useState(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {filteredUsers.map((row) => (
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
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Suspended</span>
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
    </div>
  );
}
