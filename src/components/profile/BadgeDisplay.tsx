"use client";

import type { Badge } from "../../../prisma/generated/prisma/client";

interface BadgeDisplayProps {
  badges: Badge[];
  showLabel?: boolean;
}

const badgeConfig: Record<
  string,
  { icon: string; color: string; bg: string; label: string }
> = {
  PRO: {
    icon: "✦",
    color: "#c9a96e",
    bg: "rgba(201,169,110,0.15)",
    label: "PRO",
  },
  VERIFIED: {
    icon: "✓",
    color: "#5b9cf6",
    bg: "rgba(91,156,246,0.15)",
    label: "Verified",
  },
  EARLY_ADOPTER: {
    icon: "★",
    color: "#9b7ef8",
    bg: "rgba(155,126,248,0.15)",
    label: "Early Adopter",
  },
  CUSTOM: {
    icon: "◆",
    color: "#4ecb8d",
    bg: "rgba(78,203,141,0.15)",
    label: "Custom",
  },
};

export function BadgeDisplay({ badges, showLabel = true }: BadgeDisplayProps) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {badges.map((badge) => {
        const config = badgeConfig[badge.type] || badgeConfig.CUSTOM;
        return (
          <span
            key={badge.id}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-600 tracking-wider"
            style={{ background: config.bg, color: config.color }}
          >
            {config.icon} {showLabel && (badge.label || config.label)}
          </span>
        );
      })}
    </div>
  );
}

export function BadgePreview() {
  const previewBadges = [
    { type: "PRO", label: "PRO" },
    { type: "VERIFIED", label: "Verified" },
    { type: "EARLY_ADOPTER", label: "Early Adopter" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {previewBadges.map((badge) => {
        const config = badgeConfig[badge.type];
        return (
          <span
            key={badge.type}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-600 tracking-wider"
            style={{ background: config.bg, color: config.color }}
          >
            {config.icon} {badge.label}
          </span>
        );
      })}
    </div>
  );
}
