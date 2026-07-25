"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const deliveriesData = [
  { name: "Completed", value: 21987, percentage: "89.1%", fill: "#10B981" },
  { name: "In Progress", value: 1245, percentage: "5.0%", fill: "#3B82F6" },
  { name: "Cancelled", value: 876, percentage: "3.6%", fill: "#EF4444" },
  { name: "Failed", value: 574, percentage: "2.3%", fill: "#F59E0B" },
];

const chartConfig = {
  completed: { label: "Completed", color: "#10B981" },
  inProgress: { label: "In Progress", color: "#3B82F6" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
  failed: { label: "Failed", color: "#F59E0B" },
};

export default function DeliveriesOverviewChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-base font-bold text-slate-800 mb-4">Deliveries Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
        {/* Dynamic Shadcn Donut Chart Container */}
        <div className="relative size-44 mx-auto flex items-center justify-center">
          <ChartContainer config={chartConfig} className="size-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={deliveriesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={70}
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {deliveriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Center Label */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 leading-tight">24,682</span>
            <span className="text-[11px] font-medium text-slate-400">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {deliveriesData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
              <div>
                <span className="block text-xs font-bold text-slate-800">{item.name}</span>
                <span className="block text-[11px] font-medium text-slate-400">
                  {item.value.toLocaleString()} ({item.percentage})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
