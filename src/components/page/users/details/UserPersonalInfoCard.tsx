import React from "react";
import Image from "next/image";
import { User, Mail, Phone, ShoppingBag, DollarSign } from "lucide-react";
import { UserDetailData } from "./types";

interface UserPersonalInfoCardProps {
  user: UserDetailData;
}

export default function UserPersonalInfoCard({
  user,
}: UserPersonalInfoCardProps) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
      <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
        Personal Information
      </h3>

      {/* Profile Picture Row */}
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt="Profile Picture"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-xl shadow-sm border border-slate-100 shrink-0">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h4 className="text-sm md:text-base font-bold text-[#18181B]">
            Profile Picture
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 font-normal">
            User&apos;s profile image
          </p>
        </div>
      </div>

      <div className="w-full border-t border-slate-100 my-6" />

      {/* Personal Info Rows */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Full Name</span>
            <span className="font-bold text-[#18181B]">{user.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Email Address</span>
            <span className="font-bold text-[#18181B]">{user.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
            <span className="font-bold text-[#18181B]">{user.contact}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShoppingBag className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Total Orders</span>
            <span className="font-bold text-[#18181B]">{user.totalOrders || 0} Orders</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Total Volume</span>
            <span className="font-bold text-[#10B981]">{user.totalSpent || "0 XOF"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
