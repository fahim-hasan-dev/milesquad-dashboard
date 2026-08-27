"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Loader2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import AddAdminModal from "@/components/modals/AddAdminModal";
import EditAdminModal, { AdminData } from "@/components/modals/EditAdminModal";
import SuspendUserModal from "@/components/modals/SuspendUserModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { myFetch } from "@/utils/myFetch";
import CopyButton from "@/components/common/CopyButton";
import Pagination from "@/components/common/Pagination";

export default function AdminsTable() {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [suspending, setSuspending] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", currentPage.toString());
      queryParams.set("limit", "10");
      if (searchTerm.trim()) {
        queryParams.set("searchTerm", searchTerm.trim());
      }
      if (statusFilter !== "All") {
        const statusVal = statusFilter === "Blocked" ? "restricted" : statusFilter.toLowerCase();
        queryParams.set("status", statusVal);
      }

      const res = await myFetch(`/admin?${queryParams.toString()}`);
      if (res.success && res.data) {
        const adminList = res.data.admins || res.data.data || (Array.isArray(res.data) ? res.data : []);
        const meta = res.data.meta;

        setAdmins(adminList);
        if (meta) {
          setTotalPages(meta.totalPage || meta.totalPages || 1);
          setTotalItems(meta.total || 0);
        }
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error("Failed to load admins from server");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Toggle Suspend Status
  const handleToggleSuspend = async () => {
    if (!selectedAdmin) return;

    const newStatus = selectedAdmin.status === "active" ? "blocked" : "active";
    setSuspending(true);
    toast.loading("Updating status...", { id: "suspend-admin" });

    try {
      const res = await myFetch(`/admin/${selectedAdmin._id}`, {
        method: "PATCH",
        body: { status: newStatus },
      });

      if (res.success) {
        toast.success(`Admin account status updated to ${newStatus}`, {
          id: "suspend-admin",
        });
        setIsSuspendModalOpen(false);
        fetchAdmins();
      } else {
        toast.error(res.message || res.error || "Failed to update status", {
          id: "suspend-admin",
        });
      }
    } catch {
      toast.error("Error updating status", { id: "suspend-admin" });
    } finally {
      setSuspending(false);
    }
  };

  // Delete Admin
  const handleOpenDelete = (id: string) => {
    setDeletingAdminId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAdmin = async () => {
    if (!deletingAdminId) return;

    setDeleting(true);
    toast.loading("Removing admin...", { id: "delete-admin" });
    try {
      const res = await myFetch(`/admin/${deletingAdminId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Admin removed successfully!", { id: "delete-admin" });
        setIsDeleteModalOpen(false);
        setDeletingAdminId(null);
        fetchAdmins();
      } else {
        toast.error(res.message || res.error || "Failed to remove admin", {
          id: "delete-admin",
        });
      }
    } catch {
      toast.error("Error removing admin", { id: "delete-admin" });
    } finally {
      setDeleting(false);
    }
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
            placeholder="Search admins by name, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter Dropdown */}
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
                  setStatusFilter("Blocked");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                Blocked
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add New Admin Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-11 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-6 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {/* Main Table Card Container */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">ADMIN</th>
                <th className="py-4 px-4">EMAIL / CONTACT</th>
                <th className="py-4 px-4">ROLE</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-[#10B981]" />
                      <span className="text-xs font-medium">Loading admins from server...</span>
                    </div>
                  </td>
                </tr>
              ) : admins.length > 0 ? (
                admins.map((row) => {
                  const isSuperAdmin = row.role === "SUPER_ADMIN";

                  return (
                    <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Admin Profile Cell */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E0F2FE] border border-slate-100 text-[#0284C7] font-extrabold flex items-center justify-center text-xs shrink-0">
                            {(row.fullName || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {row.fullName}
                            </h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[11px] text-slate-400 font-medium">
                                ID: #{row._id.slice(-6)}
                              </span>
                              <CopyButton text={row._id} label="Admin ID" />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email / Phone Cell */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="text-xs md:text-sm font-mono text-slate-700 font-semibold">
                            {row.email}
                          </div>
                          {row.phone && (
                            <div className="text-[11px] text-slate-400 font-medium">
                              {row.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Cell */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md ${isSuperAdmin
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-slate-100 text-slate-700"
                          }`}>
                          {isSuperAdmin ? (
                            <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                          ) : (
                            <Shield className="h-3.5 w-3.5 text-slate-500" />
                          )}
                          <span>{isSuperAdmin ? "Super Admin" : "Sub Admin"}</span>
                        </span>
                      </td>

                      {/* Status Cell */}
                      <td className="py-4 px-4">
                        {row.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>{row.status === "blocked" ? "Suspended" : row.status}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions Cell */}
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                            <MoreHorizontal className="h-5 w-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                            {/* Edit Admin */}
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAdmin(row);
                                setIsEditModalOpen(true);
                              }}
                              className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4 text-slate-500" />
                              <span>Edit Admin</span>
                            </DropdownMenuItem>

                            {/* Suspend / Activate Toggle */}
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAdmin(row);
                                setIsSuspendModalOpen(true);
                              }}
                              className={`flex items-center gap-2.5 text-xs font-semibold py-2 cursor-pointer ${row.status === "active"
                                  ? "text-[#D97706]"
                                  : "text-[#10B981]"
                                }`}
                            >
                              {row.status === "active" ? (
                                <>
                                  <XCircle className="h-4 w-4 text-[#D97706]" />
                                  <span>Suspend Admin</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                                  <span>Activate Admin</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            {/* Remove Admin */}
                            <DropdownMenuItem
                              onClick={() => handleOpenDelete(row._id)}
                              className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span>Remove Admin</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No admins found matching your search.
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

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchAdmins}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        admin={selectedAdmin}
        onSuccess={fetchAdmins}
      />

      {/* Suspend / Activate Admin Modal */}
      {selectedAdmin && (
        <SuspendUserModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onConfirm={handleToggleSuspend}
          userName={selectedAdmin.fullName}
        />
      )}

      {/* Delete Admin Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAdmin}
        loading={deleting}
        title="Remove Admin Account?"
        description="Are you sure you want to permanently remove this administrator account? This action cannot be undone."
      />
    </div>
  );
}
