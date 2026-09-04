"use client";

import { useRef } from "react";
import { BrandSymbol } from "@/components/brand";
import { Parallax } from "@/components/motion/Parallax";
import { useScrollTimeline } from "@/lib/motion/timeline";

export function BrandTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useScrollTimeline(sectionRef, {
    start: "top 85%",
    end: "bottom 40%",
    scrub: true,
    build: ({ tl, q }) => {
      tl.fromTo(
        q(".brand-line-1"),
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        0,
      );
      tl.fromTo(
        q(".brand-line-2"),
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        0.08,
      );
      tl.fromTo(
        q(".brand-caption"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.16,
      );
      tl.fromTo(
        q(".brand-constellation"),
        { rotate: 0, opacity: 0.12 },
        { rotate: 90, opacity: 0.5, duration: 1.2 },
        0.1,
      );
      tl.to(q(".brand-constellation"), { opacity: 0.18, duration: 0.6 }, 1.2);
    },
  });

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--bg2)] px-[5%] py-28" aria-label="Manifesto">
      <Parallax speed={0.3} className="pointer-events-none absolute inset-0 grid place-items-center" ariaHidden>
        <span className="brand-constellation block text-[var(--accent)] opacity-[0.16]">
          <BrandSymbol name="constellation" size={520} className="max-w-[min(640px,90vw)]" />
        </span>
      </Parallax>
      <Parallax speed={-0.2} className="pointer-events-none absolute right-[8%] top-[18%] text-[var(--muted-dim)]" ariaHidden>
        <BrandSymbol name="portal-ring" size={96} />
      </Parallax>

      <div className="relative mx-auto max-w-[1100px] text-center">
        <span className="mb-6 block font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
          {"//"} 01 — THE PITCH
        </span>
        <h2 className="font-display text-[clamp(44px,7.5vw,110px)] font-[800] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--text)]">
          <span className="brand-line-1 block">Own your</span>
          <span className="brand-line-2 block text-[var(--accent)]">internet presence.</span>
        </h2>
        <p className="brand-caption mx-auto mt-7 max-w-[520px] font-mono text-[12px] leading-relaxed tracking-[0.12em] text-[var(--muted)]">
          EVERY PLATFORM RENTS YOU AN AUDIENCE. MVX HANDS IT BACK — ONE CARD,
          EVERY SIGNAL, YOUR RULES.
        </p>
      </div>
    </section>
  );
}