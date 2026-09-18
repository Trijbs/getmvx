import * as cheerio from "cheerio";
import type { Element } from "domhandler";

export type ImportSource = "linktree" | "guns.lol";

export interface ImportedLink {
  title: string;
  url: string;
  icon: string;
}

const MAX_LINKS = 40;
const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const HOSTS: Record<ImportSource, string[]> = {
  linktree: ["linktr.ee", "lnk.to", "tr.ee"],
  "guns.lol": ["guns.lol"],
};

const ICON_HOSTS: Record<string, string> = {
  "twitter.com": "x",
  "www.twitter.com": "x",
  "x.com": "x",
  "www.x.com": "x",
  "instagram.com": "instagram",
  "www.instagram.com": "instagram",
  "youtube.com": "youtube",
  "www.youtube.com": "youtube",
  "twitch.tv": "twitch",
  "www.twitch.tv": "twitch",
  "tiktok.com": "tiktok",
  "www.tiktok.com": "tiktok",
  "spotify.com": "spotify",
  "open.spotify.com": "spotify",
  "github.com": "github",
  "www.github.com": "github",
  "www.linkedin.com": "linkedin",
  "linkedin.com": "linkedin",
  "discord.com": "discord",
  "discord.gg": "discord",
  "steamcommunity.com": "steam",
  "store.steampowered.com": "steam",
};

export function detectSource(
  raw: string
): { source: ImportSource; url: string } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "linktr.ee") {
    return { source: "linktree", url: url.href };
  }

  if (host === "guns.lol") {
    return { source: "guns.lol", url: url.href };
  }

  return null;
}

export function detectIcon(hostname: string): string {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  const mapped = ICON_HOSTS[host] || ICON_HOSTS[`www.${host}`];
  if (mapped) return mapped;

  if (/substack|medium|wordpress|blog|newsletter/i.test(host)) return "blog";
  if (/shop|store|etsy|amazon|shopify|carrd|product/i.test(host)) return "shop";
  if (/portfol|artstation|behance|dribbble|figma/i.test(host)) return "portfolio";
  if (/discord|kick|patreon/i.test(host)) return "discord";

  return "link";
}

export async function fetchProfileHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function cleanMarketingParams(raw: string): URL {
  const url = new URL(raw);
  for (const key of [...url.searchParams.keys()]) {
    if (
      key.startsWith("utm_") ||
      key === "fbclid" ||
      key === "gclid" ||
      key === "ref"
    ) {
      url.searchParams.delete(key);
    }
  }
  return url;
}

function isSourceInternal(httpUrl: URL, source: ImportSource): boolean {
  const host = httpUrl.hostname.replace(/^www\./, "").toLowerCase();
  return HOSTS[source].some(
    (h) => host === h || host.endsWith(`.${h}`)
  );
}

/**
 * Extract external http(s) links from a profile page's HTML.
 *
 * Linktree and guns.lol both ship the destination hrefs in server-rendered
 * anchors, so a single host-agnostic pass (prefer elements with a title-like
 * child, fall back to inner text) stays robust as each site renames its
 * CSS classes. Destinations are deduped by URL and capped at MAX_LINKS.
 */
export function extractLinks(
  html: string,
  source: ImportSource,
  baseUrl?: string
): ImportedLink[] {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl ?? `https://${HOSTS[source][0]}`);
  const seen = new Set<string>();
  const out: ImportedLink[] = [];

  const pickText = (el: Element): string => {
    // Prefer a dedicated title element (card-title / btn-title), then
    // aria-label, then trimmed text without child nodes.
    const $el = $(el);
    return (
      $el.find(".card-title, .btn-title, .btn-wrap, [class*='title']").first().text().trim() ||
      $el.attr("aria-label")?.trim() ||
      $el.clone().children().remove().end().text().trim() ||
      ""
    );
  };

  $("a[href]").each((_, el) => {
    const $a = $(el);
    const href = $a.attr("href");
    if (!href) return;

    let parsed: URL;
    try {
      parsed = new URL(href, base);
    } catch {
      return;
    }

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
    if (isSourceInternal(parsed, source)) return;

    const clean = cleanMarketingParams(parsed.href).href;
    if (seen.has(clean)) return;
    if (out.length >= MAX_LINKS) return;

    const title = pickText(el);
    if (!title) return;

seen.add(clean);
    out.push({
      title: title.length > 120 ? `${title.slice(0, 117)}...` : title,
      url: clean,
      icon: detectIcon(parsed.hostname),
    });
  });

  return out;
}