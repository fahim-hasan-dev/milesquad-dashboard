"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { FileText, ShieldCheck, Save, User, Bike, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const defaultUserTerms = `<h3>1. Introduction for Customers</h3>
<p>Welcome to <strong>MileSquad</strong>. By registering as a Customer on our platform, you agree to comply with these terms. Please read them carefully.</p>

<h3>2. Service Booking</h3>
<ul>
  <li>Users can request courier and freight delivery services through the MileSquad app.</li>
  <li>All bookings must include accurate pickup and dropoff details.</li>
  <li>Prohibited items (illegal goods, explosives, hazardous chemicals) cannot be transported.</li>
</ul>

<h3>3. Pricing &amp; Payments</h3>
<ul>
  <li>Fares are calculated dynamically based on distance, parcel weight, vehicle type, and estimated delivery time.</li>
  <li>Payments can be made via Mobile Money, Credit/Debit Cards, or Cash on Delivery.</li>
</ul>

<h3>4. Cancellations &amp; Refunds</h3>
<ul>
  <li>Cancellations made before a driver is assigned incur no penalty fee.</li>
  <li>If cancelled after driver dispatch, a nominal base fee may apply.</li>
</ul>`;

const defaultDriverTerms = `<h3>1. Partner Driver Agreement</h3>
<p>This Driver Partner Agreement governs your use of the MileSquad Driver Application to receive and fulfill delivery requests.</p>

<h3>2. Licensing &amp; Vehicle Eligibility</h3>
<ul>
  <li>Drivers must hold a valid driving license and official vehicle registration documents.</li>
  <li>Vehicles (Bikes, Tricycles, Vans, Trucks) must pass routine safety and roadworthiness inspections.</li>
</ul>

<h3>3. Earnings &amp; Payout Schedule</h3>
<ul>
  <li>Drivers earn a base fare plus distance-based and time-based rates per completed delivery order.</li>
  <li>Earnings are disbursed on a weekly schedule directly to your designated Mobile Money or Bank Account.</li>
</ul>

<h3>4. Code of Conduct &amp; Safety</h3>
<ul>
  <li>Drivers must maintain professionalism, courteous communication, and follow traffic safety rules at all times.</li>
  <li>Failure to fulfill accepted deliveries without valid reason may result in temporary account suspension.</li>
</ul>`;

const defaultUserPrivacy = `<h3>1. Customer Information We Collect</h3>
<p>We collect personal information required to facilitate seamless delivery services:</p>
<ul>
  <li>Full Name, Phone Number, and Email Address.</li>
  <li>Live pickup and dropoff geolocation coordinates.</li>
  <li>Payment transaction records (Mobile Money handles, Card tokens).</li>
</ul>

<h3>2. How We Use Customer Data</h3>
<ul>
  <li>To match delivery requests with nearby active drivers.</li>
  <li>To provide live tracking status updates on your shipments.</li>
  <li>To process payments and generate digital receipts.</li>
</ul>

<h3>3. Data Protection &amp; Security</h3>
<p>We employ industry-standard encryption protocols to protect user personal data from unauthorized access or disclosure.</p>`;

const defaultDriverPrivacy = `<h3>1. Driver Personal &amp; Verification Data</h3>
<p>We collect background verification data required for onboarding driver partners:</p>
<ul>
  <li>Driving License credentials, National ID, and Vehicle Registration details.</li>
  <li>Background check verification logs.</li>
  <li>Mobile Money account details for payout processing.</li>
</ul>

<h3>2. Continuous Live Location Tracking</h3>
<ul>
  <li>The driver application collects real-time GPS location data while online or executing an active order.</li>
  <li>Location data is shared with the customer during an active trip to display live route progress.</li>
</ul>

