"use client";

import { useState } from "react";

type Theme = "dark" | "minimal" | "gold";

const themes: Record<Theme, { avatar: string; avatarGradient: string }> = {
  dark: {
    avatar: "🎮",
    avatarGradient: "linear-gradient(135deg,#9b7ef8,#5b9cf6)",
  },
  minimal: {
    avatar: "🌿",
    avatarGradient: "linear-gradient(135deg,#e0e0e0,#bdbdbd)",
  },
  gold: {
    avatar: "🖤",
    avatarGradient: "linear-gradient(135deg,#c9a96e,#e8c98a)",
  },
};

export function ProfilePreview() {
  const [theme, setTheme] = useState<Theme>("dark");
  const t = themes[theme];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Theme tabs */}
      <div className="flex gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-1">
        {(["dark", "minimal", "gold"] as Theme[]).map((th) => (
          <button
            key={th}
            onClick={() => setTheme(th)}
            className={`rounded-[7px] px-3.5 py-1.5 text-xs font-500 transition-all ${
              theme === th
                ? "bg-[var(--bg4)] text-[var(--text)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {th.charAt(0).toUpperCase() + th.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile card */}
      <div
        className="w-[320px] overflow-hidden rounded-[20px] border border-[var(--border2)] shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all duration-400"
        style={{
          background: theme === "minimal" ? "#fff" : theme === "gold" ? "#0e0b06" : "#111113",
        }}
      >
        {/* Banner */}
        <div
          className="h-[90px]"
          style={{
            background:
              theme === "minimal"
                ? "#f4f4f4"
                : theme === "gold"
                  ? "linear-gradient(135deg,#1a1200,#2d2000,#1a1200)"
                  : "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
          }}
        />

        {/* Body */}
        <div className="px-5 pb-6 text-center">
          {/* Avatar */}
          <div className="relative z-10 -mt-8 mb-3 flex justify-center">
            <div
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full p-[3px]"
              style={{
                background: theme === "minimal" ? "#fff" : theme === "gold" ? "#0e0b06" : "#111113",
              }}
            >
              <div
                className="flex h-full w-full items-center justify-center rounded-full text-2xl"
                style={{ background: t.avatarGradient }}
              >
                {t.avatar}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-2.5 flex justify-center gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-600 tracking-wider"
              style={{
                background: theme === "minimal" ? "#f0f0f0" : theme === "gold" ? "rgba(201,169,110,0.15)" : "rgba(155,126,248,0.15)",
                color: theme === "minimal" ? "#777" : theme === "gold" ? "#c9a96e" : "#9b7ef8",
              }}
            >
              ✦ PRO
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-600 tracking-wider"
              style={{
                background: theme === "minimal" ? "#f0f0f0" : theme === "gold" ? "rgba(201,169,110,0.15)" : "rgba(155,126,248,0.15)",
                color: theme === "minimal" ? "#777" : theme === "gold" ? "#c9a96e" : "#9b7ef8",
              }}
            >
              VERIFIED
            </span>
          </div>

          {/* Name & handle */}
          <div
            className="text-[17px] font-700"
            style={{ color: theme === "minimal" ? "#111" : theme === "gold" ? "#f0e8d0" : "#f0eff4" }}
          >
            mvx.studio
          </div>
          <div
            className="mb-2.5 font-[family-name:var(--font-dm-mono)] text-xs"
            style={{ color: theme === "minimal" ? "#aaa" : theme === "gold" ? "#5a4a2a" : "#666" }}
          >
            @mvdhs.x
          </div>

          {/* Bio */}
          <div
            className="mb-3.5 px-1 text-xs leading-relaxed"
            style={{ color: theme === "minimal" ? "#555" : theme === "gold" ? "#7a6a4a" : "#888" }}
          >
            designer · dev · creator — building things that look good and feel
            better 🖤
          </div>

          {/* Socials */}
          <div className="mb-4 flex justify-center gap-2">
            {["𝕏", "▶", "📸", "💬", "🎵"].map((icon) => (
              <span
                key={icon}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[13px]"
                style={{
                  background: theme === "minimal" ? "#f0f0f0" : theme === "gold" ? "#1a1408" : "#1e1e24",
                  color: theme === "minimal" ? "#888" : theme === "gold" ? "#7a6a4a" : "#aaa",
                }}
              >
                {icon}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            {[
              { icon: "🔗", label: "Portfolio" },
              { icon: "🛒", label: "Shop / Drops" },
              { icon: "📡", label: "Discord Server" },
              { icon: "☁️", label: "File Vault" },
            ].map((link) => (
              <div
                key={link.label}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-[9px] py-2.5 text-[13px] font-500 transition-all hover:brightness-110"
                style={{
                  background: theme === "minimal" ? "#f5f5f5" : theme === "gold" ? "#1a1408" : "#1e1e24",
                  border: `1px solid ${theme === "minimal" ? "#eee" : theme === "gold" ? "rgba(201,169,110,0.2)" : "rgba(255,255,255,0.08)"}`,
                  color: theme === "minimal" ? "#222" : theme === "gold" ? "#c9a96e" : "#e0e0f0",
                }}
              >
                {link.icon} {link.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
