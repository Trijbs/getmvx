"use client";

import NextLink from "next/link";
import { useMemo, useState } from "react";
import { SocialIcon } from "@/components/brand";
import { CopyShare } from "@/components/share/CopyShare";
import { renderBioMarkdown } from "@/lib/markdown";
import { sanitizeCustomCss } from "@/lib/sanitize";
import type { Profile, Link, Theme } from "../../../prisma/generated/prisma/client";

type ProfileWithRelations = Profile & {
  links: Link[];
  theme: Theme | null;
  user: { name: string | null; image: string | null; createdAt: Date | null };
};

interface PublicProfileProps {
  profile: ProfileWithRelations;
  /** Renders an isolated editor preview (no analytics side effects). */
  preview?: boolean;
  /** Optional raw profile URL used by the QR/share feature. */
  profileUrl?: string;
  /** Theme config override used by the editor live-iframe preview. */
  previewConfig?: Record<string, string>;
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

// Colored "status" pills rendered on link buttons (Free feature).
const LABEL_COLORS: Record<string, string> = {
  green: "#2ecc71",
  red: "#e74c3c",
  amber: "#f1c40f",
  blue: "#3498db",
  violet: "#9b59b6",
};

function labelColor(value: string | null | undefined): string {
  if (!value) return "#2ecc71";
  return LABEL_COLORS[value] ?? value ?? "#2ecc71";
}

// Rendered when a section/profile has no live links (plain render function,
// not a component, so it can be defined at module scope).
function renderEmptyLinks(config: Record<string, string>) {
  return (
    <div
      className="rounded-lg border border-dashed py-8 text-center text-xs"
      style={{ borderColor: config.borderColor, color: config.mutedColor }}
    >
      No links yet
    </div>
  );
}

export function PublicProfile({
  profile,
  preview = false,
  profileUrl,
  previewConfig,
}: PublicProfileProps) {
  // Dark/lite per-profile override (PRO). Light mode swaps to a light palette.
  const colorMode = (profile as Profile & { colorMode?: string }).colorMode ?? "dark";
  const isLight = colorMode === "light";

  const LIGHT_PALETTE: Record<string, string> = {
    background: "#f7f6fb",
    cardBg: "#ffffff",
    textColor: "#17161c",
    mutedColor: "#636172",
    accentColor: "#6d5ae0",
    borderColor: "rgba(0,0,0,0.08)",
  };

  const baseConfig: Record<string, string> =
    previewConfig || (profile.theme?.config as Record<string, string>) || {
      background: "#0c0c0e",
      cardBg: "#131316",
      textColor: "#f0eff4",
      mutedColor: "#8a8998",
      accentColor: "#9b7ef8",
      borderColor: "rgba(255,255,255,0.07)",
      buttonStyle: "filled",
      fontFamily: "Inter",
    };

  // In light mode force a light palette (theme accent preserved).
  const config: Record<string, string> = isLight
    ? { ...baseConfig, ...LIGHT_PALETTE, accentColor: baseConfig.accentColor || "#6d5ae0" }
    : baseConfig;

  const layoutType = profile.layoutType || "centered";
  const isGrid = layoutType === "grid";
  const isMinimal = layoutType === "minimal";

  // Profilepodiums — optional tabbed sections (PRO).
  const podiumMode = (profile as Profile & { podiumMode?: string }).podiumMode ?? "stack";
  const useTabs = podiumMode === "tabs";

  function handleLinkClick(linkId: string) {
    if (preview) return; // no analytics in the editor preview
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
        data-mvx-link
        data-mvx-link-index={flatIndex[link.id]}
        onClick={() => handleLinkClick(link.id)}
        className="flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-500 transition-all hover:brightness-110"
        style={isMinimal ? minimalStyle : filledStyle}
      >
        {link.icon && <SocialIcon name={link.icon} size={20} />}
        <span>{link.title}</span>
        {link.label && (
          <span
            data-mvx-label
            className="rounded-full px-2 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-700 uppercase tracking-wide"
            style={{
              background: `${labelColor(link.labelColor)}22`,
              color: labelColor(link.labelColor),
              border: `1px solid ${labelColor(link.labelColor)}55`,
            }}
          >
            {link.label}
          </span>
        )}
      </a>
    );
  }

  const activeLinks = profile.links.filter((l) => l.isActive !== false);
  const grouped = groupLinks(activeLinks);
  const flatIndex: Record<string, number> = {};
  activeLinks.forEach((l, i) => (flatIndex[l.id] = i));

  // Bio supports a safe markdown subset (see src/lib/markdown.ts).
  const bioNode = useMemo(
    () => (profile.bio ? renderBioMarkdown(profile.bio) : null),
    [profile.bio]
  );

