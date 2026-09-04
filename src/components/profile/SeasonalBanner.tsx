"use client";

import { useEffect } from "react";
import type { Season } from "@/lib/seasons";
import { recordEgg } from "@/lib/eggs";

interface SeasonalBannerProps {
  season: Season | null;
}

export function SeasonalBanner({ season }: SeasonalBannerProps) {
  // Spotting a live seasonal banner counts toward the Hidden Hunter badge.
  useEffect(() => {
    if (season) recordEgg("seasonal");
  }, [season]);

  if (!season) return null;

  return (
    <div
      className="relative w-full overflow-hidden py-3 text-center"
      style={{
        background: `linear-gradient(135deg, ${season.palette.bg1} 0%, ${season.palette.bg2} 100%)`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${season.palette.accent} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      <p
        className="relative font-[family-name:var(--font-barlow)] text-sm font-600 tracking-wide"
        style={{ color: season.palette.text }}
      >
        <span className="mr-1.5">{season.emoji}</span>
        {season.name}
      </p>
    </div>
  );
}
