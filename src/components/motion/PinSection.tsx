"use client";

import { type ReactNode } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface PinSectionProps {
  heightVh?: number;
  zIndex?: number;
  className?: string;
  children: ReactNode;
}

export function PinSection({
  heightVh = 300,
  zIndex = 0,
  className = "",
  children,
}: PinSectionProps) {
  const isDesktopView = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const pinned = isDesktopView && !reducedMotion;

  return (
    <div
      className="relative"
      style={pinned ? { height: `${heightVh}vh`, zIndex } : { zIndex }}
      data-pin-height={heightVh}
    >
      <div className={pinned ? `sticky top-0 h-screen overflow-hidden ${className}` : className}>
        {children}
      </div>
    </div>
  );
}