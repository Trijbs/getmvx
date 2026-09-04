"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollFrame } from "@/hooks/useScroll";

export function ScrollProgress() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useScrollFrame((state) => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const pct = pctRef.current;
    if (!root || !fill) return;

    const maxY = state.documentH - state.viewportH;
    const progress = maxY > 0 ? Math.min(1, Math.max(0, state.y / maxY)) : 0;

    fill.style.height = `${progress * 100}%`;
    root.style.opacity = state.y > 60 && progress < 0.995 ? "1" : "0";
    if (pct) pct.textContent = String(Math.round(progress * 100)).padStart(2, "0");
  });

  if (reducedMotion) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-7 top-1/2 z-[90] hidden -translate-y-1/2 flex-col items-center gap-3 transition-opacity duration-500 lg:flex"
      style={{ opacity: 0 }}
    >
      <div className="relative h-[120px] w-px bg-[var(--border3)]">
        <span
          ref={fillRef}
          className="absolute left-0 top-0 block w-px bg-[var(--accent)]"
          style={{ height: "0%" }}
        />
      </div>
      <span ref={pctRef} className="font-mono text-[10px] tracking-widest text-[var(--muted-dim)]">
        00
      </span>
    </div>
  );
}