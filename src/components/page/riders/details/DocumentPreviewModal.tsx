import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentPreviewModalProps {
  previewDoc: { url: string; title: string } | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({
  previewDoc,
  onClose,
}: DocumentPreviewModalProps) {
  if (!previewDoc) return null;

  return (
    <Dialog open={Boolean(previewDoc)} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 border-none shadow-2xl flex flex-col gap-4">
        <DialogHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-base md:text-lg font-bold text-slate-900">
              {previewDoc.title}
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Full inspection view of rider document.
            </p>
          </div>
        </DialogHeader>

        <div className="relative w-full h-[380px] md:h-[460px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Image
            src={previewDoc.url}
            alt={previewDoc.title}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close Preview
          </button>
          <a
            href={previewDoc.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-colors cursor-pointer shadow-none"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Original in New Tab</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
