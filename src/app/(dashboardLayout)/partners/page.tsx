"use client";

import PartnersTable from "@/components/page/partners/PartnersTable";

export default function PartnersPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Partners
        </h1>
      </div>

      {/* Main Partners Table */}
      <PartnersTable />
    </div>
  );
}
