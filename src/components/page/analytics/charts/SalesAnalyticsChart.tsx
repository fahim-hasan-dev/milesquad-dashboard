"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultSalesData = [
  { month: "Jan", revenue: 4200, fill: "#F1F5F9" },
  { month: "Feb", revenue: 7700, fill: "#F1F5F9" },
  { month: "Mar", revenue: 4900, fill: "#F1F5F9" },
  { month: "Apr", revenue: 9800, fill: "#F1F5F9" },
  { month: "May", revenue: 14000, fill: "#10B981" },
  { month: "Jun", revenue: 6050, fill: "#F1F5F9" },
];

const chartConfig = {
  revenue: {
    label: "Sales Revenue",
    color: "#10B981",
  },
};

interface SalesAnalyticsChartProps {
  totalRevenue?: string;
  chartData?: { month: string; revenue: number; fill: string }[];
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export default function SalesAnalyticsChart({
  totalRevenue = "$46,650",
  chartData = defaultSalesData,
  period = "Jan - Jun",
  onPeriodChange,
}: SalesAnalyticsChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      {/* Top Header & Controls */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Sales Analytics</h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {totalRevenue}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="size-9 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#10B981] hover:bg-emerald-100 transition-colors">
            <TrendingUp className="h-4 w-4" />
          </button>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="h-9 w-[115px] bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:ring-0 shadow-none">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-lg border border-slate-100 min-w-[115px]">
              <SelectItem value="Jan - Jun" className="text-xs font-semibold cursor-pointer">
                Jan - Jun
              </SelectItem>
              <SelectItem value="Jul - Dec" className="text-xs font-semibold cursor-pointer">
                Jul - Dec
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dynamic Shadcn Bar Chart Container */}
      <div className="mt-6 w-full h-[240px]">
        <ChartContainer config={chartConfig} className="w-full h-full aspect-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) =>
                  val === 0 ? "0" : `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`
                }
                width={48}
                className="text-[11px] font-semibold text-slate-400"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs font-semibold text-slate-400"
              />
              <ChartTooltip
                cursor={{ fill: "rgba(16, 185, 129, 0.08)", rx: 8 }}
                content={<ChartTooltipContent hideIndicator labelKey="month" />}
              />
              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[12, 12, 12, 12]}
                maxBarSize={48}
              >
                {chartData.map((entry, index) => {
                  const maxRev = Math.max(...chartData.map((d) => d.revenue || 0));
                  const isMax = entry.revenue === maxRev && maxRev > 0;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill || (isMax ? "#10B981" : "#E2E8F0")}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
