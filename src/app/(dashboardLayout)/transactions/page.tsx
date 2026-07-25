/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const initialTransactions = [
  {
    id: "TXN-001284",
    customer: "Metro Mart",
    initials: "MM",
    avatarBg: "bg-[#06B6D4]",
    amount: "12 500 XOF",
    method: "Mobile Money",
    methodIcon: Smartphone,
    status: "Completed",
    date: "Jun 28, 2025",
  },
  {
    id: "TXN-001283",
    customer: "Fresh Farms LLC",
    initials: "FF",
    avatarBg: "bg-[#10B981]",
    amount: "8 750 XOF",
    method: "Bank Transfer",
    methodIcon: Building,
    status: "Completed",
    date: "Jun 27, 2025",
  },
  {
    id: "TXN-001282",
    customer: "City Grocers",
    initials: "CG",
    avatarBg: "bg-[#3B82F6]",
    amount: "5 200 XOF",
    method: "Mobile Money",
    methodIcon: Smartphone,
    status: "Pending",
    date: "Jun 27, 2025",
  },
  {
    id: "TXN-001281",
    customer: "Grain Masters",
    initials: "GM",
    avatarBg: "bg-[#EF4444]",
    amount: "19 800 XOF",
    method: "Card",
    methodIcon: CreditCard,
    status: "Failed",
    date: "Jun 26, 2025",
  },
  {
    id: "TXN-001280",
    customer: "Valley Region Co.",
    initials: "VR",
    avatarBg: "bg-[#A855F7]",
    amount: "6 300 XOF",
    method: "Cash",
    methodIcon: Banknote,
    status: "Completed",
    date: "Jun 26, 2025",
  },
  {
    id: "TXN-001279",
    customer: "North Hills Supply",
    initials: "NH",
    avatarBg: "bg-[#06B6D4]",
    amount: "14 200 XOF",
    method: "Mobile Money",
    methodIcon: Smartphone,
    status: "Completed",
    date: "Jun 25, 2025",
  },
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<"transactions" | "payouts">("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const handleExport = () => {
    toast.success("Transactions exported to CSV!");
  };

  const filteredTransactions = initialTransactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || txn.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <ArrowLeftRight className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Transactions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-normal">
            Monitor all payment transactions and rider / partner payouts.
          </p>
        </div>
      </div>

      {/* Top Sub-Tabs Switcher */}
      <div className="bg-slate-100/70 p-1.5 rounded-2xl w-fit flex items-center gap-2 border border-slate-200/60">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === "transactions"
              ? "bg-[#10B981] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Payment Transactions</span>
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
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
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              67 650 XOF
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              Completed transactions
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            <span>+12.5% this month</span>
          </span>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              2
            </h2>
            <span className="text-xs text-slate-400 font-medium block">
              Awaiting confirmation
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>2 new today</span>
          </span>
        </div>

        {/* Card 3: Failed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Failed
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              2
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
              placeholder="Search reference or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981] placeholder:text-slate-300 shadow-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-11 bg-white border border-slate-200 px-4 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
              <span>{statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => setStatusFilter("All")} className="text-xs font-semibold">
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Completed")} className="text-xs font-semibold">
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Pending")} className="text-xs font-semibold">
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Failed")} className="text-xs font-semibold">
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer self-end sm:self-auto"
        >
          <Download className="h-4 w-4 text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="w-full overflow-x-auto">
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
              {filteredTransactions.map((row) => {
                const MethodIcon = row.methodIcon;

                return (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* REFERENCE */}
                    <td className="py-4 px-4 text-xs font-semibold text-[#10B981]">
                      {row.id}
                    </td>

                    {/* CUSTOMER */}
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

                    {/* AMOUNT */}
                    <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                      {row.amount}
                    </td>

                    {/* METHOD */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100/80 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/50">
                        <MethodIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{row.method}</span>
                      </span>
                    </td>

                    {/* STATUS */}
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

                    {/* DATE */}
                    <td className="py-4 px-4 text-xs font-medium text-slate-500">
                      {row.date}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl shadow-lg border border-slate-100">
                          <DropdownMenuItem
                            onClick={() => toast.success(`Viewing transaction ${row.id}`)}
                            className="text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                          >
                            View Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
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
    </div>
  );
}
