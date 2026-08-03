"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, Eye, CheckCircle2, Send } from "lucide-react";
import toast from "react-hot-toast";
import {
  masterSupportTicketsList,
  SupportTicketRecord,
} from "@/demoData/supportManagementData";

function SupportDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const rawId = queryId || routeId || "SUP-001";
  const formattedId = rawId.toUpperCase();

  // Find ticket record dynamically
  const matchedTicket = masterSupportTicketsList.find(
    (t) => t.id.toUpperCase() === formattedId
  );

  const ticket: SupportTicketRecord = matchedTicket || masterSupportTicketsList[0];

  const [replyText, setReplyText] = useState(
    ticket.reply || "Our support team is reviewing your ticket and will update you shortly."
  );
  const [ticketStatus, setTicketStatus] = useState<"Pending" | "Solved">(
    ticket.status
  );

  const handleResolve = () => {
    setTicketStatus("Solved");
    toast.success(`Support ticket ${ticket.id} marked as Resolved!`);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    toast.success("Reply sent to customer!");
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
          <span>Back to Requests</span>
        </Link>
      </div>

      {/* Page Title & Ticket ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Support Ticket Details
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500 font-normal">Ticket ID:</span>
            <span className="text-sm font-bold text-[#10B981]">{ticket.id}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="self-start sm:self-auto">
          {ticketStatus === "Solved" ? (
            <span className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#10B981] text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Resolved</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-bold px-4 py-1.5 rounded-full border border-amber-200">
              <span>Pending Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Support Details Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm space-y-8">
        {/* Top 4 Info Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="block text-xs font-semibold text-slate-400">From :</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{ticket.userName}</h4>
            <span className="text-[11px] text-slate-400 font-normal">{ticket.userEmail}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400">Date :</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{ticket.date}</h4>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400">Status :</span>
            <div className="mt-1">
              {ticketStatus === "Solved" ? (
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
            <h4 className="text-sm font-bold text-slate-900 mt-1">{ticket.title}</h4>
          </div>
        </div>

        {/* Attached Screenshot Image Banner */}
        <div className="relative w-full h-[260px] md:h-[320px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner flex items-center justify-center">
          <Image
            src={
              ticket.attachmentUrl ||
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200"
            }
            alt="Attached Screenshot"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* PDF Attachment Badge Row */}
        {ticket.pdfAttachment && (
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-md">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-100 text-red-500 font-black text-xs flex items-center justify-center shrink-0">
                PDF
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">{ticket.pdfAttachment}</h5>
                <span className="text-[10px] text-slate-400 font-medium">1.2 MB</span>
              </div>
            </div>

            <button
              onClick={() => toast.success(`Opening ${ticket.pdfAttachment} preview...`)}
              className="p-2 rounded-xl bg-white text-slate-500 hover:text-[#10B981] border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Message Box */}
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-800">Message :</span>
          <div className="bg-[#F8FAFC] border border-slate-200/70 p-4 md:p-5 rounded-2xl text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
            {ticket.message}
          </div>
        </div>

        {/* Your Reply Box */}
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-800">Your Reply :</span>
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your response to the user here..."
            className="w-full bg-[#F8FAFC] border border-slate-200/70 p-4 md:p-5 rounded-2xl text-xs md:text-sm text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#10B981] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={handleResolve}
            disabled={ticketStatus === "Solved"}
            className="w-full sm:w-48 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm py-3.5 px-8 rounded-2xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{ticketStatus === "Solved" ? "Resolved" : "Mark as Resolved"}</span>
          </button>

          <button
            onClick={handleSendReply}
            className="w-full sm:w-48 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-8 rounded-2xl transition-all shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Send Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SupportDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 font-medium">
          Loading support ticket details...
        </div>
      }
    >
      <SupportDetailsContent />
    </Suspense>
  );
}
