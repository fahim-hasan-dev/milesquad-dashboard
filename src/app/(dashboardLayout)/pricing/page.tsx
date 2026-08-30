"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";

interface IFareSetting {
  baseFee: number;
  freeTime: number;
  timeRate: number;
  fuelRate: number;
  margin: number;
  overhead: number;
  riskIndex1: number;
  riskIndex2: number;
  riskIndex3: number;
  loadFactor: number;
  scheduledDelivery: number;
  maxWeight: number;
  maxVolume: number;
}

const defaultVehicleSetting: IFareSetting = {
  baseFee: 500,
  freeTime: 10,
  timeRate: 50,
  fuelRate: 100,
  margin: 20,
  overhead: 80,
  riskIndex1: 2.0,
  riskIndex2: 3.5,
  riskIndex3: 5.0,
  loadFactor: 10,
  scheduledDelivery: 5,
  maxWeight: 20,
  maxVolume: 1.5,
};

const defaultAllFareSettings: Record<string, IFareSetting> = {
  motorcycle: { ...defaultVehicleSetting, baseFee: 500, maxWeight: 20, maxVolume: 1.5 },
  tricycle: { ...defaultVehicleSetting, baseFee: 800, maxWeight: 100, maxVolume: 4.0 },
  car: { ...defaultVehicleSetting, baseFee: 1500, maxWeight: 350, maxVolume: 8.0 },
  van: { ...defaultVehicleSetting, baseFee: 3000, maxWeight: 1200, maxVolume: 18.0 },
  small_cargo: { ...defaultVehicleSetting, baseFee: 6000, maxWeight: 5000, maxVolume: 45.0 },
};

const vehicleTabs = [
  { name: "Bike", key: "motorcycle", icon: Bike },
  { name: "Tricycle", key: "tricycle", icon: Bike },
  { name: "Car", key: "car", icon: Car },
  { name: "Van", key: "van", icon: Truck },
  { name: "Small Cargo", key: "small_cargo", icon: Truck },
];

