"use client";

import type { Profile, Link, Theme } from "../../../prisma/generated/prisma/client";

type ProfileWithRelations = Profile & {
  links: Link[];
  theme: Theme | null;
  user: { name: string | null; image: string | null };
};

interface PublicProfileProps {
  profile: ProfileWithRelations;
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const config = (profile.theme?.config as Record<string, string>) || {
    background: "#0c0c0e",
    cardBg: "#131316",
    textColor: "#f0eff4",
    mutedColor: "#8a8998",
    accentColor: "#9b7ef8",
    borderColor: "rgba(255,255,255,0.07)",
    buttonStyle: "filled",
    fontFamily: "Inter",
  };

  async function handleLinkClick(linkId: string) {
    // Track click
    fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, profileId: profile.id }),
    }).catch(() => {});
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        background: config.background,
        fontFamily: `var(--font-${config.fontFamily?.toLowerCase() || "inter"})`,
      }}
    >
      <div className="mx-auto max-w-[480px]">
        {/* Header */}
        <div className="mb-6 text-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-700"
              style={{ background: config.accentColor, color: config.background }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}

          <h1
            className="font-[family-name:var(--font-barlow)] text-2xl font-700"
            style={{ color: config.textColor }}
          >
            {profile.user.name || profile.username}
          </h1>
          <p
            className="font-[family-name:var(--font-dm-mono)] text-sm"
            style={{ color: config.mutedColor }}
          >
            @{profile.username}
          </p>

          {profile.bio && (
            <p
              className="mx-auto mt-3 max-w-[360px] text-sm leading-relaxed"
              style={{ color: config.mutedColor }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-500 transition-all hover:brightness-110"
              style={{
                background:
                  config.buttonStyle === "outlined" || config.buttonStyle === "neon"
                    ? "transparent"
                    : `${config.accentColor}15`,
                border: `1px solid ${config.accentColor}40`,
                color: config.accentColor,
                boxShadow:
                  config.buttonStyle === "neon"
                    ? `0 0 15px ${config.accentColor}30`
                    : "none",
              }}
            >
              {link.icon && <span>{link.icon}</span>}
              {link.title}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <a
            href="/"
            className="text-xs transition-opacity hover:opacity-100"
            style={{ color: config.mutedColor, opacity: 0.5 }}
          >
            Powered by MVX
          </a>
        </div>
      </div>
    </div>
  );
}
