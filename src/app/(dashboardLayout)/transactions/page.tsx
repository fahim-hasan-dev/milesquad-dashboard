"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftRight,
  Search,
  ChevronDown,
  Download,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ViewReceiptModal from "@/components/modals/ViewReceiptModal";
import ExportDataModal from "@/components/modals/ExportDataModal";
import RejectReasonModal from "@/components/modals/RejectReasonModal";
import Pagination from "@/components/common/Pagination";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { BASE_URL } from "@/config/env-config";
import { getImageUrl } from "@/utils/imageUrl";
import { TransactionItem } from "@/components/page/transactions/types";
import TransactionStatsCards from "@/components/page/transactions/TransactionStatsCards";
import PaymentsTable from "@/components/page/transactions/PaymentsTable";
import PayoutsTable from "@/components/page/transactions/PayoutsTable";

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
      const procPayout = payouts.filter(
        (p: any) => p.status === "pending" || p.status === "processing"
      ).length;

      const failedPay = payments.filter(
        (p: any) => p.status === "failed" || p.status === "cancelled"
      ).length;
      const failedPayout = payouts.filter(
        (p: any) => p.status === "failed" || p.status === "rejected"
      ).length;

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
                  totalDeliveryFee:
                    parcelData.deliveryFee ||
                    parcelData.totalDeliveryFee ||
                    parcelData.totalToPay ||
                    t.amount ||
                    0,
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
        toast.error(res.message || res.error || "Failed to approve payout", {
          id: "payout-status",
        });
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
        toast.error(res.message || res.error || "Failed to reject payout", {
          id: "payout-status",
        });
      }
    } catch {
      toast.error("Error rejecting payout request", { id: "payout-status" });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleOpenReceipt = (t: TransactionItem) => {
    setSelectedReceiptData({
      id: t.transactionId,
      customerOrRecipient: t.user.name,
      type: t.user.role === "driver" ? "Rider" : "Customer",
      amount: `${t.amount.toFixed(2)} XOF`,
      method: t.paymentMethod,
      status:
        t.status === "completed"
          ? "Completed"
          : t.status === "pending"
          ? "Pending"
          : "Failed",
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

      const response = await fetch(
        `${BASE_URL}/transaction/export?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

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

      toast.success(
        `${isPayout ? "Payouts" : "Transactions"} data exported successfully!`,
        { id: "export-transactions" }
      );
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
      <TransactionStatsCards activeTab={activeTab} stats={stats} />

      {/* Search Bar & Export Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  setStatusFilter("Completed");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                Completed
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
                  setStatusFilter("Failed");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold cursor-pointer"
              >
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
            <PaymentsTable
              transactions={transactions}
              loading={loading}
              onOpenReceipt={handleOpenReceipt}
            />
          ) : (
            <PayoutsTable
              transactions={transactions}
              loading={loading}
              onOpenReceipt={handleOpenReceipt}
              onApprovePayout={handleApprovePayout}
              onRejectPayout={(item) => setRejectPayoutItem(item)}
            />
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
        title={
          activeTab === "transactions"
            ? "Download Transactions Data"
            : "Download Payouts Data"
        }
        filterLabel={
          activeTab === "transactions" ? "Payment Status" : "Payout Status"
        }
        filterOptions={[
          { label: "All Statuses", value: "ALL" },
          { label: "Completed", value: "Completed" },
          {
            label: activeTab === "transactions" ? "Pending" : "Processing",
            value: activeTab === "transactions" ? "Pending" : "Processing",
          },
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
