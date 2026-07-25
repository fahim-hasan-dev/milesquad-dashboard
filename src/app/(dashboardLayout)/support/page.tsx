"use client";

import SupportTable from "@/components/page/support/SupportTable";

export default function SupportPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Help &amp; Support
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Solve the problems of the users.
        </p>
      </div>

      {/* Support Table */}
      <SupportTable />
    </div>
  );
}
