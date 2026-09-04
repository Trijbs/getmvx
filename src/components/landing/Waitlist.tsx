"use client";

import { useState } from "react";
import { BrandSymbol } from "@/components/brand";
import { Parallax } from "@/components/motion/Parallax";

export function Waitlist() {
  const [status, setStatus] = useState<"idle" | "success" | "loading">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

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
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }

  return (
    <section id="early-access" className="relative overflow-hidden border-t border-[var(--border)] px-[5%] py-25">
      <Parallax speed={0.15} className="pointer-events-none absolute bottom-[-20%] left-[-6%] text-[var(--accent)] opacity-[0.14]" ariaHidden>
        <BrandSymbol name="energy-particle" size={380} />
      </Parallax>

      <div className="relative mx-auto max-w-[640px] text-center">
        <span className="mb-5 block font-mono text-[11px] tracking-[0.28em] text-[var(--accent)]">
          {"//"} 07 — EARLY ACCESS
        </span>
        <h2 className="font-display text-[clamp(42px,6.5vw,88px)] font-[800] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--text)]">
          Be first
          <br />
          <span className="text-[var(--accent)]">in line.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[440px] text-[15px] leading-relaxed text-[var(--muted)]">
          Join the waitlist and get early access when we launch. No spam, no BS
          — just a heads up when your page is ready.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-wrap justify-center gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            required
            aria-label="Email address"
            className="min-w-[180px] flex-1 rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
          <label htmlFor="waitlist-role" className="sr-only">
            I am a...
          </label>
          <select
            id="waitlist-role"
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
            disabled={status === "loading"}
            className="whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-6 py-3 text-sm font-[600] text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
          >
            {status === "success"
              ? "You're in!"
              : status === "loading"
                ? "Joining..."
                : "Join the waitlist"}
          </button>
        </form>
        <p className="mt-2.5 font-mono text-xs tracking-wide text-[var(--muted)]">
          Free forever · No credit card needed · Early adopter badge included
        </p>
      </div>
    </section>
  );
}