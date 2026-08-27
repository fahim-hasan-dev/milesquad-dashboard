"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  siblingCount?: number;
  showTotalInfo?: boolean;
}

export const getPaginationRange = (
  totalPages: number,
  currentPage: number,
  siblingCount: number = 1
): (number | string)[] => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }

  return [];
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  siblingCount = 1,
  showTotalInfo = true,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const paginationRange = getPaginationRange(totalPages, currentPage, siblingCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4">
      {/* Showing Info on the LEFT */}
      <div>
        {showTotalInfo && totalItems !== undefined ? (
          <span className="text-xs font-medium text-slate-500">
            Showing Page {currentPage} of {totalPages} ({totalItems.toLocaleString()} total items)
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Page Controls on the RIGHT */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Range Buttons */}
        {paginationRange.map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              type="button"
              onClick={() => onPageChange(page)}
              className={`size-9 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                currentPage === page
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="text-slate-400 font-semibold text-xs px-1 select-none">
              ...
            </span>
          )
        )}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
