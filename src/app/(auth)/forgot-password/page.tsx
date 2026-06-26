"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        setError("Too many requests. Please try again later.");
        setStatus("idle");
        return;
      }

      // Always show "sent" regardless of whether the email exists.
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="mb-10 block text-center font-[family-name:var(--font-barlow)] text-3xl font-800 text-[var(--text)]"
        >
          mv<span className="text-[var(--accent)]">x</span>
        </Link>

        <h1 className="mb-2 text-center font-[family-name:var(--font-barlow)] text-[28px] font-700">
          Forgot password
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--muted)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {status === "sent" ? (
          <div className="rounded-[10px] border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-5 py-4 text-center text-sm text-[var(--text)]">
            <p className="font-500">Check your inbox</p>
            <p className="mt-1 text-[var(--muted)]">
              If <span className="text-[var(--text)]">{email}</span> is
              registered, a reset link is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg border border-[var(--red)]/20 bg-[var(--red)]/10 px-4 py-3 text-sm text-[var(--red)]">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-[10px] bg-[var(--accent)] py-3 text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Remember it?{" "}
          <Link href="/login" className="font-500 text-[var(--accent)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
