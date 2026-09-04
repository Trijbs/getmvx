"use client";

import { useRef } from "react";
import Link from "next/link";
import { BrandSymbol } from "@/components/brand";
import { Parallax } from "@/components/motion/Parallax";
import { PinSection } from "@/components/motion/PinSection";
import { useScrollTimeline } from "@/lib/motion/timeline";
import { ProfilePreview } from "./ProfilePreview";

const WIDGET_CHIPS = [
  { tag: "TWITCH", state: "LIVE NOW", color: "var(--accent)" },
  { tag: "DISCORD", state: "12.4K ONLINE", color: "var(--accent)" },
  { tag: "SPOTIFY", state: "NOW PLAYING", color: "var(--accent)" },
  { tag: "STEAM", state: "IN-GAME", color: "var(--accent)" },
];

const TICKER = ["UNLIMITED LINKS", "LIVE WIDGETS", "REAL ANALYTICS", "CSS INJECTION", "CUSTOM DOMAIN"];

export function CollectionStory() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useScrollTimeline(sectionRef, {
    start: "top top",
    end: () => (sectionRef.current ? sectionRef.current.offsetHeight - window.innerHeight : 0),
    scrub: 0.6,
    build: ({ tl, q }) => {
      const stage = q(".story-stage")[0] as HTMLElement | undefined;

      tl.fromTo(q(".story-eyebrow"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, immediateRender: true }, 0);
      tl.fromTo(q(".story-line-1"), { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: true }, 0.06);
      tl.fromTo(q(".story-line-2"), { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: true }, 0.12);
      tl.fromTo(q(".story-caption"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.22);
      tl.fromTo(q(".story-cta"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.26);
      tl.fromTo(q(".story-ticker"), { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: true }, 0.3);
      tl.fromTo(q(".story-chip"), { x: 110, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out", stagger: 0.06, immediateRender: true }, 0.3);

      tl.to(q(".story-eyebrow, .story-line-1, .story-line-2, .story-caption, .story-cta, .story-ticker"), { y: -36, opacity: 0, duration: 0.38, ease: "power2.in" }, 0.36);
      tl.to(q(".story-chip, .story-tag"), { x: -90, opacity: 0, duration: 0.3, ease: "power2.in" }, 0.38);

      if (stage) {
        const diveScale = Math.min(1.9, Math.max(1.5, window.innerWidth / 520));
        tl.to(
          stage,
          {
            x: () => window.innerWidth / 2 - (stage.getBoundingClientRect().left + stage.getBoundingClientRect().width / 2),
            y: () => window.innerHeight / 2 - (stage.getBoundingClientRect().top + stage.getBoundingClientRect().height / 2),
            scale: diveScale,
            transformOrigin: "50% 50%",
            ease: "power1.inOut",
            duration: 1.1,
          },
          0.3,
        );
        tl.to(q(".story-glow"), { scale: 1.15, opacity: 0.95, duration: 0.3, ease: "power2.out" }, 1.4);
        tl.to(stage, { scale: diveScale * 0.96, duration: 0.3, ease: "power2.in" }, 1.55);
      }

      tl.fromTo(q(".story-watermark"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: true }, 1.4);
      tl.to(q(".story-watermark"), { y: -16, opacity: 0, duration: 0.25, ease: "power2.in" }, 1.55);
      tl.to(q(".story-card"), { rotationX: 88, y: -56, opacity: 0, transformOrigin: "50% 100%", ease: "power2.in", duration: 0.3 }, 1.55);
    },
  });

  return (
    <section ref={sectionRef} id="platform" aria-label="The platform" className="relative">
      <PinSection heightVh={400}>
        <div className="relative grid h-full grid-cols-1 items-center gap-12 overflow-hidden px-[5%] py-16 lg:grid-cols-[1fr_auto] lg:py-0">
          <Parallax speed={0.2} className="pointer-events-none absolute right-[4%] top-[10%] hidden text-[var(--accent)] opacity-[0.14] lg:block" ariaHidden>
            <BrandSymbol name="constellation" size={460} className="max-w-[min(520px,70vw)]" />
          </Parallax>

          <div className="story-watermark pointer-events-none absolute left-[5%] top-[8%] z-20 opacity-0">
            <span className="block font-mono text-[10px] tracking-[0.28em] text-[var(--accent)]">
              THE WHOLE YOU
            </span>
            <span className="mt-1 block font-mono text-[10px] tracking-[0.28em] text-[var(--muted-dim)]">
              {"//"} ONE LINK
            </span>
          </div>

          <div className="relative z-10">
            <span className="story-eyebrow mb-6 block font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
              {"//"} 02 — THE PLATFORM
            </span>
            <h2 className="font-display text-[clamp(44px,7vw,104px)] font-[800] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--text)]">
              <span className="story-line-1 block">One card.</span>
              <span className="story-line-2 block text-[var(--accent)]">Holds everything.</span>
            </h2>
            <p className="story-caption mt-7 max-w-[480px] text-[15px] leading-relaxed text-[var(--muted)]">
              Your MVX page is one living card: every social, every link, every
              piece of your identity — in one place, styled the way you want.
            </p>

            <Link
              href="/register"
              className="story-cta mt-9 inline-block rounded-[10px] bg-[var(--accent)] px-7 py-3.5 text-sm font-[600] text-[var(--bg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)]"
            >
              Create your page, it&apos;s free
            </Link>

            <div className="story-ticker mt-10 hidden items-center gap-8 border-t border-[var(--border)] pt-6 lg:flex">
              {TICKER.map((tick) => (
                <span key={tick} className="whitespace-nowrap font-mono text-[10px] tracking-[0.22em] text-[var(--muted-dim)]">
                  {tick}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center lg:w-[520px]">
            <div className="story-stage relative">
              <div className="story-glow absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] opacity-60" />
              <div className="story-card relative">
                <ProfilePreview />
              </div>
            </div>
            <p className="story-tag mt-4 font-mono text-[10px] tracking-[0.25em] text-[var(--muted)]">
              LIVE PREVIEW — CLICK THEMES ABOVE
            </p>

            <div className="story-chips mt-8 flex flex-wrap justify-center gap-3 lg:absolute lg:bottom-[10%] lg:left-1/2 lg:mt-0 lg:w-max lg:-translate-x-1/2">
              {WIDGET_CHIPS.map((chip) => (
                <span
                  key={chip.tag}
                  className="story-chip flex items-center gap-3 rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)]/80 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] backdrop-blur"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: chip.color }} />
                  <span>{chip.tag}</span>
                  <span className="text-[var(--accent)]">{chip.state}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </PinSection>
    </section>
  );
}