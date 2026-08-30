"use client";

import LiveTrackingMap from "@/components/page/liveTracking/LiveTrackingMap";

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