export default function SettingsPageContent() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Bike");
  const [selectedVehicleKey, setSelectedVehicleKey] = useState<string>("motorcycle");
  const [allFareSettings, setAllFareSettings] = useState<Record<string, IFareSetting>>(
    defaultAllFareSettings
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await myFetch("/settings");
      if (res.success && res.data?.fareSettings) {
        setAllFareSettings((prev) => ({
          ...prev,
          ...res.data.fareSettings,
        }));
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to load settings from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleVehicleTabChange = (name: string, key: string) => {
    setSelectedVehicle(name);
    setSelectedVehicleKey(key);
  };

  const currentVehicleSettings: IFareSetting =
    allFareSettings[selectedVehicleKey] || defaultVehicleSetting;

  const formatInputValue = (val?: number) => {
    if (val === undefined || val === null || val === 0) return "";
    return val;
  };

  const handleFieldChange = (field: keyof IFareSetting, rawValue: string) => {
    const parsed = parseFloat(rawValue);
    const val = rawValue === "" || isNaN(parsed) ? 0 : parsed;

    setAllFareSettings((prev) => {
      const current = prev[selectedVehicleKey] || { ...defaultVehicleSetting };
      const updated = { ...current, [field]: val };

      if (field === "margin") {
        updated.overhead = Math.max(0, 100 - val);
      } else if (field === "overhead") {
        updated.margin = Math.max(0, 100 - val);
      }

      return {
        ...prev,
        [selectedVehicleKey]: updated,
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving vehicle settings...", { id: "save-settings" });
    try {
      const res = await myFetch("/settings", {
        method: "PATCH",
        body: { fareSettings: allFareSettings },
      });
      if (res.success) {
        toast.success(`Settings saved successfully for all vehicles!`, {
          id: "save-settings",
        });
        fetchSettings();
      } else {
        toast.error(res.message || res.error || "Failed to save settings", {
          id: "save-settings",
        });
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Error connecting to server", { id: "save-settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
        <span className="text-sm font-medium">Loading settings from backend...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[#E6F4EA] text-[#10B981] flex items-center justify-center shrink-0">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Pricing
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Configure vehicle-specific delivery fares, distance pricing, commissions, and risk tiers.
          </p>
        </div>
      </div>

      {/* Vehicle Selection Bar (Non-wrapping single row) */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap w-fit">
        {vehicleTabs.map((v) => {
          const Icon = v.icon;
          const isSelected = selectedVehicleKey === v.key;
          return (
            <button
              key={v.key}
              onClick={() => handleVehicleTabChange(v.name, v.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{v.name}</span>
            </button>
          );
        })}
      </div>

      {/* Single Modern Container Card for Selected Vehicle */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
        {/* Card Header Title */}
        <div className="pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {selectedVehicle} Pricing & Rates
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Base costs, capacity limits, commission split, and insurance risk tiers for {selectedVehicle.toLowerCase()} deliveries.
          </p>
        </div>

        {/* Section 1: Base Fares & Specifications */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Base Fares & Specifications ({selectedVehicle.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Base costs and capacity limits applied per delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Base Fee */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Base Fee</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.baseFee)}
                  onChange={(e) => handleFieldChange("baseFee", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">XOF</span>
              </div>
            </div>

            {/* Free Time */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Free Time</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.freeTime)}
                  onChange={(e) => handleFieldChange("freeTime", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">min</span>
              </div>
            </div>

            {/* Time Rate */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Time Rate</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Zap className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.timeRate)}
                  onChange={(e) => handleFieldChange("timeRate", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">XOF/min</span>
              </div>
            </div>

            {/* Fuel Rate */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Fuel Rate</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Fuel className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.fuelRate)}
                  onChange={(e) => handleFieldChange("fuelRate", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">XOF/km</span>
              </div>
            </div>

            {/* Maximum Weight */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Maximum Weight</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Weight className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.maxWeight)}
                  onChange={(e) => handleFieldChange("maxWeight", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">Kg</span>
              </div>
            </div>

            {/* Maximum Volume */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Maximum Volume</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Box className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  step="0.1"
                  value={formatInputValue(currentVehicleSettings.maxVolume)}
                  onChange={(e) => handleFieldChange("maxVolume", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">m³</span>
              </div>
            </div>

            {/* Load Factor */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Load Factor</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Truck className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.loadFactor)}
                  onChange={(e) => handleFieldChange("loadFactor", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
              </div>
            </div>

            {/* Schedule Delivery */}
            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <label className="block text-xs font-bold text-slate-800">Scheduled Fee</label>
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="number"
                  value={formatInputValue(currentVehicleSettings.scheduledDelivery)}
                  onChange={(e) => handleFieldChange("scheduledDelivery", e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-400 shrink-0">XOF/%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Section 2: Commission Split & Risk Tiers */}
        <div className="space-y-6">
          {/* Commission Split */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Commission Split ({selectedVehicle.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Margin split between the platform and riders per delivery booking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Margin */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Margin</label>
                <div className="flex items-center gap-3 pb-1 border-b border-slate-200">
                  <Percent className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    value={formatInputValue(currentVehicleSettings.margin)}
                    onChange={(e) => handleFieldChange("margin", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
                </div>
              </div>

              {/* Overhead */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Overhead</label>
                <div className="flex items-center gap-3 pb-1 border-b border-slate-200">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    value={formatInputValue(currentVehicleSettings.overhead)}
                    onChange={(e) => handleFieldChange("overhead", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Index Tiers */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Risk Index Tiers ({selectedVehicle.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Insurance risk index applied based on declared parcel value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Risk Index 1 */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Risk Index 1</label>
                <span className="block text-[11px] text-slate-400 font-normal">
                  Low value goods
                </span>
                <div className="flex items-center gap-3 pb-1 border-b border-slate-200">
                  <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    step="0.1"
                    value={formatInputValue(currentVehicleSettings.riskIndex1)}
                    onChange={(e) => handleFieldChange("riskIndex1", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
                </div>
              </div>

              {/* Risk Index 2 */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Risk Index 2</label>
                <span className="block text-[11px] text-slate-400 font-normal">
                  Medium value goods
                </span>
                <div className="flex items-center gap-3 pb-1 border-b border-slate-200">
                  <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    step="0.1"
                    value={formatInputValue(currentVehicleSettings.riskIndex2)}
                    onChange={(e) => handleFieldChange("riskIndex2", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
                </div>
              </div>

              {/* Risk Index 3 */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Risk Index 3</label>
                <span className="block text-[11px] text-slate-400 font-normal">
                  High value goods
                </span>
                <div className="flex items-center gap-3 pb-1 border-b border-slate-200">
                  <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    step="0.1"
                    value={formatInputValue(currentVehicleSettings.riskIndex3)}
                    onChange={(e) => handleFieldChange("riskIndex3", e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-slate-400 shrink-0">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-8 py-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Pricing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
