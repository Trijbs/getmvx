"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      setError("Username can only contain lowercase letters, numbers, hyphens, and underscores");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-2 text-center font-[family-name:var(--font-barlow)] text-[28px] font-700">
          Set up your page
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--muted)]">
          Choose your username and tell us about yourself
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-lg border border-[var(--red)]/20 bg-[var(--red)]/10 px-4 py-3 text-sm text-[var(--red)]">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">
              Username
            </label>
            <div className="flex items-center overflow-hidden rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] transition-[border-color] focus-within:border-[var(--accent)]">
              <span className="border-r border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]">
                getmvx.cc/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                minLength={3}
                maxLength={30}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                placeholder="yourname"
              />
            </div>
            <p className="mt-1.5 text-xs text-[var(--muted)]">
              Lowercase letters, numbers, hyphens, and underscores only
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-500 text-[var(--text)]">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full resize-none rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder="Tell the world about yourself..."
            />
            <p className="mt-1.5 text-xs text-[var(--muted)]">
              {bio.length}/160 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[10px] bg-[var(--accent)] py-3 text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
