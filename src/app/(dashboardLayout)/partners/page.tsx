"use client";

import PartnersTable from "@/components/page/partners/PartnersTable";

export default function PartnersPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Partner Management
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Manage platform business partners, vendor managers, and supply chain leads.
        </p>
      </div>

      {/* Main Partners Table */}
      <PartnersTable />
    </div>
  );
}
