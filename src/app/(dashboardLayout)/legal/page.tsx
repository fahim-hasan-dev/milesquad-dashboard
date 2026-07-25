"use client";

import { useState } from "react";
import { FileText, ShieldCheck, AlertCircle, RotateCcw, Save } from "lucide-react";
import toast from "react-hot-toast";

const defaultTerms = `### 1. Introduction
Welcome to Modulix Market. By accessing our platform, you agree to these terms. Please read them carefully.

### 2. Service Usage
Our platform connects suppliers with businesses for bulk purchasing. You agree to use the service only for lawful purposes and in accordance with these Terms.
* You must provide accurate account information.
* You are responsible for maintaining the confidentiality of your account.
* Unauthorized use of the platform is strictly prohibited.

### 3. Orders & Payments
All orders are subject to acceptance and availability. Prices are subject to change without notice. We reserve the right to refuse service to anyone.

### 4. Intellectual Property
The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and trademarks.`;

const defaultPrivacy = `### 1. Privacy Policy
We value your privacy and are committed to protecting your personal information.

### 2. Data Collection
We collect information you provide directly to us when using our platform services.
* Personal identification information (Name, Email, Phone number).
* Transaction and payment history.
* Location data for real-time delivery tracking.

### 3. Data Usage
Your information is used solely to provide, improve, and secure our services.`;

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [termsContent, setTermsContent] = useState(defaultTerms);
  const [privacyContent, setPrivacyContent] = useState(defaultPrivacy);

  const handleSave = () => {
    toast.success(`${activeTab === "terms" ? "Terms & Conditions" : "Privacy Policy"} saved!`);
  };

  const handleReset = () => {
    if (activeTab === "terms") {
      setTermsContent(defaultTerms);
    } else {
      setPrivacyContent(defaultPrivacy);
    }
    toast.success("Reset to default text!");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
          Legal Content Management
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Edit the legal documents displayed to your users.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        {/* Sub-Tabs Row */}
        <div className="flex items-center gap-6 border-b border-slate-100">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 pb-3.5 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "terms"
                ? "border-[#10B981] text-[#10B981]"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Terms &amp; Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 pb-3.5 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "privacy"
                ? "border-[#10B981] text-[#10B981]"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Tip Yellow Alert Box */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-2xl p-4 text-xs font-medium flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
          <span>
            <strong>Tip:</strong> You can use Markdown-like syntax for headers (### Header) and bullet points (* item). Currently editing in Plain Text mode.
          </span>
        </div>

        {/* Markdown Textarea Editor */}
        <div className="space-y-2">
          <textarea
            rows={14}
            value={activeTab === "terms" ? termsContent : privacyContent}
            onChange={(e) =>
              activeTab === "terms"
                ? setTermsContent(e.target.value)
                : setPrivacyContent(e.target.value)
            }
            className="w-full bg-[#F8FAFC] border border-slate-200/80 p-5 rounded-2xl text-xs md:text-sm font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#10B981]"
          />
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs md:text-sm px-8 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
