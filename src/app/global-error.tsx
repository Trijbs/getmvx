"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div>
          <p style={{ fontSize: "3rem", margin: "0 0 1rem" }}>💥</p>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "#888", margin: "0 0 2rem", fontSize: "0.9rem" }}>
            We&apos;ve been notified and will look into it.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 1.25rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                background: "transparent",
                color: "#888",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "0.6rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
