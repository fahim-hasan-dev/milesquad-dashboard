"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "ID", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied!`, { id: `copy-${text}` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy ${label}`}
      className={`p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center justify-center cursor-pointer shrink-0 ${className}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#10B981]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
