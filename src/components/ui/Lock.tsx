"use client";

import { useState, type ReactNode } from "react";

interface LockProps {
  locked: boolean;
  /** Label shown on the badge, e.g. "PRO". */
  feature?: string;
  /** Called when a locked user tries to activate a Pro action. */
  onTry?: () => void;
  /**
   * When `preview` is true the wrapped content is rendered dimmed but fully
   * visible (the free-user conversion mechanic: they see the feature working)
   * and clicks bubble to `onTry`. When false, action calls should be gated by
   * the parent via `locked`.
   */
  preview?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a Pro-gated control. Free users can *see* the feature (preview mode,
 * dimmed) but the meaningful action is blocked and routed to `onTry` (an
 * upsell). Pro users get the full click-through.
 */
export function Lock({ locked, filter = "blur(1px)", feature = "PRO", onTry, preview = true, children, className }: LockProps & { filter?: string }) {
  const [hit, setHit] = useState(false);

  if (!locked) return <>{children}</>;

  function handleActivate(e?: React.MouseEvent) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setHit(true);
    onTry?.();
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        aria-hidden={preview}
        onClick={preview ? handleActivate : undefined}
        className={preview ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}
        style={preview ? { filter } : undefined}
      >
        {children}
      </div>
      {/* Locked overlay / upsell */}
      {hit ? null : (
        <button
          type="button"
          onClick={handleActivate}
          aria-label={`Unlock ${feature} — upgrade to Pro`}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-[10px] bg-[var(--bg)]/55 font-[family-name:var(--font-dm-mono)] text-xs font-600 tracking-wide text-[var(--accent)] backdrop-blur-[1px]"
        >
          🔒 {feature}
        </button>
      )}
    </div>
  );
}
