"use client";

import { usePathname } from "next/navigation";
import { capitalizeSentence } from "@/utils/capitalizeSentence";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "Overview";

  return (
    <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400">
      <Link href="/" className="hover:text-slate-600 transition-colors">
        Home Page
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
      <span className="text-slate-700 font-semibold">
        {capitalizeSentence(currentSegment)}
      </span>
    </div>
  );
};

export default DashboardBreadcrumb;
