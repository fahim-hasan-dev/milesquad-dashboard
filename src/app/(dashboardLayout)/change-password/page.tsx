"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and Confirm password do not match");
      return;
    }
    toast.success("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Password Change
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm space-y-6">
        {/* Section Header */}
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-bold text-[#18181B]">
            Choose a New Password
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-normal">
            Enter and confirm your new password to regain access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full h-12 pl-11 pr-12 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-12 pl-11 pr-12 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-12 pl-11 pr-12 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm px-10 py-3.5 rounded-2xl transition-all shadow-none cursor-pointer min-w-[140px]"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
