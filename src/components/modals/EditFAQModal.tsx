"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { FAQItem } from "@/demoData/faqManagementData";

interface EditFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQItem | null;
  onUpdateFAQ: (updatedFaq: FAQItem) => void;
}

export default function EditFAQModal({
  isOpen,
  onClose,
  faq,
  onUpdateFAQ,
}: EditFAQModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question || "");
      setAnswer(faq.answer || "");
    }
  }, [faq]);

  if (!faq) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!question || !answer) {
      toast.error("Please fill in both question and answer");
      return;
    }

    onUpdateFAQ({
      ...faq,
      question,
      answer,
    });
    toast.success("FAQ updated successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-center">
            Edit FAQ Item
          </DialogTitle>
          <p className="text-xs text-slate-400 font-normal">
            Update the question and answer details below.
          </p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editQuestion" className="text-xs font-semibold text-slate-700">
              Question
            </Label>
            <Input
              id="editQuestion"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question"
              required
              className="h-11 rounded-xl bg-[#F8FAFC] border border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none"
            />
          </div>

          {/* Answer */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="editAnswer" className="text-xs font-semibold text-slate-700">
              Answer
            </Label>
            <textarea
              id="editAnswer"
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer"
              required
              className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-3 focus-visible:ring-1 focus-visible:ring-[#10B981] text-sm shadow-none focus:outline-none text-slate-800 resize-none font-normal"
            />
          </div>

          {/* Submit Action Buttons */}
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
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
