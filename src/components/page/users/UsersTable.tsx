import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExportDataModal from "@/components/modals/ExportDataModal";
import DeleteModal from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import CopyButton from "@/components/common/CopyButton";
import Pagination from "@/components/common/Pagination";

interface UserItem {
  id: string;
  userId?: string;
  name: string;
  email: string;
  contact: string;
  location: string;
  role: string;
  status: string;
  avatar: string;
  createdAt?: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let query = `/user?role=customer&page=${currentPage}&limit=10`;
    if (searchTerm.trim()) {
      query += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
    }
    if (statusFilter !== "All") {
      const statusValue = statusFilter === "Suspended" ? "restricted" : statusFilter.toLowerCase();
      query += `&status=${statusValue}`;
    }

    try {
      const res = await myFetch(query);
      if (res.success && res.data) {
        const rawUsers = res.data.users || [];
        const formattedUsers: UserItem[] = rawUsers.map((u: any) => {
          const rawStatus = (u.status || "").toLowerCase();
          const displayStatus =
            rawStatus === "active"
              ? "Active"
              : rawStatus === "restricted" || rawStatus === "blocked"
              ? "Suspended"
              : rawStatus === "pending"
              ? "Pending"
              : "Active";

          return {
            id: u._id,
            userId: u.userId || u._id,
            name: u.fullName || u.name || "N/A",
            email: u.email || "",
            contact: u.phone || "N/A",
            location: u.location || u.address || "N/A",
            role: "Customer",
            status: displayStatus,
            avatar: u.image ? getImageUrl(u.image) : "",
            createdAt: u.createdAt,
          };
        });

        setUsers(formattedUsers);
        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPage || 1);
        }
      } else {
        toast.error(res.message || "Failed to load users data");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);
    toast.loading("Removing user...", { id: "remove-user" });
    try {
      const res = await myFetch(`/user/${deleteUserId}`, { method: "DELETE" });
      if (res.success) {
        toast.success("User removed successfully", { id: "remove-user" });
        setDeleteUserId(null);
        fetchUsers();
      } else {
        toast.error(res.message || res.error || "Failed to remove user", { id: "remove-user" });
      }
    } catch {
      toast.error("Error removing user", { id: "remove-user" });
    } finally {
      setIsDeleting(false);
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

          {/* Export Data Action Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="h-11 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-5 rounded-xl transition-all shadow-none cursor-pointer flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Download Users Data"
        filterLabel="User Status"
        filterOptions={[
          { label: "All Statuses", value: "ALL" },
          { label: "Active", value: "Active" },
          { label: "Suspended", value: "Suspended" },
          { label: "Pending", value: "Pending" },
          { label: "Inactive", value: "Inactive" },
        ]}
      />

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
                      <span>Loading customers data...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Profile Cell */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {row.avatar ? (
                          <Image
                            src={row.avatar}
                            alt={row.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#10B981] text-white font-black flex items-center justify-center text-base shrink-0 shadow-sm">
                            {(row.name || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {row.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5 font-medium">
                            <span>#{row.userId || row.id.slice(-6)}</span>
                            <CopyButton text={row.userId || row.id} label="User ID" />
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
                            onClick={() => setDeleteUserId(row.id)}
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

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteUserId)}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Remove Customer Account?"
        description="Are you sure you want to remove this user? This action cannot be undone."
        actionBtnText="Remove User"
      />
    </div>
  );
}
