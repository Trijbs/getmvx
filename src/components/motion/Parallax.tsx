"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollFrame } from "@/hooks/useScroll";

type ParallaxTag = "div" | "span" | "figure" | "section";

interface ParallaxProps {
  speed?: number;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  as?: ParallaxTag;
  ariaHidden?: boolean;
}

export function Parallax({
  speed = 0.35,
  className = "",
  children,
  style,
  as = "div",
  ariaHidden,
}: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isDesktopView = useIsDesktop();

  useScrollFrame((state) => {
    const el = ref.current;
    if (!el || reducedMotion || !isDesktopView) return;
    const rect = el.getBoundingClientRect();
    const offsetFromCenter = rect.top + rect.height / 2 - state.viewportH / 2;
    el.style.transform = `translate3d(0, ${-offsetFromCenter * speed}px, 0)`;
  });

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      style={reducedMotion || !isDesktopView ? style : { willChange: "transform", ...style }}
      aria-hidden={ariaHidden || undefined}
    >
      {children}
    </Tag>
  );
}