"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import DashboardBreadcrumb from "@/components/layout/dashboard/navbar/dashboard-breadcrumb";
import NotificationDropdown from "@/components/layout/dashboard/navbar/NotificationDropdown";
import ChangeNameModal from "@/components/modals/ChangeNameModal";
import ChangePictureModal from "@/components/modals/ChangePictureModal";
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
import { KeyRound, UserPen, Camera, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthContext, AdminUser } from "@/contexts/AuthContext";
import { getImageUrl } from "@/utils/imageUrl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, setUser, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const currentUserObj = (typeof user === "object" && user !== null ? user : {}) as AdminUser;
  const adminName = currentUserObj.name || (typeof user === "string" ? user : "Admin");
  const adminAvatar = getImageUrl(currentUserObj.image);
  const adminRole = currentUserObj.role || "Admin";

  const userRole = (currentUserObj.role || "").toLowerCase();
  const isSubAdmin = userRole === "sub_admin";
  const restrictedPathsForSubAdmin = ["/pricing", "/transactions", "/admins"];

  useEffect(() => {
    const cookieToken = getCookie("accessToken");
    if (!token && !cookieToken) {
      setIsAuthenticated(false);
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);

    // Sub-admin Route Access Guard
    if (isSubAdmin && restrictedPathsForSubAdmin.some((path) => pathname.startsWith(path))) {
      toast.error("Access Denied: Sub-admins cannot access this section.");
      router.replace("/");
    }
  }, [token, pathname, router, isSubAdmin]);

  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
  const [isChangePictureModalOpen, setIsChangePictureModalOpen] = useState(false);

  if (isAuthenticated === false || (!token && typeof window !== "undefined" && !getCookie("accessToken"))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
        <p className="text-xs font-semibold text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

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
            {/* Notification Bell Dropdown */}
            <NotificationDropdown />

            {/* Admin Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                  <div className="text-right leading-tight">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      {adminRole}
                    </span>
                    <span className="block text-xs font-bold text-slate-800 uppercase">
                      {adminName}
                    </span>
                  </div>
                  {adminAvatar ? (
                    <Image
                      src={adminAvatar}
                      alt={adminName}
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-[#10B981] text-white font-extrabold text-sm flex items-center justify-center">
                      {adminName.charAt(0).toUpperCase()}
                    </div>
                  )}
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
                  onClick={() => setIsChangeNameModalOpen(true)}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2.5 cursor-pointer"
                >
                  <UserPen className="h-4 w-4 text-slate-400" />
                  <span>Change Name</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsChangePictureModalOpen(true)}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2.5 cursor-pointer"
                >
                  <Camera className="h-4 w-4 text-slate-400" />
                  <span>Change Picture</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 py-2.5 cursor-pointer rounded-xl"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 w-full">{children}</main>
      </SidebarInset>

      {/* Change Name Modal */}
      <ChangeNameModal
        isOpen={isChangeNameModalOpen}
        onClose={() => setIsChangeNameModalOpen(false)}
        currentName={adminName}
        onUpdateName={(newName) => {
          if (typeof user === "object" && user !== null) {
            setUser({ ...user, name: newName });
          } else {
            setUser(newName);
          }
        }}
      />

      {/* Change Picture Modal */}
      <ChangePictureModal
        isOpen={isChangePictureModalOpen}
        onClose={() => setIsChangePictureModalOpen(false)}
        currentPicture={adminAvatar}
        onUpdatePicture={(newPic) => {
          if (typeof user === "object" && user !== null) {
            setUser({ ...user, image: newPic });
          }
        }}
      />
    </SidebarProvider>
  );
}
