"use client";

import RidersTable from "@/components/page/riders/RidersTable";

export default function RidersPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Manage Grocerymarkets and Suppliers. Approve registrations and monitor activity.
        </p>
      </div>

      {/* Main Riders Table */}
      <RidersTable />
    </div>
  );
}
