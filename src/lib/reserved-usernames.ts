/**
 * Usernames that cannot be claimed because they shadow real routes or
 * reserved brand/infra segments.
 *
 * Keep in sync with the top-level directories in src/app/ and any
 * well-known paths added in the future.
 */
export const RESERVED_USERNAMES = new Set([
  // App route segments
  "api",
  "brand",
  "u",
  // Auth group routes
  "login",
  "register",
  "onboarding",
  "forgot-password",
  "reset-password",
  "verify-email",
  "check-email",
  // App group routes
  "dashboard",
  "editor",
  "analytics",
  "settings",
  // OG / dynamic
  "og",
  // Common brand / support
  "admin",
  "administrator",
  "help",
  "support",
  "contact",
  "about",
  "terms",
  "privacy",
  "pricing",
  "blog",
  "news",
  "press",
  "jobs",
  "careers",
  "status",
  "docs",
  "developers",
  // Common infra slugs
  "www",
  "app",
  "mail",
  "email",
  "static",
  "cdn",
  "assets",
  "media",
  "images",
  "files",
  "uploads",
  // Brand protection
  "mvx",
  "getmvx",
  "mvxteam",
  "official",
  "verify",
  "verified",
  "pro",
  "team",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}
