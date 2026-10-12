import React from "react";
import Image from "next/image";
import { FileText, Eye } from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";
import { DriverDetailData } from "./types";

interface RiderVerificationDocsProps {
  rider: DriverDetailData;
  onPreview: (doc: { url: string; title: string }) => void;
}

export default function RiderVerificationDocs({
  rider,
  onPreview,
}: RiderVerificationDocsProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-lg font-bold text-[#18181B]">
            Verification Documents & Vehicle Records
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any document to inspect full preview or open original.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* National ID Card (Front & Back) */}
        <div className="space-y-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">National ID Card</h4>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                Front & Back
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* NID Front */}
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Front Side
                </span>
                {rider.nidFront ? (
                  <div
                    onClick={() =>
                      onPreview({
                        url: getImageUrl(rider.nidFront),
                        title: "National ID Card (Front)",
                      })
                    }
                    className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:border-[#10B981] transition-all"
                  >
                    <Image
                      src={getImageUrl(rider.nidFront)}
                      alt="ID Card Front"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                      <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : (
                  <div className="h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FileText className="h-6 w-6 text-slate-300 mb-1" />
                    <span>Not provided</span>
                  </div>
                )}
              </div>

              {/* NID Back */}
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Back Side
                </span>
                {rider.nidBack ? (
                  <div
                    onClick={() =>
                      onPreview({
                        url: getImageUrl(rider.nidBack),
                        title: "National ID Card (Back)",
                      })
                    }
                    className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:border-[#10B981] transition-all"
                  >
                    <Image
                      src={getImageUrl(rider.nidBack)}
                      alt="ID Card Back"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                      <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : (
                  <div className="h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FileText className="h-6 w-6 text-slate-300 mb-1" />
                    <span>Not provided</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Driving License */}
        <div className="space-y-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">Driving License</h4>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                License Proof
              </span>
            </div>
            {rider.drivingLicense ? (
              <div
                onClick={() =>
                  onPreview({
                    url: getImageUrl(rider.drivingLicense),
                    title: "Driving License",
                  })
                }
                className="group relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:border-[#10B981] transition-all"
              >
                <Image
                  src={getImageUrl(rider.drivingLicense)}
                  alt="Driving License"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ) : (
              <div className="w-full h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                <FileText className="h-6 w-6 text-slate-300 mb-1" />
                <span>No driving license uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Insurance */}
        <div className="space-y-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">Vehicle Insurance</h4>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  rider.vehicleInsurance
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                {rider.vehicleInsurance ? "Attached" : "Missing"}
              </span>
            </div>
            {rider.vehicleInsurance ? (
              <div
                onClick={() =>
                  onPreview({
                    url: getImageUrl(rider.vehicleInsurance),
                    title: "Vehicle Insurance Certificate",
                  })
                }
                className="group relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:border-[#10B981] transition-all"
              >
                <Image
                  src={getImageUrl(rider.vehicleInsurance)}
                  alt="Vehicle Insurance"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ) : (
              <div className="w-full h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                <FileText className="h-6 w-6 text-slate-300 mb-1" />
                <span>No vehicle insurance uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Criminal Record Report / Background Check */}
        <div className="space-y-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">
                Criminal Record / Background Check
              </h4>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  rider.criminalReport
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                {rider.criminalReport ? "Attached" : "Missing"}
              </span>
            </div>
            {rider.criminalReport ? (
              <div
                onClick={() =>
                  onPreview({
                    url: getImageUrl(rider.criminalReport),
                    title: "Criminal Record Clearance",
                  })
                }
                className="group relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:border-[#10B981] transition-all"
              >
                <Image
                  src={getImageUrl(rider.criminalReport)}
                  alt="Criminal Record Report"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ) : (
              <div className="w-full h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                <FileText className="h-6 w-6 text-slate-300 mb-1" />
                <span>No background report uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Documents (Multiple Files Support) */}
        <div className="space-y-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm md:col-span-2 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Vehicle Documents</h4>
                <p className="text-[11px] text-slate-400">
                  Registration papers, fitness certificate, tax tokens, etc.
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  rider.vehicleDocuments && rider.vehicleDocuments.length > 0
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                {rider.vehicleDocuments?.length || 0} File(s)
              </span>
            </div>

            {rider.vehicleDocuments && rider.vehicleDocuments.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {rider.vehicleDocuments.map((docUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      onPreview({
                        url: getImageUrl(docUrl),
                        title: `Vehicle Document #${idx + 1}`,
                      })
                    }
                    className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-sm hover:border-[#10B981] transition-all"
                  >
                    <Image
                      src={getImageUrl(docUrl)}
                      alt={`Vehicle Document ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                      Doc #{idx + 1}
                    </span>
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                      <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-36 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                <FileText className="h-6 w-6 text-slate-300 mb-1" />
                <span>No vehicle documents uploaded by this driver</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
