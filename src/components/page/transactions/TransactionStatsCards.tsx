import React from "react";
import { TrendingUp, Clock, TrendingDown } from "lucide-react";

interface TransactionStatsCardsProps {
  activeTab: "transactions" | "payouts";
  stats: {
    totalRevenue: number;
    totalDisbursed: number;
    pendingPaymentsCount: number;
    processingPayoutsCount: number;
    failedPaymentsCount: number;
    failedPayoutsCount: number;
  };
}

export default function TransactionStatsCards({
  activeTab,
  stats,
}: TransactionStatsCardsProps) {
  const isTxn = activeTab === "transactions";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Card 1: Total Revenue / Total Disbursed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isTxn ? "Total Revenue" : "Total Disbursed"}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            {isTxn
              ? `${stats.totalRevenue.toLocaleString()} XOF`
              : `${stats.totalDisbursed.toLocaleString()} XOF`}
          </h2>
          <span className="text-xs text-slate-400 font-medium block">
            {isTxn ? "Completed transactions" : "Completed payouts"}
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
            {isTxn ? "Pending Payments" : "Processing Payouts"}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            {isTxn ? stats.pendingPaymentsCount : stats.processingPayoutsCount}
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

      {/* Card 3: Failed / Rejected */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Failed / Rejected
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            {isTxn ? stats.failedPaymentsCount : stats.failedPayoutsCount}
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
  );
}
