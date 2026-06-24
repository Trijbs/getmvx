// Defensive cap so a single profile can't store an unbounded CSS blob.
const MAX_CUSTOM_CSS_LENGTH = 50_000;

/**
 * Make user-authored CSS safe to inject into a `<style>` element.
 *
 * Custom CSS is a "write anything" Pro feature, so we must NOT strip valid CSS
 * (e.g. Level 4 range media queries like `@media (width < 600px)` legitimately
 * contain `<`). The only way CSS becomes script is by breaking out of the
 * `<style>` raw-text element via a `</style>` (or `</script>`) end tag, so we
 * neutralize just that sequence by dropping the leading `<`. Everything else,
 * including `<` in media queries, is preserved.
 */
export function sanitizeCustomCss(css: string): string {
  return css
    .slice(0, MAX_CUSTOM_CSS_LENGTH)
    .replace(/<(?=\s*\/\s*(?:style|script))/gi, "");
}
