import type { ReactNode } from "react";

/**
 * Custom branded social-platform vector icons.
 *
 * Each entry renders a 24x24 viewBox using `currentColor` so the icon
 * inherits the surrounding text/accent color on any profile theme.
 * The visual language (soft corners, ~1.5px strokes, clean fills) is kept
 * consistent with the brand symbols in `Symbol.tsx` / `Logo.tsx`.
 *
 * Entries are functions so the caller can pass arbitrary SVG props
 * (size, className, aria-hidden) while keeping definitions pure data.
 */
export interface SocialIconDefinition {
  label: string;
  render: (svgProps: Record<string, unknown>) => ReactNode;
}

type SVGDoc = Record<string, unknown>;

const svg = (children: ReactNode, extra: SVGDoc = {}): ReactNode => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...extra}
  >
    {children}
  </svg>
);

const stroke = (extra: SVGDoc = {}) => ({
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  ...extra,
});

export const SOCIAL_ICONS: Record<string, SocialIconDefinition> = {
  twitch: {
    label: "Twitch",
    render: (p) =>
      svg(
        <path
          d="M4 3h16v11l-4 4h-4l-3 3v-3H4V3Zm3 4v5m5-5v5"
          {...stroke({ fill: "currentColor", strokeWidth: 0 })}
          {...p}
        />,
      ),
  },
  discord: {
    label: "Discord",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <path d="M7 5.5a12 12 0 0 1 10 0" />
          <path d="M8.5 5.8c1.8 1.9 2.2 3.9 8 3.5-1 1.3-2 2.5-3.5 3.5l-.5-1.5" />
          <path d="M15.5 5.8c-1.8 1.9-2.2 3.9-8 3.5 1 1.3 2 2.5 3.5 3.5l.5-1.5" />
          <circle cx="8.8" cy="12.5" r="0.6" fill="currentColor" strokeWidth={0} />
          <circle cx="15.2" cy="12.5" r="0.6" fill="currentColor" strokeWidth={0} />
          <path d="M1.5 19.5 3.5 21" />
        </g>,
      ),
  },
  youtube: {
    label: "YouTube",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
          <path d="M10 9.5v5l4-2.5-4-2.5Z" fill="currentColor" strokeWidth={0} />
        </g>,
      ),
  },
  instagram: {
    label: "Instagram",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="0.9" fill="currentColor" strokeWidth={0} />
        </g>,
      ),
  },
  tiktok: {
    label: "TikTok",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <path d="M9 8.5a9 9 0 0 0 6 7.5V5.5" />
          <path d="M9 8.5a9 9 0 0 1 6 7.5V5.5" />
          <circle cx="9" cy="15" r="2.5" />
        </g>,
      ),
  },
  x: {
    label: "X (Twitter)",
    render: (p) =>
      svg(
        <path
          d="M4 4l16 16M20 4L4 20"
          {...stroke({ strokeWidth: 2 })}
          {...p}
        />,
      ),
  },
  twitter: {
    label: "X (Twitter)",
    render: (p) =>
      svg(
        <path
          d="M4 4l16 16M20 4L4 20"
          {...stroke({ strokeWidth: 2 })}
          {...p}
        />,
      ),
  },
  spotify: {
    label: "Spotify",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 9.5c4-1 8.5.5 9 1.5M7.5 12.5c3-.8 6.5.2 7 1M7.5 15.5c2.2-.6 4.5-.2 5 .4" />
        </g>,
      ),
  },
  github: {
    label: "GitHub",
    render: (p) =>
      svg(
        <path
          d="M8.5 20.5c-3 .9-3-1.4-4.5-1.8M12 21v-3.3c0-.9.1-1.4-.3-1.9 2.2-.3 4.5-1.1 4.5-4.9a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.8-.3-2.6 1a9 9 0 0 0-4.7 0c-1.8-1.3-2.6-1-2.6-1a3.6 3.6 0 0 0-.1 2.7 3.9 3.9 0 0 0-1 2.7c0 3.8 2.3 4.6 4.5 4.9-.4.4-.6 1-.4 1.7V21"
          {...stroke()}
          {...p}
        />,
      ),
  },
  linkedin: {
    label: "LinkedIn",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
          <rect x="7.5" y="10" width="2" height="6.5" />
          <circle cx="8.5" cy="7.3" r="1" fill="currentColor" strokeWidth={0} />
          <path d="M11.5 11v5.5m0-2.5a2.8 2.8 0 0 1 5.5.2V16.5" />
        </g>,
      ),
  },
  steam: {
    label: "Steam",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <path d="M3 13.5a8 8 0 0 1 9.2-9.2 8 8 0 0 1 5.6 4.6" />
          <circle cx="8.5" cy="15.5" r="2.5" />
          <path d="M6.5 14 3 12.8" />
          <circle cx="12.7" cy="6.2" r="1.7" />
          <path d="M13.5 12.8 16.8 7" />
          <circle cx="16.8" cy="15.5" r="4.5" />
        </g>,
      ),
  },
  email: {
    label: "Email",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 8 8 5.5L20 8" />
        </g>,
      ),
  },
  website: {
    label: "Website",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
        </g>,
      ),
  },
  shop: {
    label: "Shop",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <path d="M4 9h16l-1 10.5a2 2 0 0 1-2 1.5H7a2 2 0 0 1-2-1.5L4 9Z" />
          <path d="M8.5 12V7.5a3.5 3.5 0 0 1 7 0V12" />
        </g>,
      ),
  },
  blog: {
    label: "Blog",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <path d="M4 19.5v-13A2.5 2.5 0 0 1 6.5 4H20v15H6.5A2.5 2.5 0 0 0 4 19.5Z" />
          <path d="M8 8h8M8 11.5h8" />
        </g>,
      ),
  },
  portfolio: {
    label: "Portfolio",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <rect x="3" y="7" width="18" height="12" rx="2.5" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <circle cx="12" cy="13" r="2.5" />
        </g>,
      ),
  },
  link: {
    label: "Link",
    render: (p) =>
      svg(
        <g {...stroke()}>
          <path d="M10 14a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.3-6.4l-1.6 1.6" />
          <path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.3 6.4l1.6-1.6" />
        </g>,
      ),
  },
};

export const SOCIAL_ICON_KEYS = Object.keys(SOCIAL_ICONS);

/**
 * Map for legacy stored emoji icon values -> platform key.
 * Used by the data migration and as a render fallback so profiles that
 * predate the vector icons still resolve to the branded icon.
 */
export const EMOJI_TO_KEY: Record<string, string> = {
  "🔗": "link",
  "𝕏": "x",
  "▶": "youtube",
  "📸": "instagram",
  "💬": "discord",
  "🎵": "tiktok",
  "🎮": "twitch",
  "🎧": "spotify",
  "🐙": "github",
  "💼": "linkedin",
  "🌐": "website",
  "📧": "email",
  "📝": "blog",
  "🛒": "shop",
  "💡": "portfolio",
};
