import React from "react";
import AdminsTable from "@/components/page/admins/AdminsTable";

export default function AdminsPage() {
  return (
    <div className="space-y-6 pb-16">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Admin Management
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
          Manage system administrators, add new admin accounts, edit credentials, or suspend access.
        </p>
      </div>

      {/* Main Table */}
      <AdminsTable />
    </div>
  );
}
