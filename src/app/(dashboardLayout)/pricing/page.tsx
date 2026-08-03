"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

const vehicleDataDefaults: Record<
  string,
  {
    baseFee: number;
    freeTime: number;
    timeRate: number;
    fuelRate: number;
    maxWeight: number;
    maxVolume: number;
    loadFactor: number;
    scheduleDelivery: number;
    platformMargin: number;
    ridersMargin: number;
    risk1: number;
    risk2: number;
    risk3: number;
  }
> = {
  Bike: {
    baseFee: 500,
    freeTime: 10,
    timeRate: 50,
    fuelRate: 100,
    maxWeight: 20,
    maxVolume: 1.5,
    loadFactor: 10,
    scheduleDelivery: 5,
    platformMargin: 20,
    ridersMargin: 80,
    risk1: 2.0,
    risk2: 3.5,
    risk3: 5.0,
  },
  Tricycle: {
    baseFee: 800,
    freeTime: 12,
    timeRate: 60,
    fuelRate: 140,
    maxWeight: 100,
    maxVolume: 4.0,
    loadFactor: 15,
    scheduleDelivery: 8,
    platformMargin: 22,
    ridersMargin: 78,
    risk1: 2.0,
    risk2: 3.5,
    risk3: 5.0,
  },
  Car: {
    baseFee: 1500,
    freeTime: 15,
    timeRate: 100,
    fuelRate: 250,
    maxWeight: 350,
    maxVolume: 8.0,
    loadFactor: 20,
    scheduleDelivery: 10,
    platformMargin: 25,
    ridersMargin: 75,
    risk1: 2.5,
    risk2: 4.0,
    risk3: 6.0,
  },
  Van: {
    baseFee: 3000,
    freeTime: 20,
    timeRate: 150,
    fuelRate: 400,
    maxWeight: 1200,
    maxVolume: 18.0,
    loadFactor: 25,
    scheduleDelivery: 12,
    platformMargin: 25,
    ridersMargin: 75,
    risk1: 3.0,
    risk2: 4.5,
    risk3: 6.5,
  },
  Truck: {
    baseFee: 6000,
    freeTime: 30,
    timeRate: 250,
    fuelRate: 750,
    maxWeight: 5000,
    maxVolume: 45.0,
    loadFactor: 30,
    scheduleDelivery: 15,
    platformMargin: 30,
    ridersMargin: 70,
    risk1: 3.5,
    risk2: 5.0,
    risk3: 7.5,
  },
};

export default function PricingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("Bike");
  const [formData, setFormData] = useState(vehicleDataDefaults["Bike"]);

  useEffect(() => {
    setFormData(vehicleDataDefaults[selectedVehicle] || vehicleDataDefaults["Bike"]);
  }, [selectedVehicle]);

  const handleChange = (field: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success(`Settings saved successfully for ${selectedVehicle}!`);
  };

  const vehicles = [
    { name: "Bike", icon: Bike },
    { name: "Tricycle", icon: Bike },
    { name: "Car", icon: Car },
    { name: "Van", icon: Truck },
    { name: "Truck", icon: Truck },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center shrink-0">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Configure delivery fares, distance pricing, and platform commission.
          </p>
        </div>
      </div>

      {/* FARE SETTINGS Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            FARE SETTINGS
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Base costs applied at the start and during each delivery.
          </p>
        </div>

        {/* Vehicle Selection Tabs */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-1 w-fit">
          {vehicles.map((v) => {
            const Icon = v.icon;
            const isSelected = selectedVehicle === v.name;
            return (
              <button
                key={v.name}
                onClick={() => setSelectedVehicle(v.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>

        {/* 7 Individual White Cards matching the screenshot */}
        <div className="space-y-3">
          {/* Base Fee */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Base Fee</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.baseFee}
                onChange={(e) => handleChange("baseFee", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">XOF</span>
            </div>
          </div>

          {/* Free Time */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Free Time</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.freeTime}
                onChange={(e) => handleChange("freeTime", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">min</span>
            </div>
          </div>

          {/* Time Rate */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Time Rate</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Zap className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.timeRate}
                onChange={(e) => handleChange("timeRate", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">XOF / min</span>
            </div>
          </div>

          {/* Fuel Rate */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Fuel Rate</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Fuel className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.fuelRate}
                onChange={(e) => handleChange("fuelRate", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">XOF / km</span>
            </div>
          </div>

          {/* Maximum Weight */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Maximum Weight</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Weight className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.maxWeight}
                onChange={(e) => handleChange("maxWeight", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">Kg</span>
            </div>
          </div>

          {/* Maximum Volume */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Maximum Volume</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Box className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.maxVolume}
                onChange={(e) => handleChange("maxVolume", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">m³</span>
            </div>
          </div>

          {/* Load factor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Load factor</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Truck className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.loadFactor}
                onChange={(e) => handleChange("loadFactor", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
            </div>
          </div>

          {/* Schedule delivery */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-800">Schedule delivery</label>
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="number"
                value={formData.scheduleDelivery}
                onChange={(e) => handleChange("scheduleDelivery", Number(e.target.value))}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Card at Bottom */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
        {/* Card Header */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center shrink-0">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Configuration</h3>
            <p className="text-xs text-slate-400 font-normal">
              Pricing and risk settings for {selectedVehicle.toLowerCase()} deliveries.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Margin */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Platform Margin</label>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Percent className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formData.platformMargin}
                  onChange={(e) => handleChange("platformMargin", Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
              </div>
            </div>

            {/* Riders Margin */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Riders Margin</label>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formData.ridersMargin}
                  onChange={(e) => handleChange("ridersMargin", Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Index Section */}
        <div className="space-y-4 pt-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Risk Index</h4>
            <p className="text-xs text-slate-400 font-normal">
              Insurance tier applied based on declared goods value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Index 1 */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Risk Index 1</label>
              <span className="block text-[11px] text-slate-400 font-normal">
                Goods &lt; 50000
              </span>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  step="0.1"
                  value={formData.risk1}
                  onChange={(e) => handleChange("risk1", Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
              </div>
            </div>

            {/* Risk Index 2 */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Risk Index 2</label>
              <span className="block text-[11px] text-slate-400 font-normal">
                Goods &gt; 50,001 and &lt;150,000XOF
              </span>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  step="0.1"
                  value={formData.risk2}
                  onChange={(e) => handleChange("risk2", Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
              </div>
            </div>

            {/* Risk Index 3 */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Risk Index 3</label>
              <span className="block text-[11px] text-slate-400 font-normal">
                Goods &gt; 150,001 and &lt;250,000XOF
              </span>
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  step="0.1"
                  value={formData.risk3}
                  onChange={(e) => handleChange("risk3", Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
