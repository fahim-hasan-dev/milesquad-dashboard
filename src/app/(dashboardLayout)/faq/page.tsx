"use client";

import React, { useState } from "react";
import { Plus, Minus, Pencil, Trash2 } from "lucide-react";
import AddFAQModal from "@/components/modals/AddFAQModal";
import EditFAQModal from "@/components/modals/EditFAQModal";
import toast from "react-hot-toast";
import {
  initialUserFaqs,
  initialDriverFaqs,
  FAQItem,
} from "@/demoData/faqManagementData";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<"user" | "driver">("user");
  const [userFaqs, setUserFaqs] = useState<FAQItem[]>(initialUserFaqs);
  const [driverFaqs, setDriverFaqs] = useState<FAQItem[]>(initialDriverFaqs);
  const [expandedId, setExpandedId] = useState<number | null>(6);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);

  const activeFaqs = activeTab === "user" ? userFaqs : driverFaqs;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTab === "user") {
      setUserFaqs((prev) => prev.filter((f) => f.id !== id));
    } else {
      setDriverFaqs((prev) => prev.filter((f) => f.id !== id));
    }
    toast.success("FAQ item deleted");
  };

  const handleOpenEdit = (faq: FAQItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFaq(faq);
    setIsEditModalOpen(true);
  };

  const handleUpdateFAQ = (updatedFaq: FAQItem) => {
    if (activeTab === "user") {
      setUserFaqs((prev) =>
        prev.map((f) => (f.id === updatedFaq.id ? updatedFaq : f))
      );
    } else {
      setDriverFaqs((prev) =>
        prev.map((f) => (f.id === updatedFaq.id ? updatedFaq : f))
      );
    }
  };

  const handleAddFAQ = (newFaq: { question: string; answer: string }) => {
    const targetList = activeTab === "user" ? userFaqs : driverFaqs;
    const nextNum = (targetList.length + 1).toString().padStart(2, "0");

    const created: FAQItem = {
      id: Date.now(),
      number: nextNum,
      question: newFaq.question,
      answer: newFaq.answer,
    };

    if (activeTab === "user") {
      setUserFaqs((prev) => [...prev, created]);
    } else {
      setDriverFaqs((prev) => [...prev, created]);
    }
    setExpandedId(created.id);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Sub-Tabs Switcher - Sleek & Compact */}
      <div className="bg-[#F4F4F5] p-1 rounded-xl w-fit flex items-center gap-1">
        <button
          onClick={() => {
            setActiveTab("user");
            setExpandedId(6);
          }}
          className={`px-7 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "user"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          User
        </button>

        <button
          onClick={() => {
            setActiveTab("driver");
            setExpandedId(105);
          }}
          className={`px-7 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "driver"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Driver
        </button>
      </div>

      {/* Main FAQ Accordion List Card - Compact & Balanced */}
      <div className="bg-white rounded-2xl p-5 md:p-7 border border-slate-100 shadow-sm">
        <div className="divide-y divide-slate-100">
          {activeFaqs.length > 0 ? (
            activeFaqs.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-start justify-between gap-5 cursor-pointer group"
                  >
                    {/* Left Number + Question & Actions Block */}
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-sm font-bold text-slate-900 shrink-0 mt-0.5">
                        {item.number}
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <h3 className="text-xs md:text-sm font-bold text-slate-800 leading-snug group-hover:text-[#10B981] transition-colors">
                          {item.question}
                        </h3>

                        {/* Expanded Answer Text */}
                        {isExpanded && (
                          <p className="text-xs text-slate-400 font-normal leading-relaxed pt-0.5">
                            {item.answer}
                          </p>
                        )}

                        {/* Action Icons under Question Title */}
                        <div className="flex items-center gap-3 pt-0.5">
                          <button
                            onClick={(e) => handleOpenEdit(item, e)}
                            className="text-slate-400 hover:text-[#10B981] transition-colors p-0.5 cursor-pointer"
                            title="Edit FAQ"
                          >
                            <Pencil className="h-3.5 w-3.5 stroke-[2]" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Expand Circle Toggle */}
                    <div className="size-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 group-hover:border-[#10B981] group-hover:text-[#10B981] transition-colors shrink-0 mt-0.5">
                      {isExpanded ? (
                        <Minus className="h-4 w-4 stroke-[1.5]" />
                      ) : (
                        <Plus className="h-4 w-4 stroke-[1.5]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-slate-400 font-medium text-xs">
              No FAQ items found in this section. Click &apos;Add New FAQ&apos; to create one.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Right Add New FAQ Action Button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-none cursor-pointer"
        >
          Add New FAQ
        </button>
      </div>

      {/* Add New FAQ Modal */}
      <AddFAQModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFAQ={handleAddFAQ}
      />

      {/* Edit FAQ Modal */}
      <EditFAQModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        faq={selectedFaq}
        onUpdateFAQ={handleUpdateFAQ}
      />
    </div>
  );
}
