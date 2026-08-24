"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { Loader2 } from "lucide-react";

interface AddFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: "customer" | "rider";
  onSuccess: () => void;
}

export default function AddFAQModal({
  isOpen,
  onClose,
  targetRole,
  onSuccess,
}: AddFAQModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = (formData.get("question") as string)?.trim();
    const answer = (formData.get("answer") as string)?.trim();

    if (!question || !answer) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setSubmitting(true);
    toast.loading("Creating new FAQ...", { id: "create-faq" });

    try {
      const res = await myFetch("/public/faq", {
        method: "POST",
        body: {
          question,
          answer,
          target: targetRole,
        },
      });

      if (res.success) {
        toast.success("New FAQ added successfully!", { id: "create-faq" });
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || res.error || "Failed to create FAQ", {
          id: "create-faq",
        });
      }
    } catch {
      toast.error("Error creating FAQ", { id: "create-faq" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-center">
            Add New {targetRole === "customer" ? "Customer" : "Driver"} FAQ
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="question" className="text-xs font-semibold text-slate-700">
              Question <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="question"
              name="question"
              type="text"
              placeholder="Enter question"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Answer */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="answer" className="text-xs font-semibold text-slate-700">
              Answer <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <textarea
              id="answer"
              name="answer"
              rows={4}
              placeholder="Enter answer"
              required
              className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-3 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none focus:outline-none text-slate-800 resize-none font-normal"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm px-10 py-2.5 rounded-xl transition-all shadow-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Add FAQ</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
