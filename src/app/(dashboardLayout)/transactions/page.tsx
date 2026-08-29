"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  Search,
  ChevronDown,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Smartphone,
  Building,
  Banknote,
  MoreHorizontal,
  ArrowUpRight,
  User,
  Building2,
  FileText,
  Loader2,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ViewReceiptModal from "@/components/modals/ViewReceiptModal";
import ExportDataModal from "@/components/modals/ExportDataModal";
import { BASE_URL } from "@/config/env-config";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import Pagination from "@/components/common/Pagination";
import CopyButton from "@/components/common/CopyButton";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";

interface TransactionItem {
  id: string;
  transactionId: string;
  user: {
    id: string;
    userId?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
  };
  parcel?: {
    id: string;
    parcelId: string;
    goodType: string;
    totalDeliveryFee: number;
  };
  amount: number;
  type: string;
  status: string;
  paymentMethod: string;
  accountDetails: string;
  description: string;
  rejectReason?: string;
  date: string;
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<"transactions" | "payouts">("transactions");
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Reject Payout Modal State
  const [rejectPayoutItem, setRejectPayoutItem] = useState<TransactionItem | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const [selectedReceiptData, setSelectedReceiptData] = useState<{
    id: string;
    customerOrRecipient: string;
    type?: string;
    amount: string;
    method: string;
    status: string;
    date: string;
  } | null>(null);

  // Overall dynamic stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDisbursed: 0,
    pendingPaymentsCount: 0,
    processingPayoutsCount: 0,
    failedPaymentsCount: 0,
    failedPayoutsCount: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const [paymentRes, payoutRes] = await Promise.all([
        myFetch("/transaction?type=payment&limit=1000"),
        myFetch("/transaction?type=payout&limit=1000"),
      ]);

      const payments: any[] = paymentRes?.data?.data || paymentRes?.data || [];
      const payouts: any[] = payoutRes?.data?.data || payoutRes?.data || [];

      const totalRev = payments
        .filter((p: any) => p.status === "completed")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      const totalDisb = payouts
        .filter((p: any) => p.status === "completed")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      const pendingPay = payments.filter((p: any) => p.status === "pending").length;
      const procPayout = payouts.filter((p: any) => p.status === "pending" || p.status === "processing").length;

      const failedPay = payments.filter((p: any) => p.status === "failed" || p.status === "cancelled").length;
      const failedPayout = payouts.filter((p: any) => p.status === "failed" || p.status === "rejected").length;

