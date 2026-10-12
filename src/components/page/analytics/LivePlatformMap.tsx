"use client";

import dynamic from "next/dynamic";

const LiveTrackingMap = dynamic(
  () => import("@/components/page/liveTracking/LiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[440px] rounded-2xl bg-white border border-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Loading live map...</span>
      </div>
    ),
  }
);

export default function LivePlatformMap() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
          Live Platform Tracking
        </h3>
        <p className="text-xs text-slate-500 font-normal">
          Real-time active driver locations and tracking overview
        </p>
      </div>

      <LiveTrackingMap heightClass="h-[440px]" />
    </div>
  );
}
