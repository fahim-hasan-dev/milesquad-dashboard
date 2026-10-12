import React from "react";
import {
  MoreHorizontal,
  FileText,
  Check,
  X,
  User,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CopyButton from "@/components/common/CopyButton";
import StatusBadge from "@/components/common/StatusBadge";
import UserAvatar from "@/components/common/UserAvatar";
import TableState from "@/components/common/TableState";
import { TransactionItem } from "./types";

interface PayoutsTableProps {
  transactions: TransactionItem[];
  loading: boolean;
  onOpenReceipt: (t: TransactionItem) => void;
  onApprovePayout: (id: string) => void;
  onRejectPayout: (t: TransactionItem) => void;
}

export default function PayoutsTable({
  transactions,
  loading,
  onOpenReceipt,
  onApprovePayout,
  onRejectPayout,
}: PayoutsTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <th className="py-4 px-4">PAYOUT ID</th>
          <th className="py-4 px-4">RECIPIENT</th>
          <th className="py-4 px-4">ROLE</th>
          <th className="py-4 px-4">AMOUNT</th>
          <th className="py-4 px-4">ACCOUNT DETAILS</th>
          <th className="py-4 px-4">STATUS</th>
          <th className="py-4 px-4">DATE</th>
          <th className="py-4 px-4 text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <TableState
          loading={loading}
          isEmpty={transactions.length === 0}
          colSpan={8}
          loadingMessage="Loading payout records..."
          emptyMessage="No payout records found."
        />
        {!loading &&
          transactions.length > 0 &&
          transactions.map((row) => {
            const isDriver = row.user.role === "driver";

            return (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#10B981]">
                    <span>#{row.transactionId}</span>
                    <CopyButton text={row.transactionId} label="Payout ID" />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={row.user.avatar}
                      name={row.user.name}
                      size="md"
                    />
                    <div>
                      <span className="text-xs md:text-sm font-bold text-slate-900 block leading-tight">
                        {row.user.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        #{row.user.userId || row.user.id.slice(-6)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                    {isDriver ? (
                      <User className="h-3 w-3 text-slate-400" />
                    ) : (
                      <Building2 className="h-3 w-3 text-slate-400" />
                    )}
                    <span>{row.user.role || "Driver"}</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                  ${row.amount.toFixed(2)} XOF
                </td>
                <td className="py-4 px-4 text-xs font-medium text-slate-600 max-w-[180px] truncate">
                  {row.accountDetails || "N/A"}
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-4 px-4 text-xs font-medium text-slate-500">
                  {row.date}
                </td>
                <td className="py-4 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 p-1.5 rounded-xl shadow-lg border border-slate-100 space-y-1"
                    >
                      <DropdownMenuItem
                        onClick={() => onOpenReceipt(row)}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>View Receipt</span>
                      </DropdownMenuItem>

                      {(row.status === "pending" ||
                        row.status === "processing") && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onApprovePayout(row.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#10B981] py-2 cursor-pointer"
                          >
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span>Approve Payout</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onRejectPayout(row)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-500 py-2 cursor-pointer"
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span>Reject Payout</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
