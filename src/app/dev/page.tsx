"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EGG_DEV, recordEgg } from "@/lib/eggs";

export default function DevPage() {
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    recordEgg(EGG_DEV);
  }, []);

  const claimBadge = useCallback(async () => {
    if (claimed || claiming) return;
    setClaiming(true);
    try {
      const res = await fetch("/api/badges/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ egg: "dev" }),
      });
      if (res.ok) setClaimed(true);
    } catch {
      // Ignore.
    } finally {
      setClaiming(false);
    }
  }, [claimed, claiming]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />

      <div className="relative z-10 max-w-md text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border2)] bg-[var(--bg3)] px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--muted)]">
            secret route
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-barlow)] text-[72px] font-800 leading-none text-[var(--accent)]">
          /\dev
        </h1>

        <p className="mt-4 text-lg text-[var(--text)]">
          You found a hidden page. Most visitors never see this.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Consider yourself curious.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          {!claimed ? (
            <button
              type="button"
              onClick={claimBadge}
              disabled={claiming}
              className="rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] hover:shadow-lg hover:shadow-[var(--accent)]/10 disabled:opacity-50"
            >
              {claiming ? "Claiming\u2026" : "Claim badge"}
            </button>
          ) : (
            <p className="rounded-xl border border-[var(--border2)] bg-[var(--bg3)] px-6 py-3 text-sm font-600 text-[var(--success)]">
              Badge granted!
            </p>
          )}

          <Link
            href="/"
            className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
