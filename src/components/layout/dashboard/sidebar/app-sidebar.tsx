"use client";

import * as React from "react";
import { useState } from "react";
import { NavMain } from "@/components/layout/dashboard/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { sidebarMenuGroups } from "@/constants/dashboard-sidebar-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import LogoutModal from "@/components/modals/LogoutModal";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuthContext();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <Sidebar collapsible="offcanvas" className="bg-white border-r border-slate-100" {...props}>
      {/* Sidebar Header with Zerokraft Logo */}
      <SidebarHeader className="py-6 px-4">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Zerokraft Logo"
            width={160}
            height={80}
            priority
            className="w-36 h-auto object-contain"
          />
        </Link>
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className="px-2 no-scrollbar">
        <NavMain groups={sidebarMenuGroups} />
      </SidebarContent>

      {/* Logout Footer Button */}
      <SidebarFooter className="p-4">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F4F4F5] hover:bg-slate-200 text-red-500 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <span>Logout</span>
          <LogOut className="h-4 w-4 rotate-180" />
        </button>
      </SidebarFooter>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </Sidebar>
  );
}