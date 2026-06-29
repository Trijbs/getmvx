"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroMark } from "@/components/brand";
import { ProfilePreview } from "./ProfilePreview";

export function Hero() {
  const [signupStatus, setSignupStatus] = useState<"idle" | "success" | "loading">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignupStatus("loading");
    
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const role = (form.querySelector('select') as HTMLSelectElement).value;

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
    <section className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 items-center gap-[60px] px-[5%] pb-20 pt-[120px] lg:grid-cols-2">
      {/* Left — Copy */}
      <div>
        <div className="mb-7">
          <HeroMark size={68} />
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 px-3 py-1.5 font-[family-name:var(--font-dm-mono)] text-xs tracking-widest text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          Now in early access
        </div>

        <h1 className="mb-6 font-[family-name:var(--font-barlow)] text-[clamp(52px,6vw,84px)] font-800 leading-[0.95] tracking-tight">
          Your identity,
          <br />
          <span className="text-[var(--accent)]">fully yours.</span>
        </h1>

        <p className="mb-10 max-w-[460px] text-[17px] leading-relaxed text-[var(--muted)]">
          One link. Every social. Total control. MVX is the link-in-bio platform
          that refuses to look like everyone else&apos;s. Built for creators,
          gamers, brands, and anyone who takes their online presence seriously.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-block rounded-[10px] bg-[var(--accent)] px-8 py-3.5 text-[15px] font-600 text-[var(--bg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)]"
          >
            Create your page, it&apos;s free
          </Link>
          <a
            href="#pricing"
            className="inline-block rounded-[10px] border border-[var(--border2)] bg-transparent px-8 py-3.5 text-[15px] font-500 text-[var(--muted)] transition-all hover:border-white/25 hover:text-[var(--text)]"
          >
            See Pro features
          </a>
        </div>

        {/* Signup form */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-wrap gap-2"
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="min-w-[180px] flex-1 rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
          <select className="appearance-none rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238a8998%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat px-4 pr-8 py-3 text-sm text-[var(--muted)] outline-none transition-[border-color] focus:border-[var(--accent)]">
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
            className="whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-6 py-3 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
          >
            {signupStatus === "success" ? "You're in!" : signupStatus === "loading" ? "Joining..." : "Join early access"}
          </button>
        </form>
        <p className="mt-2.5 font-[family-name:var(--font-dm-mono)] text-xs tracking-wide text-[var(--muted)]">
          Free forever · No credit card needed · Join the waitlist
        </p>

        {/* Trust bar */}
        <div className="mt-9 flex items-center gap-4">
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
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[var(--bg)] text-[13px] font-600 text-white"
                style={{
                  background: avatar.bg,
                  marginLeft: i > 0 ? -8 : 0,
                  color: avatar.bg === "#4ecb8d" || avatar.bg === "#c9a96e" ? "#0c0c0e" : "#fff",
                }}
              >
                {avatar.letter}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-[var(--muted)]">
            <strong className="font-600 text-[var(--text)]">
              Join thousands of creators
            </strong>{" "}
            on the waitlist
          </p>
        </div>
      </div>

      {/* Right — Live Preview */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4">
        <ProfilePreview />
        <p className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--muted)]">
          live preview, click themes above
        </p>
      </div>
    </section>
  );
}
