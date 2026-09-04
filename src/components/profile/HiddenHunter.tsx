"use client";

import { useCallback, useState } from "react";
import { getFoundEggs, allEggsFound } from "@/lib/eggs";

const BADGE_POST_KEY = "mvx-hunter-badge-claimed";

function readClaimedFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(BADGE_POST_KEY) === "1";
  } catch {
    return false;
  }
}

export function HiddenHunter() {
  const [found] = useState<string[]>(() => getFoundEggs());
  const [claimed, setClaimed] = useState<boolean>(() => readClaimedFlag());
  const [confirming, setConfirming] = useState(false);

  const claimBadge = useCallback(async () => {
    if (claimed || confirming) return;
    setConfirming(true);
    try {
      const res = await fetch("/api/badges/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ egg: "hunter" }),
      });
      if (res.ok) {
        setClaimed(true);
        try {
          localStorage.setItem(BADGE_POST_KEY, "1");
        } catch {
          // Ignore.
        }
      }
    } catch {
      // Network error — user can retry.
    } finally {
      setConfirming(false);
    }
  }, [claimed, confirming]);

  if (!allEggsFound(found)) return null;

  return (
    <div className="mt-4 rounded-xl border border-[var(--border2)] bg-[var(--bg3)] p-4 text-center">
      <p className="font-[family-name:var(--font-barlow)] text-sm font-700 text-[var(--accent)]">
        All eggs found
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        You discovered every hidden easter egg.
      </p>
      {!claimed && (
        <button
          type="button"
          onClick={claimBadge}
          disabled={confirming}
          className="mt-3 rounded-lg bg-[var(--accent)] px-5 py-2 text-xs font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
        >
          {confirming ? "Claiming\u2026" : "Claim badge"}
        </button>
      )}
      {claimed && (
        <p className="mt-3 text-xs font-600 text-[var(--success)]">
          Badge granted!
        </p>
      )}
    </div>
  );
}
