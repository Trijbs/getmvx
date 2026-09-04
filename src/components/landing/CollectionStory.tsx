"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { BrandSymbol } from "@/components/brand";
import { Parallax } from "@/components/motion/Parallax";
import { PinSection } from "@/components/motion/PinSection";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
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
  const isDesktopView = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  useScrollTimeline(sectionRef, {
    start: "top top",
    end: () => (sectionRef.current ? sectionRef.current.offsetHeight - window.innerHeight : 0),
    scrub: 0.6,
    build: ({ tl, q }) => {
      tl.fromTo(q(".story-eyebrow"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, immediateRender: true }, 0);
      tl.fromTo(q(".story-line-1"), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: "power3.out", immediateRender: true }, 0.06);
      tl.fromTo(q(".story-line-2a"), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: "power3.out", immediateRender: true }, 0.13);
      tl.fromTo(q(".story-stage"), { y: 72, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: true }, 0.2);
      tl.fromTo(q(".story-caption-a"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.34);
      tl.fromTo(q(".story-caption"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.36);
      tl.fromTo(q(".story-cta"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.38);
      tl.fromTo(q(".story-ticker"), { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: true }, 0.44);
      tl.fromTo(q(".story-chip"), { x: 110, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.12, immediateRender: true }, 0.46);
      tl.to(q(".story-line-2a"), { y: -14, opacity: 0, duration: 0.3 }, 0.7);
      tl.fromTo(q(".story-line-2b"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, immediateRender: true }, 0.7);
      tl.to(q(".story-caption-a"), { opacity: 0, duration: 0.25 }, 0.76);
      tl.fromTo(q(".story-caption-b"), { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: true }, 0.76);
      tl.to(q(".story-stage"), { scale: 0.97, opacity: 0.92, duration: 0.28 }, 1.18);
      tl.to(q(".story-chip, .story-caption, .story-caption-b, .story-cta, .story-ticker, .story-line-1, .story-line-2b"), { y: -18, opacity: 0.16, duration: 0.28 }, 1.18);
    },
  });

  useEffect(() => {
    const el = sectionRef.current?.querySelector(".story-breathe");
    if (!el || !isDesktopView || reducedMotion) return;
    const tween = gsap.fromTo(el, { scale: 1 }, { scale: 1.032, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => {
      tween.kill();
    };
  }, [isDesktopView, reducedMotion]);

  return (
    <section ref={sectionRef} id="platform" aria-label="The platform" className="relative">
      <PinSection heightVh={300}>
        <div className="relative grid h-full grid-cols-1 items-center gap-12 overflow-hidden px-[5%] py-16 lg:grid-cols-[1fr_auto] lg:py-0">
          <Parallax speed={0.2} className="pointer-events-none absolute right-[4%] top-[10%] hidden text-[var(--accent)] opacity-[0.14] lg:block" ariaHidden>
            <BrandSymbol name="constellation" size={460} className="max-w-[min(520px,70vw)]" />
          </Parallax>

          <div className="relative z-10">
            <span className="story-eyebrow mb-6 block font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
              {"//"} 02 — THE PLATFORM
            </span>
            <h2 className="font-display text-[clamp(44px,7vw,104px)] font-[800] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--text)]">
              <span className="story-line-1 block">One card.</span>
              <span className="relative block">
                <span className="story-line-2a absolute inset-0 block text-[var(--accent)]">Holds everything.</span>
                <span className="story-line-2b absolute inset-0 block opacity-0 text-[var(--accent2)]">Owns every signal.</span>
                <span className="invisible block">&nbsp;</span>
              </span>
            </h2>
            <p className="story-caption relative mt-7 max-w-[480px] text-[15px] leading-relaxed text-[var(--muted)]">
              <span className="story-caption-a absolute inset-0 block">
                Your MVX page is one living card: every social, every link, every
                piece of your identity — in one place, styled the way you want.
              </span>
              <span className="story-caption-b absolute inset-0 block opacity-0">
                One link in your bio. Every platform, every identity in sync —
                styled exactly the way you want.
              </span>
              <span className="invisible">
                Your MVX page is one living card: every social, every link, every
                piece of your identity — in one place, styled the way you want.
              </span>
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

          <div className="relative z-10 flex flex-col items-center justify-center lg:w-[420px]">
            <div className="story-stage relative">
              <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)]" />
              <div className="story-breathe">
                <ProfilePreview />
              </div>
            </div>
            <p className="story-caption mt-4 font-mono text-[10px] tracking-[0.25em] text-[var(--muted)]">
              LIVE PREVIEW — CLICK THEMES ABOVE
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:absolute lg:bottom-[10%] lg:left-1/2 lg:mt-0 lg:w-max lg:-translate-x-1/2">
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