<h3>3. Telematics &amp; Safety Data</h3>
<p>Driving speeds, route history, and trip completion metrics are logged to ensure safety compliance and calculate performance bonuses.</p>`;

const editorConfig = {
  readonly: false,
  height: 550,
  minHeight: 480,
  theme: "light",
  placeholder: "Start typing legal document content...",
  toolbarAdaptive: false,
  style: {
    fontSize: "15px",
    fontFamily: "Inter, sans-serif",
  },
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "font",
    "fontsize",
    "paragraph",
    "|",
    "ul",
    "ol",
    "|",
    "align",
    "undo",
    "redo",
    "|",
    "hr",
    "table",
    "link",
    "fullsize",
  ],
};

export default function LegalPage() {
  const editor = useRef<any>(null);
  const [docType, setDocType] = useState<"terms" | "privacy">("terms");
  const [targetRole, setTargetRole] = useState<"user" | "driver">("user");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userTerms, setUserTerms] = useState(defaultUserTerms);
  const [driverTerms, setDriverTerms] = useState(defaultDriverTerms);
  const [userPrivacy, setUserPrivacy] = useState(defaultUserPrivacy);
  const [driverPrivacy, setDriverPrivacy] = useState(defaultDriverPrivacy);

  const getTypeKey = useCallback((doc: "terms" | "privacy", role: "user" | "driver") => {
    if (doc === "terms") {
      return role === "user" ? "customer-terms" : "driver-terms";
    } else {
      return role === "user" ? "customer-privacy" : "driver-privacy";
    }
  }, []);

  const fetchAllLegalDocs = useCallback(async () => {
    setLoading(true);
    try {
      const types = [
        "customer-terms",
        "driver-terms",
        "customer-privacy",
        "driver-privacy",
      ];
      const results = await Promise.all(
        types.map(async (t) => {
          const res = await myFetch(`/public/${t}`);
          return { type: t, content: res.data?.content || null };
        })
      );

      const docMap: Record<string, string | null> = {};
      results.forEach((r) => {
        docMap[r.type] = r.content;
      });

      if (docMap["customer-terms"]) setUserTerms(docMap["customer-terms"]);
      if (docMap["driver-terms"]) setDriverTerms(docMap["driver-terms"]);
      if (docMap["customer-privacy"]) setUserPrivacy(docMap["customer-privacy"]);
      if (docMap["driver-privacy"]) setDriverPrivacy(docMap["driver-privacy"]);
    } catch (err) {
      console.error("Error fetching legal docs:", err);
      toast.error("Failed to load legal content from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLegalDocs();
  }, [fetchAllLegalDocs]);

  // Helper to get active text
  const getActiveContent = () => {
    if (docType === "terms") {
      return targetRole === "user" ? userTerms : driverTerms;
    } else {
      return targetRole === "user" ? userPrivacy : driverPrivacy;
    }
  };

  // Helper to set active text
  const setActiveContent = (val: string) => {
    if (docType === "terms") {
      if (targetRole === "user") setUserTerms(val);
      else setDriverTerms(val);
    } else {
      if (targetRole === "user") setUserPrivacy(val);
      else setDriverPrivacy(val);
    }
  };

  const getDocTitle = () => {
    const docName = docType === "terms" ? "Terms & Conditions" : "Privacy Policy";
    const roleName = targetRole === "user" ? "User" : "Driver";
    return `${roleName} ${docName}`;
  };

  const handleSave = async () => {
    const currentTypeKey = getTypeKey(docType, targetRole);
    const editorVal = editor.current?.value;
    const currentContent =
      typeof editorVal === "string" && editorVal.trim().length > 0
        ? editorVal
        : getActiveContent();

    setSaving(true);
    toast.loading(`Saving ${getDocTitle()}...`, { id: "save-legal" });

    try {
      const res = await myFetch("/public", {
        method: "POST",
        body: {
          type: currentTypeKey,
          content: currentContent,
        },
      });

      if (res.success) {
        toast.success(`${getDocTitle()} saved successfully!`, {
          id: "save-legal",
        });
        setActiveContent(currentContent);
      } else {
        toast.error(res.message || res.error || "Failed to save document", {
          id: "save-legal",
        });
      }
    } catch {
      toast.error("Error connecting to server", { id: "save-legal" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Legal Content Management
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
          Manage Terms &amp; Conditions and Privacy Policy for both Users and Drivers.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        {/* Header Row: Document Tabs & Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Document Type Switcher Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setDocType("terms")}
              className={`flex items-center gap-2 pb-2 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                docType === "terms"
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Terms &amp; Conditions</span>
            </button>

            <button
              onClick={() => setDocType("privacy")}
              className={`flex items-center gap-2 pb-2 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                docType === "privacy"
                  ? "border-[#10B981] text-[#10B981]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Privacy Policy</span>
            </button>
          </div>

          {/* User vs Driver Role Switcher Pills */}
          <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200/70 shadow-inner self-start sm:self-auto">
            <button
              onClick={() => setTargetRole("user")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                targetRole === "user"
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <User className="h-4 w-4" />
              <span>User</span>
            </button>

            <button
              onClick={() => setTargetRole("driver")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                targetRole === "driver"
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Bike className="h-4 w-4" />
              <span>Driver</span>
            </button>
          </div>
        </div>

        {/* Jodit Rich Text Editor Container */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
            <span className="text-xs font-medium">Loading legal document from server...</span>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm [&_.jodit-container]:!border-none">
            <JoditEditor
              ref={editor}
              value={getActiveContent()}
              config={editorConfig}
              onBlur={(newContent) => setActiveContent(newContent)}
            />
          </div>
        )}

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-7 py-2.5 rounded-xl transition-all shadow-none cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
