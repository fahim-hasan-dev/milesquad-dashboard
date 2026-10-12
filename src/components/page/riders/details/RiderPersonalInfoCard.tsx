import React from "react";
import Image from "next/image";
import { User, Mail, Phone, Bike, MapPin, FileCheck } from "lucide-react";
import { DriverDetailData } from "./types";

interface RiderPersonalInfoCardProps {
  rider: DriverDetailData;
}

export default function RiderPersonalInfoCard({
  rider,
}: RiderPersonalInfoCardProps) {
  const documentsCount = [
    rider.nidFront,
    rider.nidBack,
    rider.drivingLicense,
    rider.vehicleInsurance,
    rider.criminalReport,
    ...(rider.vehicleDocuments || []),
  ].filter(Boolean).length;

  return (
    <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-start">
      <h3 className="text-lg md:text-xl font-bold text-[#18181B] mb-6">
        Personal Information & Vehicle Specs
      </h3>

      <div className="flex items-center gap-4">
        {rider.avatar ? (
          <Image
            src={rider.avatar}
            alt="Profile Picture"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center text-xl shadow-sm border border-slate-100">
            {(rider.name || "R").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h4 className="text-sm md:text-base font-bold text-[#18181B]">
            Profile Picture
          </h4>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Driver&apos;s photo application
          </p>
        </div>
      </div>

      <div className="w-full border-t border-slate-100 my-6" />

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Full Name</span>
            <span className="font-bold text-[#18181B]">{rider.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Email</span>
            <span className="font-bold text-[#18181B]">{rider.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Phone Number</span>
            <span className="font-bold text-[#18181B]">{rider.contact}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Bike className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Vehicle Type</span>
            <span className="font-bold text-[#18181B]">{rider.vehicle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Location / Address</span>
            <span className="font-bold text-[#18181B]">{rider.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FileCheck className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-6 text-sm">
            <span className="w-32 md:w-44 font-medium text-slate-500">Documents Attached</span>
            <span className="font-bold text-[#10B981]">
              {documentsCount} Files Uploaded
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
