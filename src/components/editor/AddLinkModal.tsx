"use client";

import { useState } from "react";

const socialIcons: Record<string, string> = {
  "🔗": "Link",
  "𝕏": "Twitter/X",
  "▶": "YouTube",
  "📸": "Instagram",
  "💬": "Discord",
  "🎵": "TikTok",
  "🎮": "Twitch",
  "🎧": "Spotify",
  "🐙": "GitHub",
  "💼": "LinkedIn",
  "🌐": "Website",
  "📧": "Email",
  "📝": "Blog",
  "🛒": "Shop",
  "💡": "Portfolio",
};

interface AddLinkModalProps {
  onAdd: (data: { title: string; url: string; icon?: string }) => void;
  onClose: () => void;
}

export function AddLinkModal({ onAdd, onClose }: AddLinkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("🔗");
  const [showIcons, setShowIcons] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !url) return;
    onAdd({ title, url, icon });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-[16px] border border-[var(--border2)] bg-[var(--bg2)] p-6">
        <h2 className="mb-4 font-[family-name:var(--font-barlow)] text-lg font-700">
          Add link
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Icon picker */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-500">Icon</label>
            <button
              type="button"
              onClick={() => setShowIcons(!showIcons)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-2.5 text-sm"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[var(--muted)]">
                {socialIcons[icon] || "Choose"}
              </span>
            </button>
            {showIcons && (
              <div className="mt-2 grid grid-cols-5 gap-2 rounded-lg border border-[var(--border2)] bg-[var(--bg3)] p-3">
                {Object.entries(socialIcons).map(([emoji, name]) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setIcon(emoji);
                      setShowIcons(false);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-all ${
                      icon === emoji
                        ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-[var(--bg4)]"
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="truncate w-full text-center">{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-500">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder="My Portfolio"
            />
          </div>

          {/* URL */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-500">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder="https://example.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[var(--border2)] px-4 py-2.5 text-sm font-500 text-[var(--muted)] transition-all hover:bg-[var(--bg3)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
            >
              Add link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
