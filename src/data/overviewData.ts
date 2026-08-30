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

const sampleRecentOrders: OrderItem[] = [
  { sl: 1, bookingId: "FM-BKG-000050", customerName: "Donald Trump", providerContact: "+27 791 135 003", price: "3,600 XOF", operationalFee: "360 XOF", platformFee: "180 XOF", bookingDate: "11 Jun 2026", status: "DELIVERED" },
  { sl: 2, bookingId: "FM-BKG-000049", customerName: "Sarah Connor", providerContact: "+27 656 648 349", price: "1,250 XOF", operationalFee: "125 XOF", platformFee: "62.50 XOF", bookingDate: "08 Jun 2026", status: "IN TRANSIT" },
  { sl: 3, bookingId: "FM-BKG-000048", customerName: "Marcus Wei", providerContact: "+27 824 551 902", price: "850 XOF", operationalFee: "85 XOF", platformFee: "42.50 XOF", bookingDate: "04 Jun 2026", status: "PENDING" },
  { sl: 4, bookingId: "FM-BKG-000047", customerName: "Emma Watson", providerContact: "+27 712 990 411", price: "2,100 XOF", operationalFee: "210 XOF", platformFee: "105 XOF", bookingDate: "28 May 2026", status: "DELIVERED" },
  { sl: 5, bookingId: "FM-BKG-000046", customerName: "David Kim", providerContact: "+27 839 201 114", price: "1,750 XOF", operationalFee: "175 XOF", platformFee: "87.50 XOF", bookingDate: "25 May 2026", status: "CANCELLED" },
  { sl: 6, bookingId: "FM-BKG-000045", customerName: "Jessica Alba", providerContact: "+27 721 883 490", price: "2,850 XOF", operationalFee: "285 XOF", platformFee: "142.50 XOF", bookingDate: "20 May 2026", status: "IN TRANSIT" },
  { sl: 7, bookingId: "FM-BKG-000044", customerName: "Michael Scott", providerContact: "+27 614 332 990", price: "1,900 XOF", operationalFee: "190 XOF", platformFee: "95 XOF", bookingDate: "15 May 2026", status: "DELIVERED" },
  { sl: 8, bookingId: "FM-BKG-000043", customerName: "Priya Patel", providerContact: "+27 799 441 203", price: "3,100 XOF", operationalFee: "310 XOF", platformFee: "155 XOF", bookingDate: "10 May 2026", status: "PENDING" },
];

