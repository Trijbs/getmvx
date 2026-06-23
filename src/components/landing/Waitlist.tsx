"use client";

import { useState } from "react";

export function Waitlist() {
  const [status, setStatus] = useState<"idle" | "success" | "loading">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

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
    <section className="border-y border-[var(--border)] bg-[linear-gradient(180deg,var(--bg2),var(--bg3))] py-25">
      <div className="mx-auto max-w-[600px] px-[5%] text-center">
        <span className="mb-4 block font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.1em] text-[var(--accent)]">
          // early access
        </span>
        <h2 className="mb-4 font-[family-name:var(--font-barlow)] text-[clamp(36px,4vw,54px)] font-800 leading-tight">
          Be first in line.
        </h2>
        <p className="mb-9 text-base leading-relaxed text-[var(--muted)]">
          Join the waitlist and get early access when we launch. No spam, no BS
          just a heads up when your page is ready.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-2">
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
            disabled={status === "loading"}
            className="whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-6 py-3 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
          >
            {status === "success" ? "You're in!" : status === "loading" ? "Joining..." : "Join the waitlist"}
          </button>
        </form>
        <p className="mt-2.5 font-[family-name:var(--font-dm-mono)] text-xs tracking-wide text-[var(--muted)]">
          Free forever · No credit card needed · Early adopter badge included
        </p>
      </div>
    </section>
  );
}
