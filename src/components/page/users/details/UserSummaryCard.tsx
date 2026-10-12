import React from "react";
import { Shield, MapPin, Calendar } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import UserAvatar from "@/components/common/UserAvatar";
import { UserDetailData } from "./types";

interface UserSummaryCardProps {
  user: UserDetailData;
}

export default function UserSummaryCard({ user }: UserSummaryCardProps) {
  return (
    <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
      {/* Avatar Picture */}
      <div className="relative mb-4">
        <UserAvatar
          src={user.avatar}
          name={user.name}
          size="xl"
          className="border-4 border-slate-50 shadow-sm"
        />
      </div>

      {/* User Name & ID */}
      <h2 className="text-xl md:text-2xl font-bold text-[#18181B] tracking-tight">
        {user.name}
      </h2>
      <span className="text-xs font-medium text-slate-400 mt-1 mb-3 block tracking-wide">
        #{user.userId || user.id}
      </span>

      {/* Status Badge */}
      <div className="mb-2">
        <StatusBadge status={user.status} />
      </div>

      {/* Divider */}
      <div className="w-full border-t border-slate-100 my-6" />

      {/* Metadata Rows */}
      <div className="w-full space-y-5 text-left">
        <div className="flex items-start gap-3.5">
          <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">Role</span>
            <span className="block text-sm font-bold text-[#18181B] mt-0.5">
              {user.role}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">Location</span>
            <span className="block text-sm font-bold text-[#18181B] mt-0.5">
              {user.location}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-semibold text-slate-400">Joined</span>
            <span className="block text-sm font-bold text-[#18181B] mt-0.5">
              {user.joinedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
