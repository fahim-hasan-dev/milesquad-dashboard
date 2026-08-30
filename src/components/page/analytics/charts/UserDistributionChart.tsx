"use client";

import { Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const defaultDistributionData = [
  { name: "Driver", value: 65, fill: "#10B981" },
  { name: "User", value: 35, fill: "#E2E8F0" },
];

const chartConfig = {
  driver: {
    label: "Driver",
    color: "#10B981",
  },
  user: {
    label: "User",
    color: "#E2E8F0",
  },
};

interface UserDistributionChartProps {
  driverPercent?: number;
  userPercent?: number;
  data?: { name: string; value: number; fill: string }[];
}

export default function UserDistributionChart({
  driverPercent = 65,
  userPercent = 35,
  data = defaultDistributionData,
}: UserDistributionChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">User Distribution</h3>
        <div className="size-9 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#10B981]">
          <Users className="h-4 w-4" />
        </div>
      </div>

      {/* Dynamic Shadcn Pie Chart */}
      <div className="my-4 w-full h-[200px]">
        <ChartContainer config={chartConfig} className="w-full h-full aspect-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => {
                  const color = entry.fill || (entry as any).color || (index === 0 ? "#10B981" : "#E2E8F0");
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-around pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#10B981]" />
          <span className="text-xs font-semibold text-slate-500">Driver</span>
          <span className="text-xs font-bold text-slate-900 ml-1">{driverPercent}%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-slate-500">User</span>
          <span className="text-xs font-bold text-slate-900 ml-1">{userPercent}%</span>
        </div>
      </div>
    </div>
  );
}
