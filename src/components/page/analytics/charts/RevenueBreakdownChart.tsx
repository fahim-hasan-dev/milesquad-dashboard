"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const revenueData = [
  { name: "Delivery Fees", value: 98430.2, percentage: "63.6%", formatted: "$98,430.20", fill: "#6366F1" },
  { name: "Service Fees", value: 32540.1, percentage: "21.0%", formatted: "$32,540.10", fill: "#1E40AF" },
  { name: "Surge Fees", value: 15430.5, percentage: "10.0%", formatted: "$15,430.50", fill: "#F59E0B" },
  { name: "Other Fees", value: 8381.65, percentage: "5.4%", formatted: "$8,381.65", fill: "#10B981" },
];

const chartConfig = {
  delivery: { label: "Delivery Fees", color: "#6366F1" },
  service: { label: "Service Fees", color: "#1E40AF" },
  surge: { label: "Surge Fees", color: "#F59E0B" },
  other: { label: "Other Fees", color: "#10B981" },
};

export default function RevenueBreakdownChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-base font-bold text-slate-800 mb-4">Revenue Breakdown</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
        {/* Dynamic Shadcn Donut Chart Container */}
        <div className="relative size-44 mx-auto flex items-center justify-center">
          <ChartContainer config={chartConfig} className="size-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={revenueData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={70}
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Center Label */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
            <span className="text-xs md:text-sm font-black text-slate-900 leading-tight">$154,782.45</span>
            <span className="text-[11px] font-medium text-slate-400">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {revenueData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
              <div>
                <span className="block text-xs font-bold text-slate-800">{item.name}</span>
                <span className="block text-[11px] font-medium text-slate-400">
                  {item.formatted} ({item.percentage})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
