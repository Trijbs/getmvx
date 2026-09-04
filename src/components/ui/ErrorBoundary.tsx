"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <h2 className="mb-2 text-xl font-semibold text-[var(--text)]">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-[var(--muted)]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
