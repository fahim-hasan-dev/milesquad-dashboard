"use client";

import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (newAdmin: { name: string; email: string; password: string }) => void;
}

export default function AddAdminModal({
  isOpen,
  onClose,
  onAddAdmin,
}: AddAdminModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAddAdmin({ name, email, password });
    toast.success("New Admin created successfully!");
    
    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-center space-y-1">
          <div className="size-12 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto mb-2">
            <UserPlus className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-center">
            Add New Admin
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Enter admin name, email address, and account password.
          </p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="adminName" className="text-xs font-semibold text-slate-700">
              Admin Name
            </Label>
            <Input
              id="adminName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="adminEmail" className="text-xs font-semibold text-slate-700">
              Email Address
            </Label>
            <Input
              id="adminEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="adminPassword" className="text-xs font-semibold text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="adminPassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                required
                className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors cursor-pointer shadow-none"
            >
              Add Admin
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
