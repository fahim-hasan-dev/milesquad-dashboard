"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddPartnerModal from "@/components/modals/AddPartnerModal";
import EditPartnerModal, { PartnerData } from "@/components/modals/EditPartnerModal";
import ViewPartnerModal from "@/components/modals/ViewPartnerModal";
import DeleteModal from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import CopyButton from "@/components/common/CopyButton";
import Pagination from "@/components/common/Pagination";

export default function PartnersTable() {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerData | null>(null);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", currentPage.toString());
      queryParams.set("limit", "10");
      if (searchTerm.trim()) {
        queryParams.set("searchTerm", searchTerm.trim());
      }

      const res = await myFetch(`/partner?${queryParams.toString()}`);
      if (res.success && res.data) {
        setPartners(res.data.data || []);
        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPage || 1);
          setTotalItems(res.data.meta.total || 0);
        }
      } else {
        setPartners([]);
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
      toast.error("Failed to load partners from server");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPartnerId, setDeletingPartnerId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenDelete = (id: string) => {
    setDeletingPartnerId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePartner = async () => {
    if (!deletingPartnerId) return;

    setDeleting(true);
    toast.loading("Removing partner...", { id: "delete-partner" });
    try {
      const res = await myFetch(`/partner/${deletingPartnerId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Partner removed successfully!", { id: "delete-partner" });
        setIsDeleteModalOpen(false);
        setDeletingPartnerId(null);
        fetchPartners();
      } else {
        toast.error(res.message || res.error || "Failed to remove partner", {
          id: "delete-partner",
        });
      }
    } catch {
      toast.error("Error removing partner", { id: "delete-partner" });
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenView = (partner: PartnerData) => {
    setSelectedPartner(partner);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (partner: PartnerData) => {
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
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
            placeholder="Search partners by name, email, phone..."
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-[#10B981]" />
                      <span className="text-xs font-medium">Loading partners from server...</span>
                    </div>
                  </td>
                </tr>
              ) : partners.length > 0 ? (
                partners.map((row) => {
                  const initials = (row.fullName || "PA")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const formattedDate = row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "N/A";

                  return (
                    <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Partner Avatar + Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {row.fullName}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-slate-400 font-medium">
                                #{row.partnerId || row._id.slice(-6)}
                              </span>
                              <CopyButton text={row.partnerId || row._id} label="Partner ID" />
                            </div>
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
                        {formattedDate}
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
                              onClick={() => handleOpenDelete(row._id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
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

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchPartners}
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
        onSuccess={fetchPartners}
      />

      {/* Delete Partner Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePartner}
        loading={deleting}
        title="Remove Partner"
        description="Are you sure you want to remove this partner? This partner will be deleted."
      />
    </div>
  );
}
