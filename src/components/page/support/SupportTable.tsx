/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const initialRequests = [
  {
    id: "SUP-001",
    userName: "Metro Mart",
    userLocation: "Downtown District",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    title: "ID Card Issue",
    contact: "+16546565656",
    status: "Solved",
  },
  {
    id: "SUP-002",
    userName: "Fresh Farms LLC",
    userLocation: "Valley Region",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
    title: "ID Card Issue",
    contact: "+16546565656",
    status: "Solved",
  },
  {
    id: "SUP-003",
    userName: "City Grocers",
    userLocation: "Westside",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    title: "ID Card Issue",
    contact: "+16546565656",
    status: "Solved",
  },
  {
    id: "SUP-004",
    userName: "Grain Masters",
    userLocation: "North Hills",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    title: "ID Card Issue",
    contact: "+16546565656",
    status: "Pending",
  },
];

export default function SupportTable() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleRemove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success("Support request removed");
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Search Bar */}
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
              {filteredRequests.map((row) => (
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
                      <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3.5 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3.5 py-1 rounded-full">
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
              ? "bg-[#10B981] text-[#10B981] shadow-sm"
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
