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
import EditPartnerModal from "@/components/modals/EditPartnerModal";
import ViewPartnerModal from "@/components/modals/ViewPartnerModal";
import toast from "react-hot-toast";
import {
  masterPartnersList,
  PartnerRecord,
} from "@/demoData/partnersManagementData";

const ITEMS_PER_PAGE = 10;

export default function PartnersTable() {
  const [partners, setPartners] = useState<PartnerRecord[]>(masterPartnersList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddPartner = (newPartner: Partial<PartnerRecord>) => {
    const created: PartnerRecord = {
      id: `P-00${partners.length + 1}`,
      name: newPartner.name || "New Partner",
      initials: (newPartner.name || "NP")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      avatarBg: "bg-[#10B981]",
      role: "Partner",
      email: newPartner.email || "partner@example.com",
      phone: newPartner.phone || "+1 654 000 0000",
      status: "Active",
      dateAdded: "Just now",
    };

    setPartners((prev) => [created, ...prev]);
    toast.success("New partner added successfully!");
  };

  const handleUpdatePartner = (updated: PartnerRecord) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleRemove = (id: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    toast.success("Partner removed successfully");
  };

  const handleOpenView = (partner: PartnerRecord) => {
    setSelectedPartner(partner);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (partner: PartnerRecord) => {
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
  };

  // Filter partners based on search
  const filteredPartners = partners.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination (10 per page)
  const totalItems = filteredPartners.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPartners = filteredPartners.slice(
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
                <th className="py-4 px-4">CONTACT</th>
                <th className="py-4 px-4">DATE ADDED</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPartners.length > 0 ? (
                paginatedPartners.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Partner Avatar + Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-full ${row.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {row.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            #{row.id}
                          </span>
                        </div>
                      </div>
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
                            onClick={() => handleOpenView(row)}
                            className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 text-slate-500" />
                            <span>View Details</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(row)}
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No partners found matching your search.
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

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPartner={handleAddPartner}
      />

      {/* View Partner Details Modal */}
      <ViewPartnerModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        partner={selectedPartner}
      />

      {/* Edit Partner Modal */}
      <EditPartnerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        partner={selectedPartner}
        onUpdatePartner={handleUpdatePartner}
      />
    </div>
  );
}
