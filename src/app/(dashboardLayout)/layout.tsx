"use client";

import DashboardBreadcrumb from "@/components/layout/dashboard/navbar/dashboard-breadcrumb";
import { AppSidebar } from "@/components/layout/dashboard/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, KeyRound, UserPen, Camera } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="no-scrollbar bg-[#F8FAFC]">
      {/* App Sidebar */}
      <AppSidebar />

      <SidebarInset className="bg-[#F8FAFC] min-h-screen flex flex-col p-4 md:p-6 lg:p-8 gap-6">
        {/* Top Header */}
        <header className="flex h-12 shrink-0 items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="xl:hidden" />
            <DashboardBreadcrumb />
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Icon */}
            <button className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 size-2 bg-[#10B981] rounded-full border border-white" />
            </button>

            {/* Admin Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                  <div className="text-right leading-tight">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      Admin
                    </span>
                    <span className="block text-xs font-bold text-slate-800">
                      ABDOU
                    </span>
                  </div>
                  <div className="size-8 rounded-full bg-[#10B981] text-white font-extrabold text-sm flex items-center justify-center">
                    D
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl shadow-xl border border-slate-100 space-y-1">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/change-password" className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2.5">
                    <KeyRound className="h-4 w-4 text-slate-400" />
                    <span>Change Password</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => toast.success("Change Name modal")}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2.5 cursor-pointer"
                >
                  <UserPen className="h-4 w-4 text-slate-400" />
                  <span>Change Name</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => toast.success("Change Picture modal")}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2.5 cursor-pointer"
                >
                  <Camera className="h-4 w-4 text-slate-400" />
                  <span>Change Picture</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
