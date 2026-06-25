"use client";

import { useState } from "react";
import type { Profile } from "../../../prisma/generated/prisma/client";
import { UpgradeButton } from "@/components/pro/UpgradeButton";

interface SettingsClientProps {
  profile: Profile;
  user: { id: string; name?: string | null; email?: string | null };
  isPro: boolean;
}

export function SettingsClient({ profile, user, isPro }: SettingsClientProps) {
  // Username is fixed after setup, so it's read straight from the profile.
  const username = profile.username;
  const [bio, setBio] = useState(profile.bio || "");
  const [isPublic, setIsPublic] = useState(profile.isPublic);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, isPublic }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("Settings saved!");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to save");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-barlow)] text-2xl font-700">
        Settings
      </h1>

      {/* Profile settings */}
      <section className="mb-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <h2 className="mb-4 text-sm font-600">Profile</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-500">Username</label>
          <div className="flex items-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5">
            <span className="text-sm text-[var(--muted)]">getmvx.cc/</span>
            <span className="text-sm font-500">{username}</span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Username cannot be changed after setup
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-500">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            placeholder="Tell the world about yourself..."
          />
          <p className="mt-1 text-right text-xs text-[var(--muted)]">
            {bio.length}/160
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-500">Public profile</p>
            <p className="text-xs text-[var(--muted)]">
              When disabled, only you can see your page
            </p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              isPublic ? "bg-[var(--accent)]" : "bg-[var(--bg4)]"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                isPublic ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Account info */}
      <section className="mb-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <h2 className="mb-4 text-sm font-600">Account</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Email</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Name</span>
            <span className="text-sm">{user.name || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Profile URL</span>
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              getmvx.cc/u/{profile.username}
            </a>
          </div>
        </div>
      </section>

      {/* Pro plan */}
      <section className="mb-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <h2 className="mb-4 text-sm font-600">Plan</h2>
        {isPro ? (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-700 text-[var(--bg)]">
              PRO
            </span>
            <p className="text-sm text-[var(--muted)]">
              You&apos;re on the Pro plan. Thanks for supporting mvx!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-500">mvx Pro</p>
              <p className="text-xs text-[var(--muted)]">
                Custom themes, CSS, analytics, widgets &amp; more — €3.99/mo
              </p>
            </div>
            {user.id && user.email && (
              <UpgradeButton userId={user.id} email={user.email ?? ""} />
            )}
          </div>
        )}
      </section>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {message && (
          <span className="text-sm text-[var(--green)]">{message}</span>
        )}
      </div>
    </div>
  );
}
