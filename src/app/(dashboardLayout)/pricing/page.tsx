"use client";

import { useState } from "react";
import {
  Bike,
  Car,
  Truck,
  CreditCard,
  Clock,
  Zap,
  Fuel,
  Weight,
  Box,
  Percent,
  User,
  Shield,
  Save,
  Sliders,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PricingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("Bike");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const vehicles = [
    { name: "Bike", icon: Bike },
    { name: "Tricycle", icon: Bike },
    { name: "Car", icon: Car },
    { name: "Van", icon: Truck },
    { name: "Truck", icon: Truck },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Settings
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-normal">
            Configure delivery fares, distance pricing, and platform commission.
          </p>
        </div>
      </div>

      {/* FARE SETTINGS Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            FARE SETTINGS
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Base costs applied at the start and during each delivery.
          </p>
        </div>

        {/* Vehicle Selection Tabs */}
        <div className="bg-slate-100/70 p-1.5 rounded-2xl w-fit flex flex-wrap items-center gap-2 border border-slate-200/60">
          {vehicles.map((v) => {
            const Icon = v.icon;
            const isSelected = selectedVehicle === v.name;
            return (
              <button
                key={v.name}
                onClick={() => setSelectedVehicle(v.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>

        {/* 7 Input Card Rows */}
        <div className="space-y-3">
          {/* Base Fee */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">Base Fee</span>
            <div className="relative flex items-center">
              <CreditCard className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                XOF
              </span>
            </div>
          </div>

          {/* Free Time */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">Free Time</span>
            <div className="relative flex items-center">
              <Clock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                min
              </span>
            </div>
          </div>

          {/* Time Rate */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">Time Rate</span>
            <div className="relative flex items-center">
              <Zap className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                XOF / min
              </span>
            </div>
          </div>

          {/* Fuel Rate */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">Fuel Rate</span>
            <div className="relative flex items-center">
              <Fuel className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                XOF / km
              </span>
            </div>
          </div>

          {/* Maximum Weight */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">
              Maximum Weight
            </span>
            <div className="relative flex items-center">
              <Weight className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                Kg
              </span>
            </div>
          </div>

          {/* Maximum Volume */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">
              Maximum Volume
            </span>
            <div className="relative flex items-center">
              <Box className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                m³
              </span>
            </div>
          </div>

          {/* Load factor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <span className="block text-xs font-bold text-slate-800">Load factor</span>
            <div className="relative flex items-center">
              <Truck className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={0}
                className="w-full h-11 pl-10 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
        {/* Card Header */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Configuration</h3>
            <p className="text-xs text-slate-400 font-normal">
              Pricing and risk settings for bike deliveries.
            </p>
          </div>
        </div>

        {/* Commission Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Commission</h4>
            <p className="text-xs text-slate-400 font-normal">
              Margin split between the platform and riders per delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform Margin */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">
                Platform Margin
              </span>
              <div className="relative flex items-center">
                <Percent className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>

            {/* Riders Margin */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">
                Riders Margin
              </span>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Index Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Risk Index</h4>
            <p className="text-xs text-slate-400 font-normal">
              Insurance tier applied based on declared goods value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Index 1 */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">
                Risk Index 1
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">
                Goods &lt; 50,000 XOF
              </span>
              <div className="relative flex items-center">
                <Shield className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>

            {/* Risk Index 2 */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">
                Risk Index 2
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">
                Goods &gt; 50,001 and &lt;150,000 XOF
              </span>
              <div className="relative flex items-center">
                <Shield className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>

            {/* Risk Index 3 */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">
                Risk Index 3
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">
                Goods &gt; 150,001 and &lt;250,000 XOF
              </span>
              <div className="relative flex items-center">
                <Shield className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  defaultValue={0}
                  className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                />
                <span className="absolute right-4 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-none cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
