"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageOption {
  code: "en" | "fr";
  label: string;
  flag: string;
  shortLabel: string;
}

const languages: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
    shortLabel: "EN",
  },
  {
    code: "fr",
    label: "Français",
    flag: "🇫🇷",
    shortLabel: "FR",
  },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<"en" | "fr">("en");
  const [mounted, setMounted] = useState(false);

  // Sync with cookies on mount and listen to custom language change events
  useEffect(() => {
    setMounted(true);
    const getLangFromCookie = (): "en" | "fr" => {
      if (typeof document === "undefined") return "en";
      const match = document.cookie.match(/googtrans=\/en\/([a-z]+)/i);
      if (match && match[1].toLowerCase() === "fr") {
        return "fr";
      }
      return "en";
    };

    setCurrentLang(getLangFromCookie());

    const handleLangChanged = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail === "fr" || customEvent.detail === "en") {
        setCurrentLang(customEvent.detail);
      }
    };

    window.addEventListener("lang-changed", handleLangChanged);
    return () => {
      window.removeEventListener("lang-changed", handleLangChanged);
    };
  }, []);

  const handleSelectLanguage = (code: "en" | "fr") => {
    if (code === currentLang) return;
    setCurrentLang(code);

    if (typeof window !== "undefined" && typeof window.__applyTranslate === "function") {
      window.__applyTranslate(code);
    } else {
      // Fallback direct cookie write in case widget is still loading
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      document.cookie = `googtrans=/en/${code}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
      window.location.reload();
    }
  };

  const activeOption = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none cursor-pointer notranslate"
        aria-label="Change language"
      >
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-semibold text-slate-700">
          <span className="text-sm leading-none" role="img" aria-label={activeOption.label}>
            {mounted ? activeOption.flag : "🌐"}
          </span>
          <span className="font-bold text-slate-800 tracking-wide text-xs">
            {mounted ? activeOption.shortLabel : "EN"}
          </span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 p-1.5 rounded-2xl shadow-xl border border-slate-100 space-y-1 bg-white notranslate z-50"
      >
        <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center gap-1.5">
          <Globe className="h-3 w-3 text-slate-400" />
          <span>Language</span>
        </div>

        {languages.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
                isSelected
                  ? "bg-emerald-50 text-emerald-900 font-bold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-[#10B981] stroke-[2.5]" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
