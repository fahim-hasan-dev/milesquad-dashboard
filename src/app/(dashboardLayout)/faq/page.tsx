/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Minus, Pencil, Trash2, PlusCircle } from "lucide-react";
import AddFAQModal from "@/components/modals/AddFAQModal";
import toast from "react-hot-toast";

const initialUserFaqs = [
  {
    id: 1,
    number: "01",
    question: "1. What is Tradelock?",
    answer: "Tradelock is a comprehensive platform for bulk logistics, order management, and driver dispatch.",
  },
  {
    id: 2,
    number: "02",
    question: "Is Tradelock suitable for solo job seekers?",
    answer: "Yes, solo job seekers can register as independent drivers or suppliers on the platform.",
  },
  {
    id: 3,
    number: "03",
    question: "Can companies and individuals both create accounts?",
    answer: "Both businesses and individual users can register and manage their deliveries effortlessly.",
  },
  {
    id: 4,
    number: "04",
    question: "Is Tradelock free to use?",
    answer: "Account creation is free. Transparent per-delivery transaction fees apply.",
  },
  {
    id: 5,
    number: "05",
    question: "How does Tradelock ensure quality matches?",
    answer: "We use automated distance algorithms and verified driver ratings for optimal assignment.",
  },
  {
    id: 6,
    number: "06",
    question: "Can I manage everything in one place?",
    answer: "Absolutely. From job discovery and applications to hiring and communication, HireMe keeps everything organized in one platform.",
  },
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<"user" | "driver">("user");
  const [faqs, setFaqs] = useState(initialUserFaqs);
  const [expandedId, setExpandedId] = useState<number | null>(6);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast.success("FAQ item deleted");
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Edit FAQ item");
  };

  const handleAddFAQ = (newFaq: any) => {
    const nextNum = (faqs.length + 1).toString().padStart(2, "0");
    setFaqs((prev) => [
      ...prev,
      {
        id: Date.now(),
        number: nextNum,
        question: newFaq.question,
        answer: newFaq.answer,
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Sub-Tabs Switcher */}
      <div className="bg-slate-100/70 p-1.5 rounded-2xl w-fit flex items-center gap-2 border border-slate-200/60">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-8 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === "user"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          User
        </button>

        <button
          onClick={() => setActiveTab("driver")}
          className={`px-8 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === "driver"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Driver
        </button>
      </div>

      {/* Main FAQ Accordion List Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="divide-y divide-slate-100">
          {faqs.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-base md:text-lg font-black text-slate-900 shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-[#10B981] transition-colors leading-snug">
                        {item.question}
                      </h3>
                      {/* Action Icons under Title */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={(e) => handleEdit(item.id, e)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Expand Icon */}
                  <div className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-[#10B981] group-hover:text-[#10B981] transition-colors shrink-0">
                    {isExpanded ? (
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="pl-10 pr-12 pt-1">
                    <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Right Add New FAQ Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-none cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Add New FAQ Modal */}
      <AddFAQModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFAQ={handleAddFAQ}
      />
    </div>
  );
}
