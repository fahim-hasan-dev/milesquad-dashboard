"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [, startTransition] = useTransition();

  // Reset/finish progress on navigation complete
  useEffect(() => {
    if (progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept internal link clicks for 0ms instant feedback
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Skip external, hash, or target="_blank"
      if (!href || href.startsWith("http") || href.startsWith("#") || targetAttr === "_blank" || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      // Skip if clicking current route without query change
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start instant loading progress
      startTransition(() => {
        setIsVisible(true);
        setProgress(25);
      });

      const step1 = setTimeout(() => setProgress((p) => (p > 0 && p < 70 ? 65 : p)), 100);
      const step2 = setTimeout(() => setProgress((p) => (p > 0 && p < 90 ? 85 : p)), 400);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
      };
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none overflow-hidden bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#10B981] via-[#059669] to-[#34D399] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.7)]"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transition: progress === 100 ? "width 150ms ease-out, opacity 300ms ease-in" : "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
