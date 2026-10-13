/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StatCard from "@/components/page/analytics/cards/StatCard";
import CompletedOrdersTable from "@/components/page/analytics/CompletedOrdersTable";

const SalesAnalyticsChart = dynamic(
  () => import("@/components/page/analytics/charts/SalesAnalyticsChart"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[380px] animate-pulse flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-100 rounded" />
          <div className="h-8 w-44 bg-slate-100 rounded" />
        </div>
        <div className="h-48 w-full bg-slate-50 rounded-xl" />
      </div>
    ),
  }
);

const UserDistributionChart = dynamic(
  () => import("@/components/page/analytics/charts/UserDistributionChart"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[380px] animate-pulse flex flex-col justify-between">
        <div className="h-4 w-32 bg-slate-100 rounded" />
        <div className="size-44 mx-auto rounded-full bg-slate-100" />
        <div className="h-6 w-full bg-slate-50 rounded" />
      </div>
    ),
  }
);

const LivePlatformMap = dynamic(
  () => import("@/components/page/analytics/LivePlatformMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] rounded-2xl bg-white border border-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Loading live map...</span>
      </div>
    ),
  }
);

const DeliveriesOverviewChart = dynamic(
  () => import("@/components/page/analytics/charts/DeliveriesOverviewChart"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[260px] animate-pulse flex flex-col justify-between">
        <div className="h-4 w-36 bg-slate-100 rounded" />
        <div className="size-36 mx-auto rounded-full bg-slate-100" />
      </div>
    ),
  }
);

const RevenueBreakdownChart = dynamic(
  () => import("@/components/page/analytics/charts/RevenueBreakdownChart"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[260px] animate-pulse flex flex-col justify-between">
        <div className="h-4 w-36 bg-slate-100 rounded" />
        <div className="size-36 mx-auto rounded-full bg-slate-100" />
      </div>
    ),
  }
);
import { DollarSign, Users, Bike, PackageCheck, Calendar, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Aggregated values (default to 0 before API loads)
  const totalRevenue =
    apiData?.overview?.totalRevenue !== undefined
      ? `${Number(apiData.overview.totalRevenue).toLocaleString()} XOF`
      : "0 XOF";

  const totalUsers =
    apiData?.overview?.totalUsers !== undefined
      ? Number(apiData.overview.totalUsers).toLocaleString()
      : "0";

  const totalDrivers =
    apiData?.overview?.totalDrivers !== undefined
      ? Number(apiData.overview.totalDrivers).toLocaleString()
      : "0";

  const totalDelivery =
    apiData?.overview?.totalDelivery !== undefined
      ? Number(apiData.overview.totalDelivery).toLocaleString()
      : "0";

  const revenueChange = apiData?.overview?.revenueChange ?? "0%";
  const usersChange = apiData?.overview?.usersChange ?? "0%";
  const driversChange = apiData?.overview?.driversChange ?? "0%";
  const deliveriesChange = apiData?.overview?.deliveriesChange ?? "0%";

  const isRevenuePositive = apiData?.overview?.isRevenuePositive ?? true;
  const isUsersPositive = apiData?.overview?.isUsersPositive ?? true;
  const isDriversPositive = apiData?.overview?.isDriversPositive ?? true;
  const isDeliveriesPositive = apiData?.overview?.isDeliveriesPositive ?? true;

  // Charts & Tables (default to 0 before API loads)
  const salesChartData = apiData?.salesAnalytics && apiData.salesAnalytics.length > 0
    ? apiData.salesAnalytics
    : [
        { month: "Jan", revenue: 0, fill: "#F1F5F9" },
        { month: "Feb", revenue: 0, fill: "#F1F5F9" },
        { month: "Mar", revenue: 0, fill: "#F1F5F9" },
        { month: "Apr", revenue: 0, fill: "#F1F5F9" },
        { month: "May", revenue: 0, fill: "#10B981" },
        { month: "Jun", revenue: 0, fill: "#F1F5F9" },
      ];

  const salesTotalRev = apiData?.salesAnalytics
    ? `${apiData.salesAnalytics
        .reduce((acc: number, curr: any) => acc + (curr.revenue || 0), 0)
        .toLocaleString()} XOF`
    : "0 XOF";

  const driverPct =
    apiData?.userDistribution?.driverPercentage !== undefined
      ? Number(apiData.userDistribution.driverPercentage)
      : 0;

  const userPct =
    apiData?.userDistribution?.userPercentage !== undefined
      ? Number(apiData.userDistribution.userPercentage)
      : 0;

  const userDistData = apiData?.userDistribution?.data && apiData.userDistribution.data.length > 0
    ? apiData.userDistribution.data
    : [
        { name: "Driver", value: 0, fill: "#10B981" },
        { name: "User", value: 0, fill: "#E2E8F0" },
      ];

  const deliveriesOverviewObj = apiData?.deliveriesOverview ?? {
    total: 0,
    data: [
      { name: "Completed", value: 0, percentage: "0%", fill: "#10B981" },
      { name: "In Progress", value: 0, percentage: "0%", fill: "#3B82F6" },
      { name: "Cancelled", value: 0, percentage: "0%", fill: "#EF4444" },
      { name: "Failed", value: 0, percentage: "0%", fill: "#F59E0B" },
    ],
  };

  const revenueBreakdownTotal = apiData?.revenueBreakdown?.total ?? "0 XOF";
  const revenueBreakdownData = apiData?.revenueBreakdown?.data && apiData.revenueBreakdown.data.length > 0
    ? apiData.revenueBreakdown.data
    : [
        { name: "Delivery Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#6366F1" },
        { name: "Service Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#1E40AF" },
        { name: "Surge Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#F59E0B" },
        { name: "Other Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#10B981" },
      ];

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
          change={revenueChange}
          isPositive={isRevenuePositive}
          icon={DollarSign}
        />
        <StatCard
          title="TOTAL USERS"
          value={totalUsers}
          change={usersChange}
          isPositive={isUsersPositive}
          icon={Users}
        />
        <StatCard
          title="TOTAL DRIVERS"
          value={totalDrivers}
          change={driversChange}
          isPositive={isDriversPositive}
          icon={Bike}
        />
        <StatCard
          title="TOTAL DELIVERY"
          value={totalDelivery}
          change={deliveriesChange}
          isPositive={isDeliveriesPositive}
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
          total={revenueBreakdownTotal}
          data={revenueBreakdownData}
        />
      </div>

      {/* Completed Orders Table */}
      <CompletedOrdersTable />
    </div>
  );
}
