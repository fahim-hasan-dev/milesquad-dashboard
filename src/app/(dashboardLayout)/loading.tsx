import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200/80 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-200/80 rounded-xl" />
      </div>

      {/* 3 to 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
              <div className="size-9 rounded-xl bg-slate-100" />
            </div>
            <div className="h-7 w-32 bg-slate-200/80 rounded-lg" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Main Table / Content Card Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
        {/* Search & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-11 w-64 bg-slate-100 rounded-xl" />
          <div className="flex items-center gap-3">
            <div className="h-11 w-32 bg-slate-100 rounded-xl" />
            <div className="h-11 w-28 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="h-10 bg-slate-50 rounded-xl w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-14 border-b border-slate-50 flex items-center justify-between px-3 gap-4"
            >
              <div className="h-4 w-28 bg-slate-100 rounded" />
              <div className="h-4 w-36 bg-slate-100 rounded" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
