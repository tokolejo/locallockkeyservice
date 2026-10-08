"use client";

import React, { useState } from "react";

interface ReviewAvatarProps {
  name: string;
  photoUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ReviewAvatar({
  name,
  photoUrl,
  className = "",
  size = "md",
}: ReviewAvatarProps) {
  // 0: original URL with no-referrer
  // 1: proxy fallback (/api/avatar?url=...)
  // 2: initials fallback
  const [attempt, setAttempt] = useState<number>(0);

  const sizeClasses = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
  }[size];

  const gradients = [
    "from-emerald-600 to-teal-500",
    "from-blue-600 to-indigo-500",
    "from-amber-600 to-orange-500",
    "from-rose-600 to-pink-500",
    "from-violet-600 to-purple-500",
    "from-cyan-600 to-blue-500",
  ];
  const charCode = (name && name.length > 0 ? name.charCodeAt(0) : 0) + (name.length || 0);
  const gradient = gradients[charCode % gradients.length];

  const initials =
    (name || "U")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  if (!photoUrl || attempt >= 2) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-linear-to-tr ${gradient} text-white flex items-center justify-center font-black select-none shrink-0 shadow-2xs ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  const currentSrc =
    attempt === 0
      ? photoUrl
      : `/api/avatar?url=${encodeURIComponent(photoUrl)}`;

  return (
    <img
      src={currentSrc}
      alt={name}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => {
        setAttempt((prev) => prev + 1);
      }}
      className={`${sizeClasses} rounded-full object-cover border border-slate-200/90 shrink-0 shadow-2xs ${className}`}
    />
  );
}
