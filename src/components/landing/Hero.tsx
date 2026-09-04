"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { HeroMark } from "@/components/brand";
import { Parallax } from "@/components/motion/Parallax";
import { useScrollTimeline } from "@/lib/motion/timeline";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [signupStatus, setSignupStatus] = useState<"idle" | "success" | "loading">("idle");

  useScrollTimeline(sectionRef, {
    start: "top top",
    end: "bottom top",
    scrub: true,
    build: ({ tl, q }) => {
      tl.to(q(".hero-ghost"), { y: -140, opacity: 0, duration: 1 }, 0);
      tl.to(q(".hero-eyebrow"), { y: -30, opacity: 0, duration: 0.7 }, 0.15);
      tl.to(q(".hero-line-1"), { y: -60, opacity: 0.15, duration: 1 }, 0);
      tl.to(q(".hero-line-2"), { y: -160, opacity: 0, duration: 1 }, 0.05);
      tl.to(q(".hero-mark"), { scale: 1.35, opacity: 0.1, rotate: 30, transformOrigin: "50% 50%", duration: 1 }, 0.1);
      tl.to(q(".hero-copy"), { y: 80, opacity: 0, duration: 0.8 }, 0.4);
      tl.to(q(".hero-cue"), { opacity: 0, duration: 0.5 }, 0.45);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignupStatus("loading");

    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const role = (form.querySelector("select") as HTMLSelectElement).value;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (res.ok) {
        setSignupStatus("success");
        form.reset();
        setTimeout(() => setSignupStatus("idle"), 3000);
      } else {
        setSignupStatus("idle");
      }
    } catch {
      setSignupStatus("idle");
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-[5%] pb-24 pt-32"
      aria-label="Intro"
    >
      <div className="absolute inset-0 z-0">
        <Parallax speed={0.22} className="absolute -right-[14%] top-[8%] text-[var(--accent)] opacity-[0.18]" ariaHidden>
          <HeroMark size={420} />
        </Parallax>
        <Parallax speed={0.45} className="absolute -left-[8%] bottom-[4%] rotate-12 text-[var(--muted-dim)] opacity-30" ariaHidden>
          <HeroMark size={240} />
        </Parallax>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-glow)_0%,transparent_55%)]" />
      </div>

      <span className="hero-ghost ghost-word pointer-events-none absolute left-1/2 top-1/2 z-0 select-none" aria-hidden="true">
        MVX
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 content-center items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="hero-eyebrow mb-8 flex items-center justify-between gap-6 border-b border-[var(--border)] pb-5 font-mono text-[11px] tracking-[0.22em] text-[var(--muted)]">
            <span>
              MVX STUDIO <span className="text-[var(--accent)]">{"//"}</span> LINK-IN-BIO, REBUILT
            </span>
            <span className="hidden sm:inline">EST. 2026 / EARLY ACCESS</span>
          </div>

          <div className="hero-mark mb-8 hidden lg:block">
            <HeroMark size={52} />
          </div>

          <h1 className="font-display text-[clamp(58px,9.5vw,150px)] font-[800] uppercase leading-[0.88] tracking-[-0.02em] text-[var(--text)]">
            <span className="hero-line-1 block">
              Your identity,
            </span>
            <span className="hero-line-2 block text-[var(--accent)]">
              fully yours.
            </span>
          </h1>

          <p className="hero-copy mt-8 max-w-[420px] text-[15px] leading-relaxed text-[var(--muted)]">
            One link. Every social. Total control. MVX is the link-in-bio
            platform that refuses to look like everyone else&apos;s — built for
            creators, gamers, brands, and anyone who takes their online
            presence seriously.
          </p>

          <div className="hero-copy mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-block rounded-[10px] bg-[var(--accent)] px-8 py-3.5 text-[15px] font-[600] text-[var(--bg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)]"
            >
              Create your page, it&apos;s free
            </Link>
            <a
              href="#pricing"
              className="inline-block rounded-[10px] border border-[var(--border2)] bg-transparent px-8 py-3.5 text-[15px] font-[500] text-[var(--muted)] transition-all hover:border-white/25 hover:text-[var(--text)]"
            >
              See Pro features
            </a>
          </div>

          <form onSubmit={handleSubmit} className="hero-copy mt-7 flex max-w-[560px] flex-wrap gap-2">
            <label htmlFor="hero-email" className="sr-only">
              Email address
            </label>
            <input
              id="hero-email"
              type="email"
              placeholder="your@email.com"
              required
              className="min-w-[180px] flex-1 rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
            <label htmlFor="hero-role" className="sr-only">
              I am a...
            </label>
            <select
              id="hero-role"
              className="appearance-none rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238a8998%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat px-4 py-3 pr-8 text-sm text-[var(--muted)] outline-none transition-[border-color] focus:border-[var(--accent)]"
            >
              <option value="" disabled selected>
                I am a...
              </option>
              <option value="creator">Creator</option>
              <option value="gamer">Gamer</option>
              <option value="brand">Brand</option>
              <option value="other">Other</option>
            </select>
            <button
              type="submit"
              disabled={signupStatus === "loading"}
              className="whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-6 py-3 text-sm font-[600] text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
            >
              {signupStatus === "success"
                ? "You're in!"
                : signupStatus === "loading"
                  ? "Joining..."
                  : "Join early access"}
            </button>
          </form>
          <p className="hero-copy mt-2.5 font-mono text-xs tracking-wide text-[var(--muted)]">
            Free forever · No credit card needed · Join the waitlist
          </p>

          <div className="hero-copy mt-9 flex items-center gap-4">
            <div className="flex">
              {[
                { letter: "K", bg: "#9b7ef8" },
                { letter: "M", bg: "#4ecb8d" },
                { letter: "T", bg: "#5b9cf6" },
                { letter: "J", bg: "#e85555" },
                { letter: "A", bg: "#c9a96e" },
              ].map((avatar, i) => (
                <span
                  key={avatar.letter}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[var(--bg)] text-[13px] font-[600] text-white"
                  style={{
                    background: avatar.bg,
                    marginLeft: i > 0 ? -8 : 0,
                    color:
                      avatar.bg === "#4ecb8d" || avatar.bg === "#c9a96e" ? "#0c0c0e" : "#fff",
                  }}
                >
                  {avatar.letter}
                </span>
              ))}
            </div>
            <p className="text-[13px] text-[var(--muted)]">
              <strong className="font-[600] text-[var(--text)]">
                Join thousands of creators
              </strong>{" "}
              on the waitlist
            </p>
          </div>
        </div>

        <div className="hero-copy hidden justify-self-end lg:block">
          <div className="flex max-w-[360px] flex-col gap-6">
            {[
              { glyph: "portal-ring", label: "ONE LINK" },
              { glyph: "signal-wave", label: "EVERY SIGNAL" },
              { glyph: "coordinate-marker", label: "TOTAL CONTROL" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-5 border-b border-[var(--border)] pb-6"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent-glow)] text-[var(--accent)]">
                  <span className="block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </span>
                <span className="font-mono text-xs tracking-[0.25em] text-[var(--muted)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-cue absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--muted-dim)]">SCROLL</span>
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-[var(--accent)] to-transparent" />
      </div>
    </section>
  );
}