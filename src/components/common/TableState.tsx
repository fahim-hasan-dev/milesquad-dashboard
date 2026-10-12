import React from "react";
import { Loader2 } from "lucide-react";

interface TableStateProps {
  loading?: boolean;
  isEmpty?: boolean;
  colSpan: number;
  loadingMessage?: string;
  emptyMessage?: string;
}

export default function TableState({
  loading,
  isEmpty,
  colSpan,
  loadingMessage = "Loading records...",
  emptyMessage = "No records found",
}: TableStateProps) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="py-12 text-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#10B981]" />
          <span className="text-sm font-medium">{loadingMessage}</span>
        </td>
      </tr>
    );
  }

  if (isEmpty) {
    return (
      <tr>
        <td colSpan={colSpan} className="py-12 text-center text-slate-400 text-sm font-medium">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return null;
}
