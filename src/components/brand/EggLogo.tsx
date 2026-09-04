"use client";

import { useCallback } from "react";
import { RainbowLogo } from "@/components/brand/RainbowLogo";
import { recordEgg } from "@/lib/eggs";

/**
 * Convenience wrapper: renders the click-to-rainbow logo and records the logo
 * easter egg (localStorage) when a visitor clicks it.
 */
export function EggLogo({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const handleEggTrigger = useCallback(() => {
    recordEgg("logo");
  }, []);

  return (
    <RainbowLogo
      size={size}
      className={className}
      onEggTrigger={handleEggTrigger}
    />
  );
}
