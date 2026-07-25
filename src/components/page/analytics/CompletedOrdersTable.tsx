"use client";

import { Copy, FileSpreadsheet } from "lucide-react";
import toast from "react-hot-toast";

const orders = [
  {
    sl: 1,
    bookingId: "FM-BKG-000050",
    customerName: "Donald",
    providerContact: "27791135003",
    price: "R3600",
    operationalFee: "R360",
    platformFee: "R180",
    bookingDate: "11 Jun 2026",
    status: "DELIVERED",
  },
  {
    sl: 2,
    bookingId: "FM-BKG-000049",
    customerName: "Donald",
    providerContact: "27656648349",
    price: "R200",
    operationalFee: "R20",
    platformFee: "R10",
    bookingDate: "11 Jun 2026",
    status: "DELIVERED",
  },
  {
    sl: 3,
    bookingId: "FM-BKG-000048",
    customerName: "Donald",
    providerContact: "27656648349",
    price: "R200",
    operationalFee: "R20",
    platformFee: "R10",
    bookingDate: "11 Jun 2026",
    status: "DELIVERED",
  },
];

export default function CompletedOrdersTable() {
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied ${id}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6">
      {/* Table Header & Download Action */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Completed Orders</h3>

        <button className="flex items-center gap-2 border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 text-xs font-semibold rounded-lg px-4 py-2 transition-colors cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Download Excel</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs font-medium text-slate-600 border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">SL</th>
              <th className="py-3 px-3">Booking ID</th>
              <th className="py-3 px-3">Customer Name</th>
              <th className="py-3 px-3">Provider Contact</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Operational Fee</th>
              <th className="py-3 px-3">Platform Fee</th>
              <th className="py-3 px-3">Booking Date</th>
              <th className="py-3 px-3 text-center">Order Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((row) => (
              <tr key={row.bookingId} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-3 text-slate-500">{row.sl}</td>
                <td className="py-4 px-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span>{row.bookingId}</span>
                    <button
                      onClick={() => handleCopy(row.bookingId)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-3 text-slate-700">{row.customerName}</td>
                <td className="py-4 px-3 text-slate-500">{row.providerContact}</td>
                <td className="py-4 px-3 font-bold text-blue-600">{row.price}</td>
                <td className="py-4 px-3 font-bold text-blue-600">{row.operationalFee}</td>
                <td className="py-4 px-3 font-bold text-blue-600">{row.platformFee}</td>
                <td className="py-4 px-3 text-slate-500">{row.bookingDate}</td>
                <td className="py-4 px-3 text-center">
                  <span className="inline-block border border-emerald-300 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full px-3 py-0.5 uppercase tracking-wide">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
