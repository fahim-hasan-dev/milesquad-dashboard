"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { masterAdminsList, AdminRecord } from "@/demoData/adminsManagementData";
import AddAdminModal from "@/components/modals/AddAdminModal";
import EditAdminModal from "@/components/modals/EditAdminModal";
import SuspendUserModal from "@/components/modals/SuspendUserModal";
import DeleteModal from "@/components/modals/DeleteModal";

const ITEMS_PER_PAGE = 10;

export default function AdminsTable() {
  const [admins, setAdmins] = useState<AdminRecord[]>(masterAdminsList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRecord | null>(null);

  // Password visibility map per row
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Add Admin
  const handleAddAdmin = (newAdminData: { name: string; email: string; password: string }) => {
    const newAdmin: AdminRecord = {
      id: `ADM-${(admins.length + 1).toString().padStart(3, "0")}`,
      name: newAdminData.name,
      email: newAdminData.email,
      password: newAdminData.password,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAdmins((prev) => [newAdmin, ...prev]);
  };

  // Edit Admin
  const handleUpdateAdmin = (updatedAdmin: AdminRecord) => {
    setAdmins((prev) =>
      prev.map((adm) => (adm.id === updatedAdmin.id ? updatedAdmin : adm))
    );
  };

  // Toggle Suspend Status
  const handleToggleSuspend = (admin: AdminRecord) => {
    const newStatus = admin.status === "Active" ? "Suspended" : "Active";
    setAdmins((prev) =>
      prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } : a))
    );
    toast.success(
      `Admin status updated to ${newStatus}`
    );
  };

  // Delete Admin
  const handleDeleteAdmin = async (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    toast.success("Admin removed");
  };

  // Filtering
  const filteredAdmins = admins.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      a.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination (10 items per page)
  const totalItems = filteredAdmins.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate pagination page numbers matching UsersTable
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
      {/* Top Search & Filter Bar - Same as Users Table */}
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
                  setStatusFilter("Suspended");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                Suspended
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

      {/* Main Table Card Container - Same as Users Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">ADMIN</th>
                <th className="py-4 px-4">EMAIL</th>
                <th className="py-4 px-4">PASSWORD</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAdmins.length > 0 ? (
                paginatedAdmins.map((row) => {
                  const isPasswordVisible = visiblePasswords[row.id] || false;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Admin Profile Cell */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] border border-slate-100 text-[#0284C7] font-extrabold flex items-center justify-center text-sm shrink-0">
                            {row.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {row.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                              ID: {row.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email Cell */}
                      <td className="py-4 px-4 font-mono text-slate-700 text-xs md:text-sm font-semibold">
                        {row.email}
                      </td>

                      {/* Password Cell */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {isPasswordVisible
                              ? row.password || "••••••••"
                              : "••••••••"}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(row.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
                            title={isPasswordVisible ? "Hide password" : "Show password"}
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
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
                              className={`flex items-center gap-2.5 text-xs font-semibold py-2 cursor-pointer ${
                                row.status === "Active"
                                  ? "text-[#D97706]"
                                  : "text-[#10B981]"
                              }`}
                            >
                              {row.status === "Active" ? (
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
                            <DeleteModal
                              itemId={row.id}
                              title="Remove Admin Account?"
                              description={`Are you sure you want to permanently remove administrator account for ${row.name}?`}
                              action={handleDeleteAdmin}
                              triggerBtn={
                                <div className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer w-full text-left">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span>Remove Admin</span>
                                </div>
                              }
                            />
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

      {/* Pagination Controls - Same as Users Table (rounded-full circular buttons) */}
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

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAdmin={handleAddAdmin}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        admin={selectedAdmin}
        onUpdateAdmin={handleUpdateAdmin}
      />

      {/* Suspend / Activate Admin Modal */}
      {selectedAdmin && (
        <SuspendUserModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onConfirm={() => handleToggleSuspend(selectedAdmin)}
          userName={selectedAdmin.name}
        />
      )}
    </div>
  );
}
