const ALLOWED_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

export function isValidLinkUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}
