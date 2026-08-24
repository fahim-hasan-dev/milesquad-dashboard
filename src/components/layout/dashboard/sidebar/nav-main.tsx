"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export interface NavGroup {
  groupLabel: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const { user } = useAuthContext();

  const currentUserObj = (typeof user === "object" && user !== null ? user : {}) as { role?: string };
  const userRole = (currentUserObj.role || "").toLowerCase();
  const isSubAdmin = userRole === "sub_admin";

  const restrictedUrls = ["/pricing", "/transactions", "/admins"];

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (isSubAdmin && restrictedUrls.some((r) => item.url.startsWith(r))) {
          return false;
        }
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-4 px-2">
      {filteredGroups.map((group) => (
        <SidebarGroup key={group.groupLabel} className="p-0">
          <SidebarGroupLabel className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
            {group.groupLabel}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#10B981] text-white hover:bg-[#059669] hover:text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
