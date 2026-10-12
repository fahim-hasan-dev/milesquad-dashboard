import React from "react";
import {
  MoreHorizontal,
  FileText,
  Smartphone,
  Building,
  CreditCard,
  Banknote,
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

interface PaymentsTableProps {
  transactions: TransactionItem[];
  loading: boolean;
  onOpenReceipt: (t: TransactionItem) => void;
}

export default function PaymentsTable({
  transactions,
  loading,
  onOpenReceipt,
}: PaymentsTableProps) {
  const getMethodIcon = (method: string) => {
    const m = (method || "").toLowerCase();
    if (m.includes("mobile") || m.includes("momo") || m.includes("wave"))
      return Smartphone;
    if (m.includes("bank") || m.includes("transfer")) return Building;
    if (m.includes("card") || m.includes("stripe")) return CreditCard;
    return Banknote;
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <th className="py-4 px-4">TRANSACTION ID</th>
          <th className="py-4 px-4">CUSTOMER</th>
          <th className="py-4 px-4">AMOUNT</th>
          <th className="py-4 px-4">METHOD</th>
          <th className="py-4 px-4">STATUS</th>
          <th className="py-4 px-4">DATE</th>
          <th className="py-4 px-4 text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <TableState
          loading={loading}
          isEmpty={transactions.length === 0}
          colSpan={7}
          loadingMessage="Loading payment transactions..."
          emptyMessage="No payment transactions found."
        />
        {!loading &&
          transactions.length > 0 &&
          transactions.map((row) => {
            const MethodIcon = getMethodIcon(row.paymentMethod);

            return (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#10B981]">
                    <span>#{row.transactionId}</span>
                    <CopyButton text={row.transactionId} label="Transaction ID" />
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
                <td className="py-4 px-4 text-xs md:text-sm font-bold text-slate-900">
                  ${row.amount.toFixed(2)} XOF
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/50">
                    <MethodIcon className="h-3.5 w-3.5 text-slate-400" />
                    <span>{row.paymentMethod}</span>
                  </span>
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
                      className="w-40 p-1.5 rounded-xl shadow-lg border border-slate-100"
                    >
                      <DropdownMenuItem
                        onClick={() => onOpenReceipt(row)}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-2 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>View Receipt</span>
                      </DropdownMenuItem>
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
