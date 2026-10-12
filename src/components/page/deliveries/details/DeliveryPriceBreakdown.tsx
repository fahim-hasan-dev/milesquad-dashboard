import React from "react";
import { ParcelDetail } from "./types";

interface DeliveryPriceBreakdownProps {
  parcel: ParcelDetail;
  totalFee: number;
}

export default function DeliveryPriceBreakdown({
  parcel,
  totalFee,
}: DeliveryPriceBreakdownProps) {
  const baseFee =
    parcel.baseFee ??
    parcel.pricingDetails?.admin?.baseFee ??
    parcel.pricingDetails?.driver?.baseFee;

  const fuelCost =
    parcel.fuelCost ??
    parcel.pricingDetails?.admin?.fuelCost ??
    parcel.pricingDetails?.driver?.fuelCost;

  const timeCost =
    parcel.timeCost ??
    parcel.pricingDetails?.admin?.timeCost ??
    parcel.pricingDetails?.driver?.timeCost;

  const serviceFee =
    parcel.serviceFee ??
    parcel.pricingDetails?.admin?.serviceFee ??
    parcel.pricingDetails?.customer?.serviceFee;

  const goodInsurance =
    parcel.goodInsurance ??
    parcel.goodRisks ??
    parcel.pricingDetails?.admin?.goodInsurance ??
    parcel.pricingDetails?.customer?.goodInsurance;

  const overhead =
    parcel.overheadCost ??
    parcel.overhead ??
    parcel.pricingDetails?.admin?.overheadCost;

  const margin =
    parcel.milesquadMargin ??
    parcel.marginMilesquad ??
    parcel.pricingDetails?.admin?.milesquadMargin;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          PRICE BREAKDOWN
        </span>
        {parcel.paymentMethod && (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            {parcel.paymentMethod.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="space-y-2.5 text-xs font-medium">
        {typeof baseFee === "number" && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Base Fee</span>
            <span className="font-semibold text-slate-900">
              {baseFee.toFixed(2)} XOF
            </span>
          </div>
        )}

        {typeof fuelCost === "number" && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Fuel Cost</span>
            <span className="font-semibold text-slate-900">
              {fuelCost.toFixed(2)} XOF
            </span>
          </div>
        )}

        {typeof timeCost === "number" && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Time Cost</span>
            <span className="font-semibold text-slate-900">
              {timeCost.toFixed(2)} XOF
            </span>
          </div>
        )}

        {typeof serviceFee === "number" && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Service Fee</span>
            <span className="font-semibold text-slate-900">
              {serviceFee.toFixed(2)} XOF
            </span>
          </div>
        )}

        {typeof goodInsurance === "number" && goodInsurance > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Goods Insurance</span>
            <span className="font-semibold text-slate-900">
              {goodInsurance.toFixed(2)} XOF
            </span>
          </div>
        )}

        {typeof overhead === "number" && overhead > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Overhead</span>
            <span className="font-semibold text-slate-900">
              {overhead.toFixed(2)} XOF
            </span>
          </div>
        )}

        {typeof margin === "number" && margin > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Platform Margin</span>
            <span className="font-semibold text-slate-900">
              {margin.toFixed(2)} XOF
            </span>
          </div>
        )}

        {/* Total To Pay */}
        <div className="w-full border-t border-slate-200 pt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Total To Pay</span>
          <span className="text-xl font-black text-[#10B981]">
            {totalFee.toFixed(2)} XOF
          </span>
        </div>
      </div>
    </div>
  );
}
