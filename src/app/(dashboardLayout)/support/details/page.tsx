"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SupportDetailsPage() {
  const [replyText, setReplyText] = useState("Jbasdfkjbadfkjfkasjbndkjasbndkj");
  const [isResolved, setIsResolved] = useState(false);

  const handleResolve = () => {
    setIsResolved(true);
    toast.success("Support ticket marked as Resolved!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Request</span>
        </Link>
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Help &amp; Support
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Solve the problems of the users.
        </p>
      </div>

      {/* Main Support Details Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm space-y-8">
        {/* Top 4 Info Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="block text-xs font-semibold text-slate-400">From :</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Sohidul</h4>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400">Date :</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">2024-01-15</h4>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400">Status :</span>
            <div className="mt-1">
              {isResolved ? (
                <span className="inline-block bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-3 py-1 rounded-full">
                  Resolved
                </span>
              ) : (
                <span className="inline-block bg-[#FEF3C7] text-[#D97706] text-xs font-bold px-3 py-1 rounded-full">
                  Pending
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400">Title :</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">Id Cars Issue</h4>
          </div>
        </div>

        {/* Attached Screenshot Image Banner */}
        <div className="relative w-full h-[260px] md:h-[320px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200"
            alt="Attached Screenshot"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* PDF Attachment Badge Row */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-100 text-red-500 font-black text-xs flex items-center justify-center shrink-0">
              PDF
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">error_log_report.pdf</h5>
              <span className="text-[10px] text-slate-400 font-medium">1.2 MB</span>
            </div>
          </div>

          <button
            onClick={() => toast.success("Opening PDF preview...")}
            className="p-2 rounded-xl bg-white text-slate-500 hover:text-[#10B981] border border-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Message Box */}
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-800">Message :</span>
          <div className="bg-[#F8FAFC] border border-slate-200/70 p-4 md:p-5 rounded-2xl text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
            Im Having Issue With The Log In System.It Keeps Showing An Error.
          </div>
        </div>

        {/* Your Reply Box */}
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-800">Your Reply :</span>
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200/70 p-4 md:p-5 rounded-2xl text-xs md:text-sm text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#10B981] resize-none"
          />
        </div>

        {/* Resolved Action Button */}
        <div className="pt-2">
          <button
            onClick={handleResolve}
            className="w-full md:w-48 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm py-3.5 px-8 rounded-2xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Resolved</span>
          </button>
        </div>
      </div>
    </div>
  );
}
