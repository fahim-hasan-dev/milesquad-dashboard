"use client";

import React, { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  User,
  Building2,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ViewReceiptModal from "@/components/modals/ViewReceiptModal";
import ExportDataModal from "@/components/modals/ExportDataModal";
import Pagination from "@/components/common/Pagination";
import {
  masterPaymentTransactions,
  masterPayoutsList,
  PaymentTransactionRecord,
  PayoutRecord,
} from "@/demoData/transactionsManagementData";

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<"transactions" | "payouts">("transactions");
  const [payments] = useState<PaymentTransactionRecord[]>(masterPaymentTransactions);
  const [payouts] = useState<PayoutRecord[]>(masterPayoutsList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedReceiptData, setSelectedReceiptData] = useState<{
    id: string;
    customerOrRecipient: string;
    type?: string;
    amount: string;
    method: string;
    status: string;
    date: string;
  } | null>(null);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Mobile Money":
        return Smartphone;
      case "Bank Transfer":
        return Building;
      case "Card":
        return CreditCard;
      case "Cash":
      default:
        return Banknote;
    }
  };

  const handleOpenReceipt = (data: {
    id: string;
    customerOrRecipient: string;
    type?: string;
    amount: string;
    method: string;
    status: string;
    date: string;
  }) => {
    setSelectedReceiptData(data);
    setIsReceiptModalOpen(true);
  };

  // Filter Payment Transactions
  const filteredPayments = payments.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || txn.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter Payouts
  const filteredPayouts = payouts.filter((po) => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      po.status === statusFilter ||
      (statusFilter === "Pending" && po.status === "Processing");

    return matchesSearch && matchesStatus;
  });

  // Pagination for current active tab
  const activeList = activeTab === "transactions" ? filteredPayments : filteredPayouts;
  const totalItems = activeList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = activeList.slice(startIndex, startIndex + ITEMS_PER_PAGE);



  // Calculate Stat Card Numbers
  const totalRevenueSum = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, curr) => acc + curr.rawAmount, 0)
    .toLocaleString();

  const totalPayoutsSum = payouts
    .filter((p) => p.status === "Completed")
    .reduce((acc, curr) => acc + curr.rawAmount, 0)
    .toLocaleString();

  const pendingPaymentsCount = payments.filter((p) => p.status === "Pending").length;
  const processingPayoutsCount = payouts.filter((p) => p.status === "Processing").length;

  const failedPaymentsCount = payments.filter((p) => p.status === "Failed").length;
  const failedPayoutsCount = payouts.filter((p) => p.status === "Failed").length;

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

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Revenue / Total Payouts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {activeTab === "transactions" ? "Total Revenue" : "Total Disbursed"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {activeTab === "transactions" ? `${totalRevenueSum} XOF` : `${totalPayoutsSum} XOF`}
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              {activeTab === "transactions" ? "Completed transactions" : "Completed payouts"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            <span>+12.5% this month</span>
          </span>
        </div>

        {/* Card 2: Pending / Processing */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {activeTab === "transactions" ? "Pending" : "Processing"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {activeTab === "transactions" ? pendingPaymentsCount : processingPayoutsCount}
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
              Failed
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {activeTab === "transactions" ? failedPaymentsCount : failedPayoutsCount}
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              Unsuccessful payments
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
            <TrendingDown className="h-3 w-3" />
            <span>-3% vs last week</span>
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
                  ? "Search reference or customer..."
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
              <DropdownMenuItem onClick={() => { setStatusFilter(activeTab === "transactions" ? "Pending" : "Processing"); setCurrentPage(1); }} className="text-xs font-semibold cursor-pointer">
                {activeTab === "transactions" ? "Pending" : "Processing"}
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
                  <th className="py-4 px-4">REFERENCE</th>
                  <th className="py-4 px-4">CUSTOMER</th>
                  <th className="py-4 px-4">AMOUNT</th>
                  <th className="py-4 px-4">METHOD</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">DATE</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(paginatedList as PaymentTransactionRecord[]).length > 0 ? (
                  (paginatedList as PaymentTransactionRecord[]).map((row) => {
                    const MethodIcon = getMethodIcon(row.method);

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4 text-xs font-semibold text-[#10B981]">
                          {row.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-9 rounded-full ${row.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                            >
                              {row.initials}
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-900">
                              {row.customer}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                          {row.amount}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100/80 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/50">
                            <MethodIcon className="h-3.5 w-3.5 text-slate-400" />
                            <span>{row.method}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {row.status === "Completed" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : row.status === "Pending" ? (
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
                                onClick={() =>
                                  handleOpenReceipt({
                                    id: row.id,
                                    customerOrRecipient: row.customer,
                                    amount: row.amount,
                                    method: row.method,
                                    status: row.status,
                                    date: row.date,
                                  })
                                }
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
                  <th className="py-4 px-4">TYPE</th>
                  <th className="py-4 px-4">AMOUNT</th>
                  <th className="py-4 px-4">METHOD</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">DATE</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(paginatedList as PayoutRecord[]).length > 0 ? (
                  (paginatedList as PayoutRecord[]).map((row) => {
                    const MethodIcon = getMethodIcon(row.method);

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4 text-xs font-semibold text-[#10B981]">
                          {row.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-9 rounded-full ${row.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                            >
                              {row.initials}
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-900">
                              {row.recipient}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {row.recipientType === "Rider" ? (
                              <User className="h-3 w-3 text-slate-400" />
                            ) : (
                              <Building2 className="h-3 w-3 text-slate-400" />
                            )}
                            <span>{row.recipientType}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                          {row.amount}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100/80 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/50">
                            <MethodIcon className="h-3.5 w-3.5 text-slate-400" />
                            <span>{row.method}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {row.status === "Completed" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : row.status === "Processing" ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Processing</span>
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
                                onClick={() =>
                                  handleOpenReceipt({
                                    id: row.id,
                                    customerOrRecipient: row.recipient,
                                    type: row.recipientType,
                                    amount: row.amount,
                                    method: row.method,
                                    status: row.status,
                                    date: row.date,
                                  })
                                }
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
      />
    </div>
  );
}
