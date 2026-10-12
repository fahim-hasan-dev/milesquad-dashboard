import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUrl";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "rounded";
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-8 h-8 text-[11px]",
    dimension: 32,
  },
  md: {
    container: "w-9 h-9 text-xs",
    dimension: 36,
  },
  lg: {
    container: "w-12 h-12 text-base",
    dimension: 48,
  },
  xl: {
    container: "w-24 h-24 text-2xl border-4",
    dimension: 96,
  },
};

export default function UserAvatar({
  src,
  name,
  size = "md",
  shape = "circle",
  className = "",
}: UserAvatarProps) {
  const { container, dimension } = sizeClasses[size];
  const initial = (name || "U").trim().charAt(0).toUpperCase() || "U";
  const resolvedSrc = src ? getImageUrl(src) : null;
  const radiusClass = shape === "rounded" ? "rounded-xl" : "rounded-full";

  if (resolvedSrc) {
    return (
      <Image
        src={resolvedSrc}
        alt={name || "Avatar"}
        width={dimension}
        height={dimension}
        className={`${container} ${radiusClass} object-cover border border-slate-100 shrink-0 shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${container} ${radiusClass} bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0 shadow-sm border border-slate-100 ${className}`}
    >
      {initial}
    </div>
  );
}
