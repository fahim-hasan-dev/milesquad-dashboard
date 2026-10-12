import React from "react";
import Link from "next/link";
import { Bike, MoreHorizontal, Eye, Check, X, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";
import TableState from "@/components/common/TableState";
import CopyButton from "@/components/common/CopyButton";
import { DriverItem } from "./types";

interface PendingRidersTableProps {
  newRequests: DriverItem[];
  loading: boolean;
  onApproveDriver: (id: string) => void;
  onRejectDriver: (driver: DriverItem) => void;
  onDeleteDriver: (id: string) => void;
}

export default function PendingRidersTable({
  newRequests,
  loading,
  onApproveDriver,
  onRejectDriver,
  onDeleteDriver,
}: PendingRidersTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <th className="py-4 px-4">DRIVER NAME</th>
          <th className="py-4 px-4">VEHICLE TYPE</th>
          <th className="py-4 px-4">DATE APPLIED</th>
          <th className="py-4 px-4 text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <TableState
          loading={loading}
          isEmpty={newRequests.length === 0}
          colSpan={4}
          loadingMessage="Loading driver requests..."
          emptyMessage="No pending driver requests found."
        />
        {!loading &&
          newRequests.length > 0 &&
          newRequests.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={row.avatar}
                    name={row.name}
                    size="lg"
                    shape="rounded"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {row.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5 font-medium">
                      <span>#{row.userId || row.id.slice(-6)}</span>
                      <CopyButton text={row.userId || row.id} label="Rider ID" />
                    </div>
                  </div>
                </div>
              </td>

              <td className="py-4 px-4">
                <span className="inline-flex items-center gap-1.5 bg-[#FFF7ED] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/50">
                  <Bike className="h-3.5 w-3.5" />
                  <span>{row.vehicle}</span>
                </span>
              </td>

              <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                {row.dateApplied}
              </td>

              <td className="py-4 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1"
                  >
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href={`/riders/details?id=${row.id}`}
                        className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2"
                      >
                        <Eye className="h-4 w-4 text-slate-500" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onApproveDriver(row.id)}
                      className="flex items-center gap-2.5 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                    >
                      <Check className="h-4 w-4 text-[#10B981]" />
                      <span>Approve Driver</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onRejectDriver(row)}
                      className="flex items-center gap-2.5 text-xs font-semibold text-[#D97706] py-2 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-[#D97706]" />
                      <span>Reject Driver</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onDeleteDriver(row.id)}
                      className="flex items-center gap-2.5 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span>Remove User</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
