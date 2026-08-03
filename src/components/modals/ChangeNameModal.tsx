"use client";

import React, { useState } from "react";
import { UserPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface ChangeNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
  onUpdateName?: (newName: string) => void;
}

export default function ChangeNameModal({
  isOpen,
  onClose,
  currentName = "ABDOU",
  onUpdateName,
}: ChangeNameModalProps) {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    if (onUpdateName) {
      onUpdateName(newName.trim());
    }

    toast.success("Admin name updated successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-6 md:p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
              <UserPen className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Change Admin Name
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                Update your administrator display name
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Name Field (Read Only) */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="currentName" className="text-xs font-semibold text-slate-700">
              Current Name
            </Label>
            <Input
              id="currentName"
              type="text"
              value={currentName}
              disabled
              className="h-11 rounded-xl bg-slate-100/70 border border-slate-200 text-xs font-semibold text-slate-500 shadow-none px-4 cursor-not-allowed"
            />
          </div>

          {/* New Name Field */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="newName" className="text-xs font-semibold text-slate-700">
              New Name
            </Label>
            <Input
              id="newName"
              type="text"
              placeholder="Enter new admin name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-xs font-medium text-slate-800 shadow-none px-4"
              required
            />
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm rounded-xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
