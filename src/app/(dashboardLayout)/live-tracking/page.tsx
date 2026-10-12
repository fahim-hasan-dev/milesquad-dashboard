"use client";

import dynamic from "next/dynamic";

const LiveTrackingMap = dynamic(
  () => import("@/components/page/liveTracking/LiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[620px] rounded-2xl bg-white border border-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Loading tracking system...</span>
      </div>
    ),
  }
);

export default function LiveTrackingPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Live tracking
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Track every active driver
        </p>
      </div>

      {/* Main Map */}
      <LiveTrackingMap />
    </div>
  );
}
