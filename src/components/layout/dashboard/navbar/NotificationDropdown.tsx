"use client";

import React, { useState } from "react";
import {
  Bell,
  PackageCheck,
  Bike,
  CreditCard,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "driver" | "payment" | "support" | "system";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Delivery Order",
    message: "Order #FM-BKG-000050 placed by Donald Trump",
    time: "5 mins ago",
    read: false,
    type: "order",
  },
  {
    id: "notif-2",
    title: "New Driver Registration",
    message: "Sarah Jenkins submitted vehicle documents for review",
    time: "25 mins ago",
    read: false,
    type: "driver",
  },
  {
    id: "notif-3",
    title: "Payment Received",
    message: "Payment of $3,600 received for order #FM-BKG-000050",
    time: "1 hour ago",
    read: false,
    type: "payment",
  },
  {
    id: "notif-4",
    title: "Support Ticket Logged",
    message: "Customer logged ticket #SUP-008 regarding package delay",
    time: "3 hours ago",
    read: true,
    type: "support",
  },
  {
    id: "notif-5",
    title: "Weekly Payout Complete",
    message: "Weekly driver payout batch processed successfully",
    time: "Yesterday",
    read: true,
    type: "system",
  },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <PackageCheck className="h-4 w-4 text-[#10B981]" />;
      case "driver":
        return <Bike className="h-4 w-4 text-blue-500" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "support":
        return <Headphones className="h-4 w-4 text-amber-500" />;
      case "system":
      default:
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return "bg-emerald-50 border-emerald-100";
      case "driver":
        return "bg-blue-50 border-blue-100";
      case "payment":
        return "bg-emerald-50 border-emerald-100";
      case "support":
        return "bg-amber-50 border-amber-100";
      case "system":
      default:
        return "bg-purple-50 border-purple-100";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
        <div className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 size-2 bg-[#10B981] rounded-full border border-white" />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 md:w-96 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 space-y-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-emerald-50 text-[#10B981] border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 space-y-1">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item.id)}
                className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all cursor-pointer ${
                  !item.read
                    ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                    : "hover:bg-slate-50/80"
                }`}
              >
                {/* Icon Box */}
                <div
                  className={`size-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal leading-snug line-clamp-2">
                    {item.message}
                  </p>
                </div>

                {/* Unread Dot */}
                {!item.read && (
                  <span className="size-2 bg-[#10B981] rounded-full shrink-0 mt-2" />
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 font-medium text-xs">
              No notifications at the moment.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