export const overviewDataByYearAndPeriod: Record<string, Record<string, OverviewDataset>> = {
  "2026": {
    "Jan - Jun": {
      stats: {
        revenue: { value: "$42,650.00", change: "+14.2%", isPositive: true },
        users: { value: "1,250", change: "+8.5%", isPositive: true },
        drivers: { value: "320", change: "+12.0%", isPositive: true },
        deliveries: { value: "3,840", change: "+18.4%", isPositive: true },
      },
      salesAnalytics: {
        totalRevenue: "$46,650",
        chartData: [
          { month: "Jan", revenue: 4200, fill: "#F1F5F9" },
          { month: "Feb", revenue: 7700, fill: "#F1F5F9" },
          { month: "Mar", revenue: 4900, fill: "#F1F5F9" },
          { month: "Apr", revenue: 9800, fill: "#F1F5F9" },
          { month: "May", revenue: 14000, fill: "#10B981" },
          { month: "Jun", revenue: 6050, fill: "#F1F5F9" },
        ],
      },
      deliveriesOverview: {
        total: 3840,
        data: [
          { name: "Completed", value: 3420, percentage: "89.1%", fill: "#10B981" },
          { name: "In Progress", value: 192, percentage: "5.0%", fill: "#3B82F6" },
          { name: "Cancelled", value: 138, percentage: "3.6%", fill: "#EF4444" },
          { name: "Failed", value: 90, percentage: "2.3%", fill: "#F59E0B" },
        ],
      },
      revenueBreakdown: {
        total: "$42,650.00",
        data: [
          { name: "Delivery Fees", value: 27125.4, percentage: "63.6%", formatted: "$27,125.40", fill: "#6366F1" },
          { name: "Service Fees", value: 8956.5, percentage: "21.0%", formatted: "$8,956.50", fill: "#1E40AF" },
          { name: "Surge Fees", value: 4265.0, percentage: "10.0%", formatted: "$4,265.00", fill: "#F59E0B" },
          { name: "Other Fees", value: 2303.1, percentage: "5.4%", formatted: "$2,303.10", fill: "#10B981" },
        ],
      },
      userDistribution: {
        driverPercent: 65,
        userPercent: 35,
        data: [
          { name: "Driver", value: 65, fill: "#10B981" },
          { name: "User", value: 35, fill: "#E2E8F0" },
        ],
      },
      completedOrders: sampleRecentOrders,
      recentOrders: sampleRecentOrders,
    },
    "Jul - Dec": {
      stats: {
        revenue: { value: "$58,920.00", change: "+22.5%", isPositive: true },
        users: { value: "1,680", change: "+15.2%", isPositive: true },
        drivers: { value: "410", change: "+18.3%", isPositive: true },
        deliveries: { value: "5,210", change: "+24.1%", isPositive: true },
      },
      salesAnalytics: {
        totalRevenue: "$58,920",
        chartData: [
          { month: "Jul", revenue: 8100, fill: "#F1F5F9" },
          { month: "Aug", revenue: 9500, fill: "#F1F5F9" },
          { month: "Sep", revenue: 7400, fill: "#F1F5F9" },
          { month: "Oct", revenue: 11200, fill: "#F1F5F9" },
          { month: "Nov", revenue: 15800, fill: "#10B981" },
          { month: "Dec", revenue: 6920, fill: "#F1F5F9" },
        ],
      },
      deliveriesOverview: {
        total: 5210,
        data: [
          { name: "Completed", value: 4689, percentage: "90.0%", fill: "#10B981" },
          { name: "In Progress", value: 260, percentage: "5.0%", fill: "#3B82F6" },
          { name: "Cancelled", value: 161, percentage: "3.1%", fill: "#EF4444" },
          { name: "Failed", value: 100, percentage: "1.9%", fill: "#F59E0B" },
        ],
      },
      revenueBreakdown: {
        total: "$58,920.00",
        data: [
          { name: "Delivery Fees", value: 37473.12, percentage: "63.6%", formatted: "$37,473.12", fill: "#6366F1" },
          { name: "Service Fees", value: 12373.2, percentage: "21.0%", formatted: "$12,373.20", fill: "#1E40AF" },
          { name: "Surge Fees", value: 5892.0, percentage: "10.0%", formatted: "$5,892.00", fill: "#F59E0B" },
          { name: "Other Fees", value: 3181.68, percentage: "5.4%", formatted: "$3,181.68", fill: "#10B981" },
        ],
      },
      userDistribution: {
        driverPercent: 68,
        userPercent: 32,
        data: [
          { name: "Driver", value: 68, fill: "#10B981" },
          { name: "User", value: 32, fill: "#E2E8F0" },
        ],
      },
      completedOrders: sampleRecentOrders,
      recentOrders: sampleRecentOrders,
    },
  },
  "2025": {
    "Jan - Jun": {
      stats: {
        revenue: { value: "$34,200.00", change: "+10.1%", isPositive: true },
        users: { value: "940", change: "+6.2%", isPositive: true },
        drivers: { value: "250", change: "+9.1%", isPositive: true },
        deliveries: { value: "2,890", change: "+12.3%", isPositive: true },
      },
      salesAnalytics: {
        totalRevenue: "$34,200",
        chartData: [
          { month: "Jan", revenue: 3800, fill: "#F1F5F9" },
          { month: "Feb", revenue: 5200, fill: "#F1F5F9" },
          { month: "Mar", revenue: 4100, fill: "#F1F5F9" },
          { month: "Apr", revenue: 7600, fill: "#F1F5F9" },
          { month: "May", revenue: 8900, fill: "#10B981" },
          { month: "Jun", revenue: 4600, fill: "#F1F5F9" },
        ],
      },
      deliveriesOverview: {
        total: 2890,
        data: [
          { name: "Completed", value: 2543, percentage: "88.0%", fill: "#10B981" },
          { name: "In Progress", value: 160, percentage: "5.5%", fill: "#3B82F6" },
          { name: "Cancelled", value: 115, percentage: "4.0%", fill: "#EF4444" },
          { name: "Failed", value: 72, percentage: "2.5%", fill: "#F59E0B" },
        ],
      },
      revenueBreakdown: {
        total: "$34,200.00",
        data: [
          { name: "Delivery Fees", value: 21751.2, percentage: "63.6%", formatted: "$21,751.20", fill: "#6366F1" },
          { name: "Service Fees", value: 7182.0, percentage: "21.0%", formatted: "$7,182.00", fill: "#1E40AF" },
          { name: "Surge Fees", value: 3420.0, percentage: "10.0%", formatted: "$3,420.00", fill: "#F59E0B" },
          { name: "Other Fees", value: 1846.8, percentage: "5.4%", formatted: "$1,846.80", fill: "#10B981" },
        ],
      },
      userDistribution: {
        driverPercent: 62,
        userPercent: 38,
        data: [
          { name: "Driver", value: 62, fill: "#10B981" },
          { name: "User", value: 38, fill: "#E2E8F0" },
        ],
      },
      completedOrders: sampleRecentOrders,
      recentOrders: sampleRecentOrders,
    },
    "Jul - Dec": {
      stats: {
        revenue: { value: "$39,800.00", change: "+16.4%", isPositive: true },
        users: { value: "1,100", change: "+12.0%", isPositive: true },
        drivers: { value: "285", change: "+14.0%", isPositive: true },
        deliveries: { value: "3,450", change: "+19.4%", isPositive: true },
      },
      salesAnalytics: {
        totalRevenue: "$39,800",
        chartData: [
          { month: "Jul", revenue: 5400, fill: "#F1F5F9" },
          { month: "Aug", revenue: 6800, fill: "#F1F5F9" },
          { month: "Sep", revenue: 5900, fill: "#F1F5F9" },
          { month: "Oct", revenue: 8300, fill: "#F1F5F9" },
          { month: "Nov", revenue: 9200, fill: "#10B981" },
          { month: "Dec", revenue: 4200, fill: "#F1F5F9" },
        ],
      },
      deliveriesOverview: {
        total: 3450,
        data: [
          { name: "Completed", value: 3070, percentage: "89.0%", fill: "#10B981" },
          { name: "In Progress", value: 172, percentage: "5.0%", fill: "#3B82F6" },
          { name: "Cancelled", value: 121, percentage: "3.5%", fill: "#EF4444" },
          { name: "Failed", value: 87, percentage: "2.5%", fill: "#F59E0B" },
        ],
      },
      revenueBreakdown: {
        total: "$39,800.00",
        data: [
          { name: "Delivery Fees", value: 25312.8, percentage: "63.6%", formatted: "$25,312.80", fill: "#6366F1" },
          { name: "Service Fees", value: 8358.0, percentage: "21.0%", formatted: "$8,358.00", fill: "#1E40AF" },
          { name: "Surge Fees", value: 3980.0, percentage: "10.0%", formatted: "$3,980.00", fill: "#F59E0B" },
          { name: "Other Fees", value: 2149.2, percentage: "5.4%", formatted: "$2,149.20", fill: "#10B981" },
        ],
      },
      userDistribution: {
        driverPercent: 64,
        userPercent: 36,
        data: [
          { name: "Driver", value: 64, fill: "#10B981" },
          { name: "User", value: 36, fill: "#E2E8F0" },
        ],
      },
      completedOrders: sampleRecentOrders,
      recentOrders: sampleRecentOrders,
    },
  },
  "2024": {
    "Jan - Jun": {
      stats: {
        revenue: { value: "$26,500.00", change: "+5.4%", isPositive: true },
        users: { value: "680", change: "+4.1%", isPositive: true },
        drivers: { value: "180", change: "+6.0%", isPositive: true },
        deliveries: { value: "2,100", change: "+8.2%", isPositive: true },
      },
      salesAnalytics: {
        totalRevenue: "$26,500",
        chartData: [
          { month: "Jan", revenue: 2900, fill: "#F1F5F9" },
          { month: "Feb", revenue: 3400, fill: "#F1F5F9" },
          { month: "Mar", revenue: 3800, fill: "#F1F5F9" },
          { month: "Apr", revenue: 4500, fill: "#F1F5F9" },
          { month: "May", revenue: 6700, fill: "#10B981" },
          { month: "Jun", revenue: 5200, fill: "#F1F5F9" },
        ],
      },
      deliveriesOverview: {
        total: 2100,
        data: [
          { name: "Completed", value: 1827, percentage: "87.0%", fill: "#10B981" },
          { name: "In Progress", value: 126, percentage: "6.0%", fill: "#3B82F6" },
          { name: "Cancelled", value: 84, percentage: "4.0%", fill: "#EF4444" },
          { name: "Failed", value: 63, percentage: "3.0%", fill: "#F59E0B" },
        ],
      },
      revenueBreakdown: {
        total: "$26,500.00",
        data: [
          { name: "Delivery Fees", value: 16854.0, percentage: "63.6%", formatted: "$16,854.00", fill: "#6366F1" },
          { name: "Service Fees", value: 5565.0, percentage: "21.0%", formatted: "$5,565.00", fill: "#1E40AF" },
          { name: "Surge Fees", value: 2650.0, percentage: "10.0%", formatted: "$2,650.00", fill: "#F59E0B" },
          { name: "Other Fees", value: 1431.0, percentage: "5.4%", formatted: "$1,431.00", fill: "#10B981" },
        ],
      },
      userDistribution: {
        driverPercent: 60,
        userPercent: 40,
        data: [
          { name: "Driver", value: 60, fill: "#10B981" },
          { name: "User", value: 40, fill: "#E2E8F0" },
        ],
      },
      completedOrders: sampleRecentOrders,
      recentOrders: sampleRecentOrders,
    },
    "Jul - Dec": {
      stats: {
        revenue: { value: "$31,400.00", change: "+12.1%", isPositive: true },
        users: { value: "820", change: "+8.0%", isPositive: true },
        drivers: { value: "215", change: "+10.2%", isPositive: true },
        deliveries: { value: "2,580", change: "+14.5%", isPositive: true },
      },
      salesAnalytics: {
        totalRevenue: "$31,400",
        chartData: [
          { month: "Jul", revenue: 4100, fill: "#F1F5F9" },
          { month: "Aug", revenue: 4900, fill: "#F1F5F9" },
          { month: "Sep", revenue: 4300, fill: "#F1F5F9" },
          { month: "Oct", revenue: 6100, fill: "#F1F5F9" },
          { month: "Nov", revenue: 7200, fill: "#10B981" },
          { month: "Dec", revenue: 4800, fill: "#F1F5F9" },
        ],
      },
      deliveriesOverview: {
        total: 2580,
        data: [
          { name: "Completed", value: 2270, percentage: "88.0%", fill: "#10B981" },
          { name: "In Progress", value: 142, percentage: "5.5%", fill: "#3B82F6" },
          { name: "Cancelled", value: 103, percentage: "4.0%", fill: "#EF4444" },
          { name: "Failed", value: 65, percentage: "2.5%", fill: "#F59E0B" },
        ],
      },
      revenueBreakdown: {
        total: "$31,400.00",
        data: [
          { name: "Delivery Fees", value: 19970.4, percentage: "63.6%", formatted: "$19,970.40", fill: "#6366F1" },
          { name: "Service Fees", value: 6594.0, percentage: "21.0%", formatted: "$6,594.00", fill: "#1E40AF" },
          { name: "Surge Fees", value: 3140.0, percentage: "10.0%", formatted: "$3,40.00", fill: "#F59E0B" },
          { name: "Other Fees", value: 1695.6, percentage: "5.4%", formatted: "$1,695.60", fill: "#10B981" },
        ],
      },
      userDistribution: {
        driverPercent: 61,
        userPercent: 39,
        data: [
          { name: "Driver", value: 61, fill: "#10B981" },
          { name: "User", value: 39, fill: "#E2E8F0" },
        ],
      },
      completedOrders: sampleRecentOrders,
      recentOrders: sampleRecentOrders,
    },
  },
};
