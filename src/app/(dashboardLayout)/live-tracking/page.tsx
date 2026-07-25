"use client";

import LiveTrackingMap from "@/components/page/liveTracking/LiveTrackingMap";

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
