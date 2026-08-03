"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
}

export default function StatCard({ title, value, icon: Icon, change, isPositive = true }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </h2>
          {change && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              {change}
            </span>
          )}
        </div>
      </div>

      <div className="size-11 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#10B981] shrink-0">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
