"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Minus, Pencil, Trash2, Loader2 } from "lucide-react";
import AddFAQModal from "@/components/modals/AddFAQModal";
import EditFAQModal, { FAQItemData } from "@/components/modals/EditFAQModal";
import toast from "react-hot-toast";
import { myFetch } from "@/utils/myFetch";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<"user" | "driver">("user");
  const [faqs, setFaqs] = useState<FAQItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQItemData | null>(null);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await myFetch("/public/faq/all");
      if (res.success && Array.isArray(res.data)) {
        setFaqs(res.data);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Filter FAQs based on tab (user vs driver/rider)
  const currentFaqs = faqs.filter((f) => {
    const target = f.target || "customer";
    if (activeTab === "user") {
      return target === "customer" || target === "all";
    } else {
      return target === "rider" || target === "driver" || target === "all";
    }
  });

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this FAQ item?")) return;

    toast.loading("Deleting FAQ...", { id: "delete-faq" });
    try {
      const res = await myFetch(`/public/faq/${id}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("FAQ item deleted successfully!", { id: "delete-faq" });
        fetchFaqs();
      } else {
        toast.error(res.message || res.error || "Failed to delete FAQ", {
          id: "delete-faq",
        });
      }
    } catch {
      toast.error("Error deleting FAQ", { id: "delete-faq" });
    }
  };

  const handleOpenEdit = (faq: FAQItemData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFaq(faq);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Sub-Tabs Switcher - Sleek & Compact */}
      <div className="bg-[#F4F4F5] p-1 rounded-xl w-fit flex items-center gap-1">
        <button
          onClick={() => {
            setActiveTab("user");
            setExpandedId(null);
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
            setExpandedId(null);
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
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-[#10B981]" />
            <span className="text-xs font-medium">Loading FAQs...</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentFaqs.length > 0 ? (
              currentFaqs.map((item, index) => {
                const itemId = item._id || item.id || index;
                const isExpanded = expandedId === itemId;
                const numStr = (index + 1).toString().padStart(2, "0");

                return (
                  <div key={itemId} className="py-4 first:pt-0 last:pb-0">
                    <div
                      onClick={() => toggleExpand(itemId)}
                      className="flex items-start justify-between gap-5 cursor-pointer group"
                    >
                      {/* Left Number + Question & Actions Block */}
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-sm font-bold text-slate-900 shrink-0 mt-0.5">
                          {numStr}
                        </span>
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-xs md:text-sm font-bold text-slate-800 leading-snug group-hover:text-[#10B981] transition-colors">
                            {item.question}
                          </h3>

                          {/* Expanded Answer Text */}
                          {isExpanded && (
                            <p className="text-xs text-slate-500 font-normal leading-relaxed pt-1">
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
                              onClick={(e) => handleDelete(itemId, e)}
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
        )}
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
        targetRole={activeTab === "user" ? "customer" : "rider"}
        onSuccess={fetchFaqs}
      />

      {/* Edit FAQ Modal */}
      <EditFAQModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        faq={selectedFaq}
        onSuccess={fetchFaqs}
      />
    </div>
  );
}
