// Tier model: Pro = Badge.type === "PRO" (existing, granted by Gumroad webhook/admin).
// Centralize tier logic so Free/Pro gating is consistent across server + client.

export type Tier = "free" | "pro";

// Pro-only capabilities. Free users can *preview* several of these live (the
// conversion mechanic) but cannot persist the action — see <Lock />.
export const PRO_FEATURES = [
  "css-templates",
  "custom-css",
  "podiums",
  "dark-lite",
  "qr-share",
] as const;

export type ProFeature = (typeof PRO_FEATURES)[number];

interface BadgeLike {
  type: string;
}

/** True when the user holds a PRO badge. */
export function isProTier(badges: BadgeLike[] | null | undefined | false): boolean {
  if (!badges || !Array.isArray(badges)) return false;
  return badges.some((b) => b.type === "PRO");
}

/** Human label used by upsell copy. */
export const PRO_LABEL = "PRO";
