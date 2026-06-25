"use client";

import NextLink from "next/link";
import type { Profile, Link, Theme } from "../../../prisma/generated/prisma/client";

type ProfileWithRelations = Profile & {
  links: Link[];
  theme: Theme | null;
  user: { name: string | null; image: string | null };
};

interface PublicProfileProps {
  profile: ProfileWithRelations;
}

// Only allow safe link schemes. A profile owner could otherwise store a
// `javascript:` URL that would execute in a visitor's browser on click.
const SAFE_PROTOCOLS = ["http:", "https:", "mailto:"];

function safeUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.includes(parsed.protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}

// Group links by groupId, preserving original order.
// Returns [{groupId: string | null, links: Link[]}]
function groupLinks(links: Link[]): { groupId: string | null; links: Link[] }[] {
  const groups: { groupId: string | null; links: Link[] }[] = [];
  for (const link of links) {
    const gid = link.groupId ?? null;
    const existing = groups.find((g) => g.groupId === gid);
    if (existing) {
      existing.links.push(link);
    } else {
      groups.push({ groupId: gid, links: [link] });
    }
  }
  return groups;
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

  const layoutType = profile.layoutType || "centered";
  const isGrid = layoutType === "grid";
  const isMinimal = layoutType === "minimal";

  function handleLinkClick(linkId: string) {
    // Track click
    fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, profileId: profile.id }),
    }).catch(() => {});
  }

  function renderLink(link: Link) {
    const href = safeUrl(link.url);
    if (!href) return null;

    const minimalStyle: React.CSSProperties = {
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${config.borderColor || "rgba(255,255,255,0.07)"}`,
      borderRadius: 0,
      color: config.textColor,
      justifyContent: "flex-start",
      paddingLeft: 0,
      paddingRight: 0,
    };

    const filledStyle: React.CSSProperties = {
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
    };

    return (
      <a
        key={link.id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleLinkClick(link.id)}
        className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-500 transition-all hover:brightness-110"
        style={isMinimal ? minimalStyle : filledStyle}
      >
        {link.icon && <span>{link.icon}</span>}
        {link.title}
      </a>
    );
  }

  const activeLinks = profile.links.filter((l) => l.isActive !== false);
  const grouped = groupLinks(activeLinks);

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        background: config.background,
        fontFamily: `var(--font-${config.fontFamily?.toLowerCase() || "inter"})`,
      }}
    >
      <div className={`mx-auto ${isGrid ? "max-w-[720px]" : "max-w-[480px]"}`}>
        {/* Header */}
        <div className={`mb-6 ${isGrid ? "text-left" : "text-center"}`}>
          {profile.avatarUrl ? (
            // User-supplied avatar from an arbitrary external host (R2 / custom
            // domain). next/image would require per-host remotePatterns config,
            // so a plain <img> is the correct tool here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className={`mb-4 h-20 w-20 rounded-full object-cover ${isGrid ? "" : "mx-auto"}`}
            />
          ) : (
            <div
              className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-700 ${isGrid ? "" : "mx-auto"}`}
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
              className={`mt-3 text-sm leading-relaxed ${isGrid ? "" : "mx-auto max-w-[360px]"}`}
              style={{ color: config.mutedColor }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links — layout branches here */}
        {isGrid ? (
          // Grid layout: 2-col grid per section
          <div>
            {grouped.map(({ groupId: gid, links: gLinks }) => (
              <div key={gid ?? "__default__"} className="mb-6">
                {gid && (
                  <p
                    className="mb-3 text-xs font-600 uppercase tracking-widest"
                    style={{ color: config.mutedColor }}
                  >
                    {gid}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {gLinks.map((link) => renderLink(link))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Centered / Minimal layout: single column, with section headers
          <div className="flex flex-col gap-0">
            {grouped.map(({ groupId: gid, links: gLinks }) => (
              <div key={gid ?? "__default__"} className="mb-4">
                {gid && !isMinimal && (
                  <p
                    className="mb-2 text-xs font-600 uppercase tracking-widest"
                    style={{ color: config.mutedColor }}
                  >
                    {gid}
                  </p>
                )}
                <div className={`flex flex-col ${isMinimal ? "gap-0" : "gap-3"}`}>
                  {gLinks.map((link) => renderLink(link))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <NextLink
            href="/"
            className="text-xs transition-opacity hover:opacity-100"
            style={{ color: config.mutedColor, opacity: 0.5 }}
          >
            Powered by MVX
          </NextLink>
        </div>
      </div>
    </div>
  );
}
