"use client";

import { BrandSymbol } from "@/components/brand";
import { Parallax } from "@/components/motion/Parallax";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const FEATURES = [
  {
    index: "01",
    glyph: "portal-ring",
    title: "Unlimited links",
    desc: "Add as many links as you want with custom icons, labels, and ordering. Group them, section them, style them however you need.",
    tag: "free",
  },
  {
    index: "02",
    glyph: "modular-grid",
    title: "Deep visual control",
    desc: "Choose your background, card layout, button shape, font, spacing, and color scheme. Pro users get raw CSS injection for total control.",
    tag: "pro",
  },
  {
    index: "03",
    glyph: "data-node",
    title: "Built-in file hosting",
    desc: "Upload images, short videos, or files directly to your profile. Share your work without linking off to yet another platform.",
    tag: "pro",
  },
  {
    index: "04",
    glyph: "signal-wave",
    title: "Real analytics",
    desc: "Profile views, link click-through rates, traffic sources, device breakdown, and geographic data. Know who's looking and what they care about.",
    tag: "pro",
  },
  {
    index: "05",
    glyph: "orbital-path",
    title: "Platform widgets",
    desc: "Live Twitch status, Discord member count, Spotify now playing, YouTube latest video, Steam status, and more. Pulled live onto your page.",
    tag: "pro",
  },
  {
    index: "06",
    glyph: "energy-particle",
    title: "Identity badges",
    desc: "Pro, Verified, Early Adopter, Creator. Earn or purchase status badges that show on your profile — your reputation, visible at a glance.",
    tag: "both",
  },
  {
    index: "07",
    glyph: "coordinate-marker",
    title: "Custom domain",
    desc: "Point your own domain to your MVX page. yourname.com, brandstudio.co, whatever you own. It's yours to use.",
    tag: "pro",
  },
  {
    index: "08",
    glyph: "geometric-frame",
    title: "Privacy-first",
    desc: "No ad tracking. No third-party pixels. We don't sell your data or your visitors' data. Your page is yours, not an ad surface.",
    tag: "free",
  },
  {
    index: "09",
    glyph: "wayfinding",
    title: "Instant load speed",
    desc: "Static-first architecture with edge caching globally. Your profile loads in under 400ms anywhere in the world.",
    tag: "free",
  },
];

export function FeatureStory() {
  return (
    <section id="features" className="relative overflow-hidden px-[5%] py-25" aria-label="Capabilities">
      <Parallax speed={0.12} className="pointer-events-none absolute -left-[10%] top-[12%] text-[var(--muted-dim)] opacity-20" ariaHidden>
        <BrandSymbol name="orbital-path" size={360} />
      </Parallax>

      <div className="mx-auto max-w-[1180px]">
        <ScrollReveal>
          <div className="relative border-b border-[var(--border)] pb-10">
            <span className="mb-6 block font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
              {"//"} 03 — CAPABILITIES
            </span>
            <h2 className="font-display text-[clamp(42px,6.5vw,96px)] font-[800] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--text)]">
              Everything you need.
              <br />
              <span className="text-[var(--accent)]">Nothing you don&apos;t.</span>
            </h2>
            <p className="mt-6 max-w-[540px] text-[15px] leading-relaxed text-[var(--muted)]">
              We looked at every link-in-bio tool and kept only what matters.
              Then added the things everyone else forgot to build.
            </p>
          </div>
        </ScrollReveal>

        <ul className="divide-y divide-[var(--border)]">
          {FEATURES.map((feature) => (
            <ScrollReveal as="li" key={feature.index} y={36}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 py-8 transition-colors hover:bg-[var(--bg2)]/60 sm:grid-cols-[64px_64px_1fr_auto] sm:gap-x-9 sm:px-4">
                <span className="font-mono text-xs tracking-[0.2em] text-[var(--muted-dim)]">
                  {feature.index}
                </span>
                <span className="hidden text-[var(--accent)] opacity-60 transition-opacity group-hover:opacity-100 sm:block">
                  <BrandSymbol name={feature.glyph} size={44} />
                </span>
                <div>
                  <h3 className="mb-2 font-display text-[clamp(22px,2.6vw,34px)] font-[700] uppercase tracking-[0.01em] text-[var(--text)]">
                    {feature.title}
                  </h3>
                  <p className="max-w-[560px] text-sm leading-relaxed text-[var(--muted)]">
                    {feature.desc}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 font-mono text-[10px] font-[600] tracking-[0.18em] ${
                    feature.tag === "pro"
                      ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                      : feature.tag === "both"
                        ? "border border-[var(--accent)]/30 text-[var(--accent)]"
                        : "bg-[var(--success)]/10 text-[var(--success)]"
                  }`}
                >
                  {feature.tag === "pro" ? "PRO" : feature.tag === "both" ? "FREE + PRO" : "FREE"}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}