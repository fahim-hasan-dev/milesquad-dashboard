export interface OrderItem {
  sl: number;
  bookingId: string;
  customerName: string;
  providerContact: string;
  price: string;
  operationalFee: string;
  platformFee: string;
  bookingDate: string;
  status: string;
}

export interface OverviewDataset {
  stats: {
    revenue: { value: string; change: string; isPositive: boolean };
    users: { value: string; change: string; isPositive: boolean };
    drivers: { value: string; change: string; isPositive: boolean };
    deliveries: { value: string; change: string; isPositive: boolean };
  };
  salesAnalytics: {
    totalRevenue: string;
    chartData: { month: string; revenue: number; fill: string }[];
  };
  deliveriesOverview: {
    total: number;
    data: { name: string; value: number; percentage: string; fill: string }[];
  };
  revenueBreakdown: {
    total: string;
    data: { name: string; value: number; percentage: string; formatted: string; fill: string }[];
  };
  userDistribution: {
    driverPercent: number;
    userPercent: number;
    data: { name: string; value: number; fill: string }[];
  };
  completedOrders: OrderItem[];
  recentOrders?: OrderItem[];
}

const emptyDataset: OverviewDataset = {
  stats: {
    revenue: { value: "0 XOF", change: "0%", isPositive: true },
    users: { value: "0", change: "0%", isPositive: true },
    drivers: { value: "0", change: "0%", isPositive: true },
    deliveries: { value: "0", change: "0%", isPositive: true },
  },
  salesAnalytics: {
    totalRevenue: "0 XOF",
    chartData: [
      { month: "Jan", revenue: 0, fill: "#F1F5F9" },
      { month: "Feb", revenue: 0, fill: "#F1F5F9" },
      { month: "Mar", revenue: 0, fill: "#F1F5F9" },
      { month: "Apr", revenue: 0, fill: "#F1F5F9" },
      { month: "May", revenue: 0, fill: "#10B981" },
      { month: "Jun", revenue: 0, fill: "#F1F5F9" },
    ],
  },
  deliveriesOverview: {
    total: 0,
    data: [
      { name: "Completed", value: 0, percentage: "0%", fill: "#10B981" },
      { name: "In Progress", value: 0, percentage: "0%", fill: "#3B82F6" },
      { name: "Cancelled", value: 0, percentage: "0%", fill: "#EF4444" },
      { name: "Failed", value: 0, percentage: "0%", fill: "#F59E0B" },
    ],
  },
  revenueBreakdown: {
    total: "0 XOF",
    data: [
      { name: "Delivery Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#6366F1" },
      { name: "Service Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#1E40AF" },
      { name: "Surge Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#F59E0B" },
      { name: "Other Fees", value: 0, percentage: "0%", formatted: "0 XOF", fill: "#10B981" },
    ],
  },
  userDistribution: {
    driverPercent: 0,
    userPercent: 0,
    data: [
      { name: "Driver", value: 0, fill: "#10B981" },
      { name: "User", value: 0, fill: "#E2E8F0" },
    ],
  },
  completedOrders: [],
  recentOrders: [],
};

export const overviewDataByYearAndPeriod: Record<string, Record<string, OverviewDataset>> = {
  "2026": {
    "Jan - Jun": emptyDataset,
    "Jul - Dec": emptyDataset,
  },
  "2025": {
    "Jan - Jun": emptyDataset,
    "Jul - Dec": emptyDataset,
  },
  "2024": {
    "Jan - Jun": emptyDataset,
    "Jul - Dec": emptyDataset,
  },
};
