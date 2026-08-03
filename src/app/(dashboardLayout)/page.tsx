"use client";

import { useState } from "react";
import StatCard from "@/components/page/analytics/cards/StatCard";
import SalesAnalyticsChart from "@/components/page/analytics/charts/SalesAnalyticsChart";
import UserDistributionChart from "@/components/page/analytics/charts/UserDistributionChart";
import LivePlatformMap from "@/components/page/analytics/LivePlatformMap";
import DeliveriesOverviewChart from "@/components/page/analytics/charts/DeliveriesOverviewChart";
import RevenueBreakdownChart from "@/components/page/analytics/charts/RevenueBreakdownChart";
import CompletedOrdersTable from "@/components/page/analytics/CompletedOrdersTable";
import { DollarSign, Users, Bike, PackageCheck, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { overviewDataByYearAndPeriod } from "@/data/overviewData";

export default function OverviewPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Jan - Jun");

  const currentData =
    overviewDataByYearAndPeriod[selectedYear]?.[selectedPeriod] ||
    overviewDataByYearAndPeriod["2026"]["Jan - Jun"];

  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Comprehensive metrics for finance and platform overview.
          </p>
        </div>

        {/* Interactive Year Selector */}
        <div className="self-start sm:self-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Filter Year:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[125px] bg-white border border-slate-200 h-10 rounded-xl text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors focus:ring-0">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                <SelectValue placeholder="Year" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-xl border border-slate-100 min-w-[125px]">
              <SelectItem value="2026" className="text-xs font-bold cursor-pointer">
                2026
              </SelectItem>
              <SelectItem value="2025" className="text-xs font-bold cursor-pointer">
                2025
              </SelectItem>
              <SelectItem value="2024" className="text-xs font-bold cursor-pointer">
                2024
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="TOTAL REVENUE"
          value={currentData.stats.revenue.value}
          change={currentData.stats.revenue.change}
          isPositive={currentData.stats.revenue.isPositive}
          icon={DollarSign}
        />
        <StatCard
          title="TOTAL USERS"
          value={currentData.stats.users.value}
          change={currentData.stats.users.change}
          isPositive={currentData.stats.users.isPositive}
          icon={Users}
        />
        <StatCard
          title="TOTAL DRIVERS"
          value={currentData.stats.drivers.value}
          change={currentData.stats.drivers.change}
          isPositive={currentData.stats.drivers.isPositive}
          icon={Bike}
        />
        <StatCard
          title="TOTAL DELIVERY"
          value={currentData.stats.deliveries.value}
          change={currentData.stats.deliveries.change}
          isPositive={currentData.stats.deliveries.isPositive}
          icon={PackageCheck}
        />
      </div>

      {/* Sales Analytics & User Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesAnalyticsChart
            totalRevenue={currentData.salesAnalytics.totalRevenue}
            chartData={currentData.salesAnalytics.chartData}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
        <div className="lg:col-span-1">
          <UserDistributionChart
            driverPercent={currentData.userDistribution.driverPercent}
            userPercent={currentData.userDistribution.userPercent}
            data={currentData.userDistribution.data}
          />
        </div>
      </div>

      {/* Live Platform Map */}
      <LivePlatformMap />

      {/* Deliveries Overview & Revenue Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveriesOverviewChart
          total={currentData.deliveriesOverview.total}
          data={currentData.deliveriesOverview.data}
        />
        <RevenueBreakdownChart
          total={currentData.revenueBreakdown.total}
          data={currentData.revenueBreakdown.data}
        />
      </div>

      {/* Completed Orders Table */}
      <CompletedOrdersTable orders={currentData.completedOrders} />
    </div>
  );
}
