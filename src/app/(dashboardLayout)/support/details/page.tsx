"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, Eye, CheckCircle2, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import {
  masterSupportTicketsList,
  SupportTicketRecord,
} from "@/demoData/supportManagementData";

export interface ExtendedSupportTicketRecord extends SupportTicketRecord {
  rawId?: string;
}

function SupportDetailsContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryId = searchParams.get("id");
  const routeId = params ? (params.id as string) : null;
  const rawId = queryId || routeId || "SUP-001";

  const [ticket, setTicket] = useState<ExtendedSupportTicketRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [ticketStatus, setTicketStatus] = useState<"Pending" | "Solved">("Pending");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTicketDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await myFetch(`/support/${rawId}`);
      if (res.success && res.data) {
        const item = res.data;
        const user = item.user || {};
        const formatted: ExtendedSupportTicketRecord = {
          id: item.ticketId || item._id,
          rawId: item._id,
          userName: user.fullName || item.userName || "User",
          userEmail: user.email || item.userEmail || "N/A",
          userLocation: user.address || user.location || item.userLocation || "N/A",
          userAvatar:
            (user.image ? getImageUrl(user.image) : "") ||
            item.userAvatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
          title: item.title,
          contact: user.phone || item.contact || "N/A",
          status: item.status === "solved" ? "Solved" : "Pending",
          date: item.createdAt
            ? new Date(item.createdAt).toISOString().slice(0, 10)
            : item.date || "N/A",
          message: item.message,
          reply: item.reply || "",
          attachmentUrl: item.files?.[0] ? getImageUrl(item.files[0]) : item.attachmentUrl,
          pdfAttachment: item.pdfAttachment,
        };

        setTicket(formatted);
        setReplyText(item.reply || "Our support team is reviewing your ticket and will update you shortly.");
        setTicketStatus(item.status === "solved" ? "Solved" : "Pending");
      } else {
        const fallback = masterSupportTicketsList.find(
          (t) => t.id.toUpperCase() === rawId.toUpperCase()
        ) || masterSupportTicketsList[0];
        setTicket(fallback);
        setReplyText(fallback.reply || "Our support team is reviewing your ticket.");
        setTicketStatus(fallback.status);
      }
    } catch (err) {
      console.error("Error loading ticket details:", err);
      const fallback = masterSupportTicketsList[0];
      setTicket(fallback);
      setReplyText(fallback.reply || "");
      setTicketStatus(fallback.status);
    } finally {
      setLoading(false);
    }
  }, [rawId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleResolve = async () => {
    if (!ticket) return;
    setActionLoading(true);
    const targetId = ticket.rawId || ticket.id;
    try {
      const res = await myFetch(`/support/${targetId}/status`, {
        method: "PATCH",
        body: { status: "solved" },
      });

      if (res.success) {
        setTicketStatus("Solved");
        toast.success(`Support ticket ${ticket.id} marked as Resolved!`);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!ticket) return;
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    setActionLoading(true);
    const targetId = ticket.rawId || ticket.id;
    try {
      const res = await myFetch(`/support/${targetId}/reply`, {
        method: "PATCH",
        body: { reply: replyText.trim(), status: "solved" },
      });

      if (res.success) {
        setTicketStatus("Solved");
        toast.success("Reply sent and ticket resolved!");
      } else {
        toast.error(res.message || "Failed to send reply");
      }
    } catch (err: any) {
      console.error("Send reply error:", err);
      toast.error("Failed to send reply");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium flex items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />
        <span>Loading support ticket details...</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium">
        Support ticket not found.
      </div>
    );
  }

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
