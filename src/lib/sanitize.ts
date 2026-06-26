// Defensive cap so a single profile can't store an unbounded CSS blob.
const MAX_CUSTOM_CSS_LENGTH = 50_000;

/**
 * Make user-authored CSS safe to inject into a `<style>` element.
 *
 * Attack vectors covered:
 *  1. `</style>` / `</script>` breakout — the only way CSS becomes script
 *     inside a raw-text element. Neutralized by stripping the opening `<`.
 *  2. `@import` — loads arbitrary external stylesheets; enables tracking pixels
 *     and can pull in malicious CSS.
 *  3. `expression()` — legacy IE eval-in-CSS; harmless in modern browsers but
 *     stripped for defense-in-depth.
 *  4. `javascript:` URL scheme — blocked wherever it appears.
 *  5. `-moz-binding` — old Gecko XBL execution vector; long obsolete but cheap
 *     to strip.
 *
 * We intentionally do NOT strip `url()` — legitimate Pro uses like
 * `background-image: url(...)` with https sources are valid CSS. Content
 * Security Policy (frame the profile in a strict CSP) is the correct layer
 * for controlling resource loads at render time.
 */
export function sanitizeCustomCss(css: string): string {
  return css
    .slice(0, MAX_CUSTOM_CSS_LENGTH)
    // 1. Prevent </style> / </script> breakout
    .replace(/<(?=\s*\/\s*(?:style|script))/gi, "")
    // 2. Strip @import directives
    .replace(/@import\b[^;]*(;|$)/gi, "")
    // 3. Strip IE expression()
    .replace(/expression\s*\(/gi, "")
    // 4. Strip javascript: scheme
    .replace(/javascript\s*:/gi, "")
    // 5. Strip -moz-binding
    .replace(/-moz-binding\s*:/gi, "");
}