  // Profilepodiums tab state (local; only meaningful when useTabs).
  const [activeTab, setActiveTab] = useState(
    grouped[0]?.groupId ?? "__default__"
  );
  const visibleGroups = useTabs
    ? grouped.filter((g) => (g.groupId ?? "__default__") === activeTab)
    : grouped;

  // Days since the account was created (Free "since" card). Computed once via
  // a lazy initializer so Date.now() isn't called during a regular render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [daysSince] = useState<number | null>(() => {
    const created = profile.user?.createdAt;
    if (!created) return null;
    return Math.max(
      0,
      Math.floor((Date.now() - new Date(created).getTime()) / 86_400_000)
    );
  });

  return (
    <div
      className={`min-h-screen px-4 py-12 ${isLight ? "mvx-light" : ""}`}
      data-mvx-profile
      data-mvx-layout={layoutType}
      data-mvx-color-mode={colorMode}
      style={{
        background: config.background,
        fontFamily: `var(--font-${config.fontFamily?.toLowerCase() || "inter"})`,
      }}
    >
      {profile.customCss && (
        <style
          // Sanitized server-side at write; re-sanitize on render defensively.
          dangerouslySetInnerHTML={{ __html: sanitizeCustomCss(profile.customCss) }}
        />
      )}

      <div className={`mx-auto ${isGrid ? "max-w-[720px]" : "max-w-[480px]"}`}>
        {/* Header */}
        <div data-mvx-header className={`mb-6 ${isGrid ? "text-left" : "text-center"}`}>
          {profile.avatarUrl ? (
            // User-supplied avatar from an arbitrary external host (R2 / custom
            // domain). next/image would require per-host remotePatterns config,
            // so a plain <img> is the correct tool here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              data-mvx-avatar
              className={`mb-4 h-20 w-20 rounded-full object-cover ${isGrid ? "" : "mx-auto"}`}
            />
          ) : (
            <div
              data-mvx-avatar
              className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-700 ${isGrid ? "" : "mx-auto"}`}
              style={{ background: config.accentColor, color: config.background }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}

          <h1
            data-mvx-name
            className="font-[family-name:var(--font-barlow)] text-2xl font-700"
            style={{ color: config.textColor }}
          >
            {profile.user.name || profile.username}
          </h1>
          <p
            data-mvx-handle
            className="font-[family-name:var(--font-dm-mono)] text-sm"
            style={{ color: config.mutedColor }}
          >
            @{profile.username}
          </p>

          {bioNode && (
            <div
              data-mvx-bio
              className={`mvx-bio mt-3 text-sm leading-relaxed [&_a]:underline [&_a]:underline-offset-2 ${isGrid ? "" : "mx-auto max-w-[360px]"}`}
              style={{ color: config.mutedColor }}
            >
              {bioNode}
            </div>
          )}
        </div>

        {/* Profilepodiums — tab bar (PRO) */}
        {useTabs && grouped.length > 1 && (
          <div data-mvx-tabs className="mb-5 flex gap-1.5 overflow-x-auto">
            {grouped.map((g) => {
              const gid = g.groupId ?? "__default__";
              const active = gid === activeTab;
              return (
                <button
                  key={gid}
                  type="button"
                  onClick={() => setActiveTab(gid)}
                  className="shrink-0 rounded-full px-4 py-1.5 text-xs font-600 transition-all"
                  style={{
                    background: active ? config.accentColor : "transparent",
                    color: active ? config.background : config.mutedColor,
                    border: `1px solid ${active ? config.accentColor : config.borderColor}`,
                  }}
                >
                  {g.groupId ?? "Links"}
                </button>
              );
            })}
          </div>
        )}

        {/* Links — layout branches here */}
        <div data-mvx-links>
          {isGrid ? (
            // Grid layout: 2-col grid per section
            <div>
              {visibleGroups.length === 0 && renderEmptyLinks(config)}
              {visibleGroups.map(({ groupId: gid, links: gLinks }) => (
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
              {visibleGroups.length === 0 && renderEmptyLinks(config)}
              {visibleGroups.map(({ groupId: gid, links: gLinks }) => (
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
        </div>

        {/* Footer */}
        <div data-mvx-footer className="mt-10 text-center">
          {!preview && (
            <>
              <div
                data-mvx-stats
                className="mb-3 font-[family-name:var(--font-dm-mono)] text-[11px]"
                style={{ color: config.mutedColor, opacity: 0.7 }}
              >
                {daysSince !== null && `${daysSince === 0 ? "just started" : `${daysSince}d on mvx`}`}
                {daysSince !== null && profile.viewCount > 0 && " · "}
                {profile.viewCount > 0 && `${profile.viewCount.toLocaleString()} views`}
              </div>
              <div className="mb-4 flex items-center justify-center">
                <CopyShare url={profileUrl ?? `/${profile.username}`} />
              </div>
            </>
          )}
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
