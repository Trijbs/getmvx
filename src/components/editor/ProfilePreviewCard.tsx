"use client";

import type { Link, Theme } from "../../../prisma/generated/prisma/client";

interface ProfilePreviewCardProps {
  username: string;
  bio: string;
  links: Link[];
  themeId: string;
  themes: Theme[];
}

export function ProfilePreviewCard({
  username,
  bio,
  links,
  themeId,
  themes,
}: ProfilePreviewCardProps) {
  const theme = themes.find((t) => t.id === themeId);
  const config = (theme?.config as Record<string, string>) || {
    background: "#0c0c0e",
    cardBg: "#131316",
    textColor: "#f0eff4",
    mutedColor: "#8a8998",
    accentColor: "#9b7ef8",
    borderColor: "rgba(255,255,255,0.07)",
    buttonStyle: "filled",
  };

  const activeLinks = links.filter((l) => l.isActive);

  return (
    <div
      className="w-[320px] overflow-hidden rounded-[20px] border shadow-lg"
      style={{
        background: config.background,
        borderColor: config.borderColor,
      }}
    >
      {/* Banner */}
      <div
        className="h-16"
        style={{
          background: `linear-gradient(135deg, ${config.accentColor}33, ${config.accentColor}11)`,
        }}
      />

      {/* Body */}
      <div className="px-5 pb-5 text-center">
        {/* Avatar placeholder */}
        <div className="-mt-6 mb-3 flex justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl"
            style={{ background: config.accentColor }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Username */}
        <div
          className="font-[family-name:var(--font-barlow)] text-base font-700"
          style={{ color: config.textColor }}
        >
          {username}
        </div>
        <div
          className="mb-2 font-[family-name:var(--font-dm-mono)] text-[11px]"
          style={{ color: config.mutedColor }}
        >
          @{username}
        </div>

        {/* Bio */}
        {bio && (
          <div
            className="mb-3 px-2 text-xs leading-relaxed"
            style={{ color: config.mutedColor }}
          >
            {bio}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col gap-2">
          {activeLinks.slice(0, 4).map((link) => (
            <div
              key={link.id}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-xs font-500 transition-all"
              style={{
                background: config.buttonStyle === "outlined" ? "transparent" : `${config.accentColor}15`,
                border: `1px solid ${config.accentColor}30`,
                color: config.accentColor,
              }}
            >
              {link.icon && <span>{link.icon}</span>}
              {link.title}
            </div>
          ))}
          {activeLinks.length > 4 && (
            <div
              className="text-[10px]"
              style={{ color: config.mutedColor }}
            >
              +{activeLinks.length - 4} more
            </div>
          )}
          {activeLinks.length === 0 && (
            <div
              className="rounded-lg border border-dashed py-3 text-xs"
              style={{
                borderColor: config.borderColor,
                color: config.mutedColor,
              }}
            >
              No links yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
