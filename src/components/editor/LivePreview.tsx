"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { PublicProfile } from "@/components/profile/PublicProfile";
import type { Link, Theme } from "../../../prisma/generated/prisma/client";

interface LivePreviewProps {
  username: string;
  bio: string;
  links: Link[];
  themeId: string;
  themes: Theme[];
  layoutType: string;
  customCss: string;
  colorMode?: string;
  podiumMode?: string;
}

const DARK_CONFIG = {
  background: "#0c0c0e",
  cardBg: "#131316",
  textColor: "#f0eff4",
  mutedColor: "#8a8998",
  accentColor: "#9b7ef8",
  borderColor: "rgba(255,255,255,0.07)",
  buttonStyle: "filled",
};

const LIGHT_CONFIG = {
  background: "#f7f6fb",
  cardBg: "#ffffff",
  textColor: "#17161c",
  mutedColor: "#6c6a7a",
  accentColor: "#6d5ae0",
  borderColor: "rgba(0,0,0,0.08)",
  buttonStyle: "filled",
};

// Build a profile-shaped object the PublicProfile component can consume,
// merging live editor state (text, custom CSS, layout, links, pro toggles).
export function LivePreview({
  username,
  bio,
  links,
  themeId,
  themes,
  layoutType,
  customCss,
  colorMode = "dark",
  podiumMode = "stack",
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rootRef = useRef<Root | null>(null);

  const theme = themes.find((t) => t.id === themeId);
  const baseConfig = (theme?.config as Record<string, string>) ?? {};
  const isLight = colorMode === "light";
  const config = { ...(isLight ? LIGHT_CONFIG : DARK_CONFIG), ...baseConfig };
  const isGrid = layoutType === "grid";
  const useTabs = podiumMode === "tabs" && links.some((l) => l.groupId);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    // Reset the document between renders so stale content never lingers.
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 100%; min-height: 100%; }
      body { -webkit-font-smoothing: antialiased; }
      a { text-decoration: none; color: inherit; }
    </style></head><body><div id="root"></div></body></html>`);
    doc.close();

    const rootEl = doc.getElementById("root");
    if (!rootEl) return;

    if (!rootRef.current) {
      rootRef.current = createRoot(rootEl);
    }

    rootRef.current.render(
      <PublicProfile
        preview
        profileUrl={`/${username}`}
        profile={{
          id: "preview",
          userId: "preview",
          username,
          links,
          bio,
          theme: themes.find((t) => t.id === themeId) ?? null,
          user: { name: username, image: null, createdAt: null },
          customCss,
          layoutType,
          avatarUrl: null,
          isPublic: true,
          viewCount: 0,
          themeId,
          podiumMode,
          colorMode,
        }}
        previewConfig={config}
      />
    );

    return () => {
      // Leave root mounted for fast subsequent renders; parent unmount cleans up.
    };
  }, [username, bio, links, themeId, themes, layoutType, customCss, colorMode, podiumMode]);

  useEffect(() => {
    return () => {
      rootRef.current?.unmount();
      rootRef.current = null;
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title={`Live preview of @${username}`}
      className="h-[560px] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg2)]"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
