"use client";

import { ChevronDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const salesData = [
  { month: "Jan", revenue: 4200, fill: "#F1F5F9" },
  { month: "Feb", revenue: 7700, fill: "#F1F5F9" },
  { month: "Mar", revenue: 4900, fill: "#F1F5F9" },
  { month: "Apr", revenue: 9800, fill: "#F1F5F9" },
  { month: "May", revenue: 14000, fill: "#10B981" }, // Active Highlight Month
  { month: "Jun", revenue: 6300, fill: "#F1F5F9" },
  { month: "July", revenue: 5600, fill: "#F1F5F9" },
];

const chartConfig = {
  revenue: {
    label: "Sales Revenue",
    color: "#10B981",
  },
};

export default function SalesAnalyticsChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      {/* Top Header & Controls */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Sales Analytics</h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
            $46,650
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="size-9 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#10B981] hover:bg-emerald-100 transition-colors">
            <TrendingUp className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer">
            <span>July-Dec</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Dynamic Shadcn Bar Chart Container */}
      <div className="mt-6 w-full h-[240px]">
        <ChartContainer config={chartConfig} className="w-full h-full aspect-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val === 0 ? "$0k" : `$${(val / 1000).toFixed(1)}k`)}
                domain={[0, 14000]}
                ticks={[0, 3500, 7000, 10500, 14000]}
                className="text-[11px] font-semibold text-slate-400"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs font-semibold text-slate-400"
              />
              <ChartTooltip content={<ChartTooltipContent hideIndicator labelKey="month" />} />
              <Bar
                dataKey="revenue"
                radius={[12, 12, 12, 12]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
