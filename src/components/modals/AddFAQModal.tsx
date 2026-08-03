/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AddFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFAQ: (newFaq: any) => void;
}

export default function AddFAQModal({
  isOpen,
  onClose,
  onAddFAQ,
}: AddFAQModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    if (!question || !answer) {
      toast.error("Please fill in both question and answer");
      return;
    }

    onAddFAQ({ question, answer });
    toast.success("New FAQ added!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-center">
            Add New FAQ
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="question" className="text-xs font-semibold text-slate-700">
              Question
            </Label>
            <Input
              id="question"
              name="question"
              type="text"
              placeholder="Enter your question"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Answer */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="answer" className="text-xs font-semibold text-slate-700">
              Answer
            </Label>
            <Input
              id="answer"
              name="answer"
              type="text"
              placeholder="Enter your answer"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm px-10 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
