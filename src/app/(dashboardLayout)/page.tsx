/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/page/analytics/cards/StatCard";
import SalesAnalyticsChart from "@/components/page/analytics/charts/SalesAnalyticsChart";
import UserDistributionChart from "@/components/page/analytics/charts/UserDistributionChart";
import LivePlatformMap from "@/components/page/analytics/LivePlatformMap";
import DeliveriesOverviewChart from "@/components/page/analytics/charts/DeliveriesOverviewChart";
import RevenueBreakdownChart from "@/components/page/analytics/charts/RevenueBreakdownChart";
import CompletedOrdersTable from "@/components/page/analytics/CompletedOrdersTable";
import { DollarSign, Users, Bike, PackageCheck, Calendar, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { overviewDataByYearAndPeriod } from "@/data/overviewData";
import { myFetch } from "@/utils/myFetch";

export default function OverviewPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Jan - Jun");
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOverviewStats = async () => {
    setLoading(true);
    try {
      const res = await myFetch(`/admin-stats/overview?year=${selectedYear}`);
      if (res.success && res.data) {
        setApiData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch overview stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, [selectedYear]);

  // Fallback to static format if loading or missing
  const currentFallback =
    overviewDataByYearAndPeriod[selectedYear]?.[selectedPeriod] ||
    overviewDataByYearAndPeriod["2026"]["Jan - Jun"];

  // Real aggregated values
  const totalRevenue =
    apiData?.overview?.totalRevenue !== undefined
      ? `${Number(apiData.overview.totalRevenue).toLocaleString()} XOF`
      : currentFallback.stats.revenue.value;

  const totalUsers =
    apiData?.overview?.totalUsers !== undefined
      ? Number(apiData.overview.totalUsers).toLocaleString()
      : currentFallback.stats.users.value;

  const totalDrivers =
    apiData?.overview?.totalDrivers !== undefined
      ? Number(apiData.overview.totalDrivers).toLocaleString()
      : currentFallback.stats.drivers.value;

  const totalDelivery =
    apiData?.overview?.totalDelivery !== undefined
      ? Number(apiData.overview.totalDelivery).toLocaleString()
      : currentFallback.stats.deliveries.value;

  // Real Charts & Tables
  const salesChartData = apiData?.salesAnalytics
    ? apiData.salesAnalytics
    : currentFallback.salesAnalytics.chartData;

  const salesTotalRev = apiData?.salesAnalytics
    ? `${apiData.salesAnalytics
        .reduce((acc: number, curr: any) => acc + (curr.revenue || 0), 0)
        .toLocaleString()} XOF`
    : currentFallback.salesAnalytics.totalRevenue;

  const driverPct =
    apiData?.userDistribution?.driverPercentage !== undefined
      ? Number(apiData.userDistribution.driverPercentage)
      : currentFallback.userDistribution.driverPercent;

  const userPct =
    apiData?.userDistribution?.userPercentage !== undefined
      ? Number(apiData.userDistribution.userPercentage)
      : currentFallback.userDistribution.userPercent;

  const userDistData = apiData?.userDistribution?.data
    ? apiData.userDistribution.data
    : currentFallback.userDistribution.data;

  const deliveriesOverviewObj = apiData?.deliveriesOverview
    ? apiData.deliveriesOverview
    : currentFallback.deliveriesOverview;

  const completedOrdersList = apiData?.completedOrders
    ? apiData.completedOrders
    : currentFallback.completedOrders;

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

        {/* Interactive Year Selector & Refresh */}
        <div className="self-start sm:self-auto flex items-center gap-3">
          <button
            onClick={fetchOverviewStats}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            title="Refresh Analytics Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-500" : ""}`} />
          </button>

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
          value={totalRevenue}
          change={currentFallback.stats.revenue.change}
          isPositive={currentFallback.stats.revenue.isPositive}
          icon={DollarSign}
        />
        <StatCard
          title="TOTAL USERS"
          value={totalUsers}
          change={currentFallback.stats.users.change}
          isPositive={currentFallback.stats.users.isPositive}
          icon={Users}
        />
        <StatCard
          title="TOTAL DRIVERS"
          value={totalDrivers}
          change={currentFallback.stats.drivers.change}
          isPositive={currentFallback.stats.drivers.isPositive}
          icon={Bike}
        />
        <StatCard
          title="TOTAL DELIVERY"
          value={totalDelivery}
          change={currentFallback.stats.deliveries.change}
          isPositive={currentFallback.stats.deliveries.isPositive}
          icon={PackageCheck}
        />
      </div>

      {/* Sales Analytics & User Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesAnalyticsChart
            totalRevenue={salesTotalRev}
            chartData={salesChartData}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
        <div className="lg:col-span-1">
          <UserDistributionChart
            driverPercent={driverPct}
            userPercent={userPct}
            data={userDistData}
          />
        </div>
      </div>

      {/* Live Platform Map */}
      <LivePlatformMap />

      {/* Deliveries Overview & Revenue Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveriesOverviewChart
          total={deliveriesOverviewObj.total}
          data={deliveriesOverviewObj.data}
        />
        <RevenueBreakdownChart
          total={currentFallback.revenueBreakdown.total}
          data={currentFallback.revenueBreakdown.data}
        />
      </div>

      {/* Completed Orders Table */}
      <CompletedOrdersTable />
    </div>
  );
}