      setStats({
        totalRevenue: totalRev,
        totalDisbursed: totalDisb,
        pendingPaymentsCount: pendingPay,
        processingPayoutsCount: procPayout,
        failedPaymentsCount: failedPay,
        failedPayoutsCount: failedPayout,
      });
    } catch (err) {
      console.error("Error fetching transaction stats:", err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.set("type", activeTab === "transactions" ? "payment" : "payout");
    queryParams.set("page", currentPage.toString());
    queryParams.set("limit", "10");
    queryParams.set("sort", "-createdAt");

    if (searchTerm.trim()) {
      queryParams.set("searchTerm", searchTerm.trim());
    }

    if (statusFilter !== "All") {
      queryParams.set("status", statusFilter.toLowerCase());
    }

    try {
      const res = await myFetch(`/transaction?${queryParams.toString()}`);
      if (res.success && res.data) {
        const rawList = res.data.data || res.data.result || [];
        const formatted: TransactionItem[] = rawList.map((t: any) => {
          const userData = t.user || {};
          const parcelData = t.parcel || {};

          return {
            id: t._id,
            transactionId:
              t.transactionId && !t.transactionId.startsWith("pi_")
                ? t.transactionId
                : `MS-TXN-${(t._id || "").slice(-7).toUpperCase()}`,
            user: {
              id: userData._id || "",
              userId: userData.userId || userData._id,
              name: userData.fullName || userData.name || "Customer",
              email: userData.email || "",
              phone: userData.phone || "N/A",
              role: (userData.role || "customer").toLowerCase(),
              avatar: userData.image ? getImageUrl(userData.image) : "",
            },
            parcel: parcelData._id
              ? {
                  id: parcelData._id,
                  parcelId: parcelData.parcelId || parcelData._id,
                  goodType: parcelData.goodType || "Parcel",
                  totalDeliveryFee: parcelData.totalDeliveryFee || t.amount || 0,
                }
              : undefined,
            amount: t.amount || 0,
            type: t.type || (activeTab === "transactions" ? "payment" : "payout"),
            status: (t.status || "pending").toLowerCase(),
            paymentMethod: t.paymentMethod || "Cash",
            accountDetails: t.accountDetails || "N/A",
            description: t.description || "",
            rejectReason: t.rejectReason || "",
            date: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          };
        });

        setTransactions(formatted);
        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPage || res.data.meta.pageCount || 1);
          setTotalItems(res.data.meta.total || res.data.meta.totalDoc || formatted.length);
        }
      } else {
        toast.error(res.message || "Failed to load transactions");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Error loading transaction records");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleApprovePayout = async (id: string) => {
    toast.loading("Processing payout approval...", { id: "payout-status" });
    try {
      const res = await myFetch(`/transaction/payout-status/${id}`, {
        method: "PATCH",
        body: { status: "completed" },
      });
      if (res.success) {
        toast.success("Payout approved and processed successfully!", { id: "payout-status" });
        fetchTransactions();
        fetchStats();
      } else {
        toast.error(res.message || res.error || "Failed to approve payout", { id: "payout-status" });
      }
    } catch {
      toast.error("Error updating payout status", { id: "payout-status" });
    }
  };

  const handleConfirmRejectPayout = async (reason: string) => {
    if (!rejectPayoutItem) return;
    setIsRejecting(true);
    toast.loading("Rejecting payout request...", { id: "payout-status" });
    try {
      const res = await myFetch(`/transaction/payout-status/${rejectPayoutItem.id}`, {
        method: "PATCH",
        body: {
          status: "rejected",
          rejectReason: reason,
        },
      });
      if (res.success) {
        toast.success("Payout request rejected successfully!", { id: "payout-status" });
        setRejectPayoutItem(null);
        fetchTransactions();
        fetchStats();
      } else {
        toast.error(res.message || res.error || "Failed to reject payout", { id: "payout-status" });
      }
    } catch {
      toast.error("Error rejecting payout request", { id: "payout-status" });
    } finally {
      setIsRejecting(false);
    }
  };

  const getMethodIcon = (method: string) => {
    const m = (method || "").toLowerCase();
    if (m.includes("mobile") || m.includes("momo") || m.includes("wave")) return Smartphone;
    if (m.includes("bank") || m.includes("transfer")) return Building;
    if (m.includes("card") || m.includes("stripe")) return CreditCard;
    return Banknote;
  };

  const handleOpenReceipt = (t: TransactionItem) => {
    setSelectedReceiptData({
      id: t.transactionId,
      customerOrRecipient: t.user.name,
      type: t.user.role === "driver" ? "Rider" : "Customer",
      amount: `$${t.amount.toFixed(2)} XOF`,
      method: t.paymentMethod,
      status: t.status === "completed" ? "Completed" : t.status === "pending" ? "Pending" : "Failed",
      date: t.date,
    });
    setIsReceiptModalOpen(true);
  };

  const handleExportTransactions = async (exportParams: {
    startDate: string;
    endDate: string;
    filter: string;
  }) => {
    const isPayout = activeTab === "payouts";
    const label = isPayout ? "payouts" : "transactions";
    toast.loading(`Preparing ${label} export...`, { id: "export-transactions" });
    try {
      const token =
        (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
        (typeof document !== "undefined" &&
          document.cookie.match(/(?:^|; )accessToken=([^;]*)/)?.[1]) ||
        "";

      const queryParams = new URLSearchParams();
      queryParams.set("type", isPayout ? "PAYOUT" : "PAYMENT");
      if (exportParams.startDate) queryParams.set("startDate", exportParams.startDate);
      if (exportParams.endDate) queryParams.set("endDate", exportParams.endDate);
      if (exportParams.filter) queryParams.set("filter", exportParams.filter);

      const response = await fetch(`${BASE_URL}/transaction/export?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to export ${label} data`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileNamePrefix = isPayout ? "Payouts_Export" : "Transactions_Export";
      link.download = `${fileNamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${isPayout ? "Payouts" : "Transactions"} data exported successfully!`, {
        id: "export-transactions",
      });
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error(err?.message || "Failed to export data", { id: "export-transactions" });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center shrink-0">
          <ArrowLeftRight className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Transactions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-normal mt-0.5">
            Monitor all payment transactions and rider / partner payouts.
          </p>
        </div>
      </div>

      {/* Top Sub-Tabs Switcher */}
      <div className="bg-slate-100/70 p-1.5 rounded-2xl w-fit flex items-center gap-2 border border-slate-200/60">
        <button
          onClick={() => {
            setActiveTab("transactions");
            setCurrentPage(1);
            setStatusFilter("All");
          }}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "transactions"
              ? "bg-[#10B981] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Payment Transactions</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("payouts");
            setCurrentPage(1);
            setStatusFilter("All");
          }}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "payouts"
              ? "bg-[#10B981] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          <span>Payouts</span>
        </button>
      </div>

      {/* 3 Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Revenue / Total Disbursed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {activeTab === "transactions" ? "Total Revenue" : "Total Disbursed"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {activeTab === "transactions"
                ? `$${stats.totalRevenue.toLocaleString()} XOF`
                : `$${stats.totalDisbursed.toLocaleString()} XOF`}
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              {activeTab === "transactions" ? "Completed transactions" : "Completed payouts"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            <span>Real-time</span>
          </span>
        </div>

        {/* Card 2: Pending / Processing */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {activeTab === "transactions" ? "Pending Payments" : "Processing Payouts"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {activeTab === "transactions" ? stats.pendingPaymentsCount : stats.processingPayoutsCount}
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              Awaiting confirmation
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>Active requests</span>
          </span>
        </div>

        {/* Card 3: Failed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Failed / Rejected
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {activeTab === "transactions" ? stats.failedPaymentsCount : stats.failedPayoutsCount}
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              Unsuccessful records
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
            <TrendingDown className="h-3 w-3" />
            <span>Needs attention</span>
          </span>
        </div>
      </div>

      {/* Search Bar & Export Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search & Filter Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === "transactions"
                  ? "Search transaction ID or customer..."
                  : "Search payout ID or recipient..."
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
              <span>{statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => { setStatusFilter("All"); setCurrentPage(1); }} className="text-xs font-semibold cursor-pointer">
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setStatusFilter("Completed"); setCurrentPage(1); }} className="text-xs font-semibold cursor-pointer">
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setStatusFilter("Pending"); setCurrentPage(1); }} className="text-xs font-semibold cursor-pointer">
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setStatusFilter("Failed"); setCurrentPage(1); }} className="text-xs font-semibold cursor-pointer">
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-none cursor-pointer self-end sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Main Transactions / Payouts Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
          {activeTab === "transactions" ? (
            /* Payment Transactions Table */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">TRANSACTION ID</th>
                  <th className="py-4 px-4">CUSTOMER</th>
                  <th className="py-4 px-4">AMOUNT</th>
                  <th className="py-4 px-4">METHOD</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">DATE</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
                        <span>Loading payment transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((row) => {
                    const MethodIcon = getMethodIcon(row.paymentMethod);

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#10B981]">
                            <span>#{row.transactionId}</span>
                            <CopyButton text={row.transactionId} label="Transaction ID" />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {row.user.avatar ? (
                              <Image
                                src={row.user.avatar}
                                alt={row.user.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                {(row.user.name || "C").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <span className="text-xs md:text-sm font-bold text-slate-900 block leading-tight">
                                {row.user.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                #{row.user.userId || row.user.id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                          ${row.amount.toFixed(2)} XOF
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100/80 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/50">
                            <MethodIcon className="h-3.5 w-3.5 text-slate-400" />
                            <span>{row.paymentMethod}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {row.status === "completed" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : row.status === "pending" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Pending</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Failed</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs font-medium text-slate-500">
                          {row.date}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                              <MoreHorizontal className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl shadow-lg border border-slate-100">
                              <DropdownMenuItem
                                onClick={() => handleOpenReceipt(row)}
                                className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-slate-400" />
                                <span>View Receipt</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-sm">
                      No payment transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* Payouts Table */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">PAYOUT ID</th>
                  <th className="py-4 px-4">RECIPIENT</th>
                  <th className="py-4 px-4">ROLE</th>
                  <th className="py-4 px-4">AMOUNT</th>
                  <th className="py-4 px-4">ACCOUNT DETAILS</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">DATE</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
                        <span>Loading payout records...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((row) => {
                    const isDriver = row.user.role === "driver";

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#10B981]">
                            <span>#{row.transactionId}</span>
                            <CopyButton text={row.transactionId} label="Payout ID" />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {row.user.avatar ? (
                              <Image
                                src={row.user.avatar}
                                alt={row.user.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                {(row.user.name || "D").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <span className="text-xs md:text-sm font-bold text-slate-900 block leading-tight">
                                {row.user.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                #{row.user.userId || row.user.id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                            {isDriver ? (
                              <User className="h-3 w-3 text-slate-400" />
                            ) : (
                              <Building2 className="h-3 w-3 text-slate-400" />
                            )}
                            <span>{row.user.role || "Driver"}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                          ${row.amount.toFixed(2)} XOF
                        </td>
                        <td className="py-4 px-4 text-xs font-medium text-slate-600 max-w-[180px] truncate">
                          {row.accountDetails || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          {row.status === "completed" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : row.status === "pending" || row.status === "processing" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Pending</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs font-medium text-slate-500">
                          {row.date}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                              <MoreHorizontal className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1">
                              <DropdownMenuItem
                                onClick={() => handleOpenReceipt(row)}
                                className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-slate-400" />
                                <span>View Receipt</span>
                              </DropdownMenuItem>

                              {(row.status === "pending" || row.status === "processing") && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleApprovePayout(row.id)}
                                    className="flex items-center gap-2 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                                  >
                                    <Check className="h-4 w-4 text-[#10B981]" />
                                    <span>Approve Payout</span>
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => setRejectPayoutItem(row)}
                                    className="flex items-center gap-2 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                    <span>Reject Payout</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium text-sm">
                      No payout records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      {/* View Receipt Modal */}
      <ViewReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        data={selectedReceiptData}
      />

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={activeTab === "transactions" ? "Download Transactions Data" : "Download Payouts Data"}
        filterLabel={activeTab === "transactions" ? "Payment Status" : "Payout Status"}
        filterOptions={[
          { label: "All Statuses", value: "ALL" },
          { label: "Completed", value: "Completed" },
          { label: activeTab === "transactions" ? "Pending" : "Processing", value: activeTab === "transactions" ? "Pending" : "Processing" },
          { label: "Failed", value: "Failed" },
        ]}
        onDownload={handleExportTransactions}
      />

      {/* Reject Payout Modal */}
      <RejectReasonModal
        isOpen={Boolean(rejectPayoutItem)}
        onClose={() => setRejectPayoutItem(null)}
        onConfirm={handleConfirmRejectPayout}
        loading={isRejecting}
        title="Reject Payout Request"
        driverName={rejectPayoutItem?.user.name || "Driver"}
      />
    </div>
  );
}
