"use client";

import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pauseScrollState, resumeScrollState, subscribeScrollFrame } from "@/lib/motion/scroll";

interface ScrollProviderProps {
  children: ReactNode;
  smooth?: boolean;
}

export function ScrollProvider({ children, smooth = true }: ScrollProviderProps) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    resumeScrollState(!reducedMotion && smooth);
    const unsubscribe = subscribeScrollFrame(() => {});
    return () => {
      unsubscribe();
      pauseScrollState();
    };
  }, [reducedMotion, smooth]);

  return <>{children}</>;
}