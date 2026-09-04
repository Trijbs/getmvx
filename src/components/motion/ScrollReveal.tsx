"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollFrame } from "@/hooks/useScroll";
import { clamp, easeOutCubic, mapRange } from "@/lib/motion/math";

type RevealTag = "div" | "section" | "figure" | "li";

interface ScrollRevealProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  y?: number;
  as?: RevealTag;
}

export function ScrollReveal({
  children,
  className = "",
  style,
  y = 44,
  as = "div",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useScrollFrame((state) => {
    const el = elementRef.current;
    if (!el || reducedMotion) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > state.viewportH) return;
    const progress = mapRange(rect.top, state.viewportH, state.viewportH * 0.35, 0, 1);
    const eased = easeOutCubic(progress);
    el.style.opacity = String(clamp(progress, 0, 1));
    el.style.transform = `translate3d(0, ${(1 - eased) * y}px, 0)`;
  });

  const Tag = as as ElementType;

  return (
    <Tag ref={elementRef} className={className} style={reducedMotion ? { opacity: 1, ...style } : { willChange: "opacity, transform", ...style }}>
      {children}
    </Tag>
  );
}