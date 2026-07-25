"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Calendar, Clock, User, Mail, Bike } from "lucide-react";
import SuspendUserModal from "@/components/modals/SuspendUserModal";
import toast from "react-hot-toast";

export default function RiderDetailsPage() {
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  const handleConfirmSuspend = () => {
    toast.success("Rider account has been suspended");
  };

  const handleTrackUser = () => {
    toast.success("Opening live tracking...");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/riders"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Page Title & Top Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            View User Details
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Complete information about this user account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTrackUser}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
          >
            Track User
          </button>
          <button
            onClick={() => setIsSuspendModalOpen(true)}
            className="border border-red-200/90 text-red-500 hover:bg-red-50/70 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer bg-white shadow-none"
          >
            Suspend User
          </button>
        </div>
      </div>

      {/* Row 1: Profile Summary & Personal Info */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Card: Summary Card (Fixed ~360px on desktop) */}
        <div className="w-full lg:w-[360px] shrink-0 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          {/* Avatar Picture */}
          <div className="relative mb-3">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"
              alt="John Smith"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
            />
          </div>

          {/* User Name & ID */}
          <h2 className="text-xl font-bold text-[#18181B] tracking-tight">
            John Smith
          </h2>
          <span className="text-xs font-medium text-slate-400 mt-0.5 mb-3 block">
            #USR-00124
          </span>

          {/* Green Driver Badge */}
          <span className="inline-block bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            Driver
          </span>

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-5" />

          {/* Metadata Rows */}
          <div className="w-full space-y-4 text-left">
            <div className="flex items-start gap-3.5">
              <Shield className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Role</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">Driver</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Joined</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">Jan 15, 2024</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-400">Last Active</span>
                <span className="block text-sm font-bold text-[#18181B] mt-0.5">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Personal Information */}
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

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Email</span>
                <span className="font-bold text-[#18181B]">john.smith@email.com</span>
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="flex items-center gap-3">
              <Bike className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-6 text-sm">
                <span className="w-32 md:w-44 font-medium text-slate-500">Vehicle Type</span>
                <span className="font-bold text-[#18181B]">Car</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Document Scans Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* National ID Card (2 images: Front & Back) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 px-1">National ID Card</h4>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
            <div className="relative flex-1 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400"
                alt="ID Card Front"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400"
                alt="ID Card Back"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Driving License / ID Card (1 image) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 px-1">National ID Card</h4>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400"
                alt="Driving License"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Confirmation Modal */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
      />
    </div>
  );
}
