"use client";

import { useRef } from "react";
import Link from "next/link";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollFrame } from "@/hooks/useScroll";
import { clamp } from "@/lib/motion/math";

const LOOKS = [
  {
    drop: "DROP 001",
    name: "PURE STREET",
    handle: "@street.paste",
    bg: "#101013",
    text: "#f4f3ef",
    muted: "#7c7a86",
    accent: "#c9a96e",
    avatar: "linear-gradient(135deg,#c9a96e,#f2d9a0)",
    linkBg: "rgba(255,255,255,0.06)",
  },
  {
    drop: "DROP 002",
    name: "MINIMAL EDIT",
    handle: "@mute.studio",
    bg: "#f2f1ec",
    text: "#141414",
    muted: "#8a8a86",
    accent: "#141414",
    avatar: "linear-gradient(135deg,#d8d8d2,#aaaaaa)",
    linkBg: "rgba(0,0,0,0.05)",
  },
  {
    drop: "DROP 003",
    name: "GOLD STANDARD",
    handle: "@vault.rosa",
    bg: "#0e0b06",
    text: "#f0e8d0",
    muted: "#6a5a3a",
    accent: "#c9a96e",
    avatar: "linear-gradient(135deg,#1a1200,#2d2000)",
    linkBg: "rgba(201,169,110,0.1)",
  },
  {
    drop: "DROP 004",
    name: "RAVE SIGNAL",
    handle: "@uv.breathe",
    bg: "#0c0c18",
    text: "#eeeaff",
    muted: "#7a74a0",
    accent: "#9b7ef8",
    avatar: "linear-gradient(135deg,#5b9cf6,#9b7ef8)",
    linkBg: "rgba(155,126,248,0.12)",
  },
  {
    drop: "DROP 005",
    name: "MONO ARCHIVE",
    handle: "@archive.bw",
    bg: "#0c0c0e",
    text: "#ffffff",
    muted: "#5a5968",
    accent: "#ffffff",
    avatar: "linear-gradient(135deg,#fff,#888888)",
    linkBg: "rgba(255,255,255,0.07)",
  },
];

export function Lookbook() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const isDesktopView = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const settled = isDesktopView && !reducedMotion;

  useScrollFrame((state) => {
    if (!settled) return;
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const rect = section.getBoundingClientRect();
    const progress = clamp(
      -rect.top / (rect.height - state.viewportH),
      0,
      1,
    );
    const overflow = rail.scrollWidth - state.viewportW * 0.9;
    rail.style.transform = `translate3d(${-overflow * progress}px, 0, 0)`;

    if (labelRef.current) {
      const index = Math.min(LOOKS.length, Math.max(1, Math.ceil(progress * LOOKS.length)));
      labelRef.current.textContent = String(index).padStart(2, "0");
    }
  });

  const cards = (
    <>
      {LOOKS.map((look) => (
        <div
          key={look.drop}
          className="relative w-[min(320px,86vw)] shrink-0 overflow-hidden rounded-[20px] border border-[var(--border2)] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          style={{ background: look.bg }}
        >
          <span
            className="absolute right-5 top-5 font-mono text-[9px] tracking-[0.25em]"
            style={{ color: look.muted }}
          >
            {look.drop}
          </span>

          <div className="flex items-center justify-between">
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full text-[15px] font-[700]"
              style={{
                background: look.avatar,
                color: "#0c0c0e",
              }}
            >
              {look.drop.split(" ")[1]}
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: look.muted }}>
              MVX / LIVE
            </span>
          </div>

          <div className="mt-5">
            <div
              className="font-display text-[26px] font-[800] uppercase leading-none tracking-[0.02em]"
              style={{ color: look.text }}
            >
              {look.name}
            </div>
            <div className="mt-1 font-mono text-[11px]" style={{ color: look.muted }}>
              {look.handle}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {["Portfolio", "Shop / Drops", "Discord", "Fresh Tunes"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[10px] px-3.5 py-2.5"
                style={{ background: look.linkBg }}
              >
                <span className="text-[12px] font-[500]" style={{ color: look.text }}>
                  {label}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: look.accent }}>
                  ↗
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Link
        href="/register"
        className="flex w-[min(300px,80vw)] shrink-0 flex-col items-start justify-between rounded-[20px] border border-[var(--accent)] bg-[var(--accent-dim)] p-6 transition-all hover:bg-[var(--accent-glow)]"
      >
        <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)]">
          DROP 006 — YOURS
        </span>
        <span className="mt-4 font-display text-[30px] font-[800] uppercase leading-none tracking-[-0.01em] text-[var(--text)]">
          Build
          <br />
          your look.
        </span>
        <span className="mt-4 font-mono text-[11px] tracking-[0.2em] text-[var(--accent)]">
          CREATE FREE →
        </span>
      </Link>
    </>
  );

  return (
    <section ref={sectionRef} id="lookbook" className="relative" aria-label="Lookbook">
      {settled ? (
        <div style={{ height: "340vh" }}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-glow)_0%,transparent_60%)]" />
            <header className="absolute left-[7vw] top-14 z-10">
              <span className="font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
                {"//"} 04 — LOOKBOOK
              </span>
              <h2 className="mt-3 font-display text-[clamp(38px,4.5vw,64px)] font-[800] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--text)]">
                Choose your
                <br />
                <span className="text-[var(--accent)]">look.</span>
              </h2>
            </header>
            <span className="absolute right-[7vw] top-14 z-10 text-right font-mono text-[10px] tracking-[0.25em] text-[var(--muted)]">
              VERTICAL SCROLL — HORIZONTAL MOVE
            </span>
            <span className="absolute right-[7vw] top-[72%] z-10 font-display text-[52px] font-[800] leading-none text-[var(--accent)]">
              <span ref={labelRef}>01</span>
              <span className="text-[var(--muted-dim)]">/05</span>
            </span>
            <div ref={railRef} className="absolute inset-y-0 flex items-center gap-10 pl-[7vw] will-change-transform">
              {cards}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-[5%] py-16">
          <span className="font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
            {"//"} 04 — LOOKBOOK
          </span>
          <h2 className="mt-3 font-display text-[clamp(38px,11vw,58px)] font-[800] uppercase leading-[0.92] tracking-[-0.02em]">
            Choose your
            <br />
            <span className="text-[var(--accent)]">look.</span>
          </h2>
          <div className="mt-10 flex flex-col gap-8">{cards}</div>
        </div>
      )}
    </section>
  );
}