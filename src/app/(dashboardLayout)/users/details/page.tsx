"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  PauseCircle,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import { masterUsersList, UserRecord } from "@/demoData/usersManagementData";

function UserDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const rawId = queryId || routeId || "USR-00101";
  const userId = rawId.toUpperCase();

  // Dynamically find user from master dataset
  const matchedUser = masterUsersList.find(
    (u) => u.id.toUpperCase() === userId
  );

  const initialUser: UserRecord = matchedUser || masterUsersList[0];
  const [userStatus, setUserStatus] = useState<string>(initialUser.status);

  const toggleStatus = () => {
    if (userStatus === "Active") {
      setUserStatus("Suspended");
      toast.success(`User ${initialUser.name} (${initialUser.id}) has been suspended`);
    } else {
      setUserStatus("Active");
      toast.success(`User ${initialUser.name} (${initialUser.id}) has been activated`);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active</span>
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/60">
            <XCircle className="h-3.5 w-3.5" />
            <span>Suspended</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/60">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending</span>
          </span>
        );
      case "Inactive":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/60">
            <PauseCircle className="h-3.5 w-3.5" />
            <span>Inactive</span>
          </span>
        );
    }
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
          onClick={toggleStatus}
          className={`self-start sm:self-auto text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none border ${
            userStatus === "Active"
              ? "border-red-200 text-red-500 hover:bg-red-50"
              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          {userStatus === "Active" ? "Suspend User" : "Activate User"}
        </button>
      </div>

      {/* 2-Card Layout Container */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Card: Summary Card (Fixed ~360px on desktop) */}
        <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          {/* Avatar Picture */}
          <div className="relative mb-4">
            <Image
              src={initialUser.avatar}
              alt={initialUser.name}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-50 shadow-sm"
            />
          </div>

          {/* User Name & ID */}
          <h2 className="text-xl md:text-2xl font-bold text-[#18181B] tracking-tight">
            {initialUser.name}
          </h2>
          <span className="text-xs font-medium text-slate-400 mt-1 mb-3 block tracking-wide">
            #{initialUser.id}
          </span>

          {/* Status Badge */}
          <div className="mb-2">{renderStatusBadge(userStatus)}</div>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-6" />

          {/* Metadata Rows */}
          <div className="w-full space-y-5 text-left">
            <div className="flex items-start gap-3.5">
              <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Role</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {initialUser.role}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Location</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {initialUser.location}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Joined</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">
                  {initialUser.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Personal & Account Information (Takes remaining width) */}
        <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
          {/* Section Title */}
          <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
            Personal Information
          </h3>

          {/* Profile Picture Row */}
          <div className="flex items-center gap-4">
            <Image
              src={initialUser.avatar}
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
                <span className="font-bold text-[#18181B]">{initialUser.name}</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Email Address</span>
                <span className="font-bold text-[#18181B]">{initialUser.email}</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
                <span className="font-bold text-[#18181B]">{initialUser.contact}</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Total Orders</span>
                <span className="font-bold text-[#18181B]">{initialUser.totalOrders} Orders</span>
              </div>
            </div>

            {/* Total Revenue / Spent */}
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Total Volume</span>
                <span className="font-bold text-[#10B981]">{initialUser.totalSpent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 font-medium">
          Loading user details...
        </div>
      }
    >
      <UserDetailsContent />
    </Suspense>
  );
}
