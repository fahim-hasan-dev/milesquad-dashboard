"use client";

import StatCard from "@/components/page/analytics/cards/StatCard";
import SalesAnalyticsChart from "@/components/page/analytics/charts/SalesAnalyticsChart";
import UserDistributionChart from "@/components/page/analytics/charts/UserDistributionChart";
import LivePlatformMap from "@/components/page/analytics/LivePlatformMap";
import DeliveriesOverviewChart from "@/components/page/analytics/charts/DeliveriesOverviewChart";
import RevenueBreakdownChart from "@/components/page/analytics/charts/RevenueBreakdownChart";
import CompletedOrdersTable from "@/components/page/analytics/CompletedOrdersTable";
import { DollarSign, Users, Bike, PackageCheck, Calendar } from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Comprehensive metrics for finance and platform.
          </p>
        </div>

        <button className="self-start sm:self-auto flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>2026</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="TOTAL REVENUE"
          value="$42.50"
          icon={DollarSign}
        />
        <StatCard
          title="TOTAL USERS"
          value="100"
          icon={Users}
        />
        <StatCard
          title="TOTAL DRIVERS"
          value="200"
          icon={Bike}
        />
        <StatCard
          title="TOTAL DELIVERY"
          value="700"
          icon={PackageCheck}
        />
      </div>

      {/* Sales Analytics & User Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesAnalyticsChart />
        </div>
        <div className="lg:col-span-1">
          <UserDistributionChart />
        </div>
      </div>

      {/* Live Platform Map */}
      <LivePlatformMap />

      {/* Deliveries Overview & Revenue Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveriesOverviewChart />
        <RevenueBreakdownChart />
      </div>

      {/* Completed Orders Table */}
      <CompletedOrdersTable />
    </div>
  );
}
