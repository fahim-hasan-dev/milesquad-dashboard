"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Calendar, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function UserDetailsPage() {
  const handleSuspend = () => {
    toast.success("User has been suspended");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Page Header Title & Top Right Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            View User Details
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Complete information about this user account.
          </p>
        </div>

        <button
          onClick={handleSuspend}
          className="self-start sm:self-auto border border-red-200/90 text-red-500 hover:bg-red-50/70 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none"
        >
          Suspend User
        </button>
      </div>

      {/* 2-Card Layout Container */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Card: Summary Card (Fixed ~360px on desktop) */}
        <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          {/* Avatar Picture */}
          <div className="relative mb-4">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"
              alt="John Smith"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-50 shadow-sm"
            />
          </div>

          {/* User Name & ID */}
          <h2 className="text-xl md:text-2xl font-bold text-[#18181B] tracking-tight">
            John Smith
          </h2>
          <span className="text-xs font-medium text-slate-400 mt-1 mb-2 block tracking-wide">
            #USR-00124
          </span>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-6" />

          {/* Metadata Rows */}
          <div className="w-full space-y-5 text-left">
            <div className="flex items-start gap-3.5">
              <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Role</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">User</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Joined</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">Jan 15, 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Personal Information (Takes remaining width) */}
        <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
          {/* Section Title */}
          <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
            Personal Information
          </h3>

          {/* Profile Picture Row */}
          <div className="flex items-center gap-4">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"
              alt="Profile Picture"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
            />
            <div>
              <h4 className="text-sm md:text-base font-bold text-[#18181B]">
                Profile Picture
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                User&apos;s profile image
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-6" />

          {/* Personal Info Rows */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Full Name</span>
                <span className="font-bold text-[#18181B]">John Smith</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
                <span className="font-bold text-[#18181B]">+113254415245</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
