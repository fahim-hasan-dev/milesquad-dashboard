/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddPartnerModal from "@/components/modals/AddPartnerModal";
import toast from "react-hot-toast";

const initialPartnersData = [
  {
    id: "P-001",
    name: "Carles Mendez",
    initials: "CM",
    avatarBg: "bg-[#06B6D4]",
    role: "Vendor Manager",
    email: "carlos@northhills.com",
    phone: "+16546565656",
    dateAdded: "Jun 14, 2024",
  },
  {
    id: "P-002",
    name: "Emma Larsson",
    initials: "EL",
    avatarBg: "bg-[#A855F7]",
    role: "Partner Relations",
    email: "emma.l@valleyregion.com",
    phone: "+16546565656",
    dateAdded: "May 22, 2024",
  },
  {
    id: "P-003",
    name: "David Kwame",
    initials: "DK",
    avatarBg: "bg-[#EF4444]",
    role: "Supply Chain Director",
    email: "david.k@grainmasters.com",
    phone: "+16546565656",
    dateAdded: "Apr 4, 2024",
  },
  {
    id: "P-004",
    name: "Priya Nair",
    initials: "PN",
    avatarBg: "bg-[#3B82F6]",
    role: "Operations Lead",
    email: "priya@citygrocers.com",
    phone: "+16546565656",
    dateAdded: "Mar 18, 2024",
  },
  {
    id: "P-005",
    name: "James Okafor",
    initials: "JO",
    avatarBg: "bg-[#10B981]",
    role: "Procurement Head",
    email: "james@freshfarms.com",
    phone: "+16546565656",
    dateAdded: "Feb 8, 2024",
  },
];

export default function PartnersTable() {
  const [partners, setPartners] = useState(initialPartnersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddPartner = (newPartner: any) => {
    setPartners((prev) => [newPartner, ...prev]);
  };

  const handleRemove = (id: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    toast.success("Partner removed successfully");
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Search Bar & Add Partner Action Button */}
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

        {/* Add Partner Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-end sm:self-auto flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Main Partners Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">PARTNER</th>
                <th className="py-4 px-4">ROLE</th>
                <th className="py-4 px-4">CONTACT</th>
                <th className="py-4 px-4">DATE ADDED</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Partner Avatar + Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-full ${row.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        {row.initials}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {row.name}
                      </h4>
                    </div>
                  </td>

                  {/* Role Pill Badge */}
                  <td className="py-4 px-4">
                    <span className="inline-block bg-[#FFF7ED] text-[#EA580C] text-xs font-semibold px-3.5 py-1 rounded-full w-fit">
                      {row.role}
                    </span>
                  </td>

                  {/* Contact Info (Email & Phone stacked) */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{row.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{row.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Date Added */}
                  <td className="py-4 px-4 text-xs font-medium text-slate-500">
                    {row.dateAdded}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                        <DropdownMenuItem
                          onClick={() => toast.success(`Viewing ${row.name}`)}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                          <span>View Details</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => toast.success(`Edit ${row.name}`)}
                          className="flex items-center gap-2.5 text-xs font-semibold text-blue-600 py-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                          <span>Edit Partner</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleRemove(row.id)}
                          className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span>Remove</span>
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

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPartner={handleAddPartner}
      />
    </div>
  );
}
