"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!token || !email) setInvalid(true);
  }, [token, email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }

      setStatus("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (invalid) {
    return (
      <div className="rounded-[10px] border border-[var(--red)]/20 bg-[var(--red)]/10 px-5 py-4 text-center text-sm">
        <p className="font-500 text-[var(--text)]">Invalid reset link</p>
        <p className="mt-1 text-[var(--muted)]">
          This link is missing required parameters.
        </p>
        <Link
          href="/forgot-password"
          className="mt-3 inline-block font-500 text-[var(--accent)] hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="rounded-[10px] border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-5 py-4 text-center text-sm text-[var(--text)]">
        <p className="font-500">Password updated</p>
        <p className="mt-1 text-[var(--muted)]">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-lg border border-[var(--red)]/20 bg-[var(--red)]/10 px-4 py-3 text-sm text-[var(--red)]">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">
          New password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          placeholder="At least 8 characters"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">
          Confirm password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-[10px] bg-[var(--accent)] py-3 text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
      >
        {status === "loading" ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          Set new password
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--muted)]">
          Choose a strong password for your account.
        </p>

        <Suspense fallback={<div className="text-center text-sm text-[var(--muted)]">Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          <Link href="/login" className="font-500 text-[var(--accent)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
