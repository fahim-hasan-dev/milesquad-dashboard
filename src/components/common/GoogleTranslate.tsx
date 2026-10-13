/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __gtReady?: boolean;
    __applyTranslate?: (lang: string) => void;
    __retranslate?: () => void;
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  const pathname = usePathname();

  // Patch DOM methods to handle NotFoundError from Google Translate DOM mutations during React reconciliation
  useEffect(() => {
    const origRemove = Node.prototype.removeChild;
    const origAppend = Node.prototype.appendChild;
    const origInsert = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      try {
        return origRemove.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError" || e.code === 8) return child;
        throw e;
      }
    };

    Node.prototype.appendChild = function <T extends Node>(child: T): T {
      try {
        return origAppend.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError" || e.code === 8) return child;
        throw e;
      }
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      ref: Node | null,
    ): T {
      try {
        return origInsert.call(this, newNode, ref) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError" || e.code === 8) return newNode;
        throw e;
      }
    };
  }, []);

  // Prevent Google Translate from applying text selection / hover highlight on translated text
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === "FONT" ||
        target.classList?.contains("goog-text-highlight")
      ) {
        target.classList.remove("goog-text-highlight");
        target.style.setProperty("background", "transparent", "important");
        target.style.setProperty("background-color", "transparent", "important");
        target.style.setProperty("box-shadow", "none", "important");
        target.style.setProperty("outline", "none", "important");
      }
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
    };
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    // Helper to safely set googtrans cookie
    const setGoogtransCookie = (lang: string) => {
      if (typeof document === "undefined") return;
      const hostname = window.location.hostname;
      const domain = hostname.split(".").slice(-2).join(".");
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const expires = date.toUTCString();

      // Clear any prior cookies
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      if (domain && domain.includes(".")) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
      }

      document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; SameSite=Lax`;
      if (domain && domain.includes(".")) {
        document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; domain=.${domain}; SameSite=Lax`;
      }
    };

    // Default language is English:
    // If no translation cookie exists, or if cookie holds another test language (e.g. 'de'), enforce English default
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]+)/i);
      if (!match) {
        setGoogtransCookie("en");
      } else if (match[1] !== "fr" && match[1] !== "en") {
        setGoogtransCookie("en");
      }
    }

    // Define retranslate helper to trigger translation of dynamic elements (modals, new pages)
    window.__retranslate = () => {
      if (typeof document === "undefined") return;
      const isFrench = document.cookie.includes("googtrans=/en/fr");
      if (!isFrench) return;

      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (!combo) return;

      // Force Google Translate to re-scan newly mounted elements (modals, portals, tables)
      // by temporarily resetting and re-dispatching 'fr' so the change listener triggers
      combo.value = "";
      combo.dispatchEvent(new Event("change", { bubbles: true }));

      setTimeout(() => {
        combo.value = "fr";
        combo.dispatchEvent(new Event("change", { bubbles: true }));
      }, 35);
    };

    // Define the apply function
    window.__applyTranslate = (targetLang: string) => {
      console.log(`[Google Translate] Switching to: ${targetLang}`);
      setGoogtransCookie(targetLang);

      // Notify language switcher UI
      window.dispatchEvent(
        new CustomEvent("lang-changed", { detail: targetLang })
      );

      // If switching back to English, clear translation cleanly
      if (targetLang === "en") {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (combo) {
          const hasEnOption = Array.from(combo.options).some((o) => o.value === "en");
          combo.value = hasEnOption ? "en" : "";
          combo.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Clean reload ensures all DOM <font> nodes revert to original pristine English
        setTimeout(() => {
          window.location.reload();
        }, 80);
        return;
      }

      const tryChange = () => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (combo) {
          if (combo.value !== targetLang) {
            combo.value = targetLang;
            combo.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return true;
        }
        return false;
      };

      // Persistent retry to accommodate widget asynchronous initialization
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const found = tryChange();
        if ((found && attempts > 4) || attempts > 20) {
          clearInterval(interval);
          if (attempts > 20 && !found) {
            console.warn("[Google Translate] Retrying with reload...");
            window.location.reload();
          }
        }
      }, 200);
    };

    // Callback for Google Translate script
    window.googleTranslateElementInit = () => {
      try {
        if (!window.google?.translate?.TranslateElement) return;
        const target = document.getElementById("google_translate_element");
        if (!target) return;
        target.innerHTML = "";

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        window.__gtReady = true;

        // If user previously selected French, apply once widget is loaded
        if (document.cookie.includes("googtrans=/en/fr")) {
          setTimeout(() => {
            window.__applyTranslate?.("fr");
          }, 200);
        }
      } catch (error) {
        console.debug("[Google Translate] Initialization error", error);
      }
    };

    // Load Google Translate script if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // MutationObserver to automatically translate dynamically mounted Modals, Portals, and Dialogs
  // and actively hide any injected Google Translate floating logo/spinners
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    const cleanupGoogleUi = () => {
      const elements = document.querySelectorAll(
        '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-aZ2wEe, .goog-te-spinner-pos, .goog-te-spinner, .goog-logo-link, #goog-gt-tt, .goog-te-balloon-frame'
      );
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty("display", "none", "important");
        htmlEl.style.setProperty("visibility", "hidden", "important");
        htmlEl.style.setProperty("opacity", "0", "important");
        htmlEl.style.setProperty("pointer-events", "none", "important");
      });
    };

    const observer = new MutationObserver((mutations) => {
      cleanupGoogleUi();

      if (!document.cookie.includes("googtrans=/en/fr")) return;

      let hasNewModalOrPortal = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          for (const node of Array.from(m.addedNodes)) {
            if (node instanceof HTMLElement) {
              if (
                node.id === "goog-gt-tt" ||
                node.tagName === "FONT" ||
                node.classList?.contains("notranslate") ||
                node.classList?.contains("goog-te-balloon-frame") ||
                node.className?.includes?.("VIpgJd")
              ) {
                continue;
              }

              // Check if modal, dialog, radix portal, or view details container was mounted
              if (
                node.getAttribute?.("role") === "dialog" ||
                node.getAttribute?.("role") === "alertdialog" ||
                node.querySelector?.('[role="dialog"]') ||
                node.querySelector?.('[role="alertdialog"]') ||
                node.hasAttribute?.("data-radix-portal") ||
                node.classList?.contains("fixed")
              ) {
                hasNewModalOrPortal = true;
                break;
              }
            }
          }
        }
        if (hasNewModalOrPortal) break;
      }

      if (hasNewModalOrPortal) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          window.__retranslate?.();
        }, 80);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check to remove floating logo/spinner
    cleanupGoogleUi();

    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);

  // Route change handler: automatically re-translate when navigating across dashboard pages
  useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("googtrans=/en/fr")) {
      const timer1 = setTimeout(() => window.__retranslate?.(), 100);
      const timer2 = setTimeout(() => window.__retranslate?.(), 350);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [pathname]);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -9999,
      }}
      className="notranslate"
    />
  );
}
