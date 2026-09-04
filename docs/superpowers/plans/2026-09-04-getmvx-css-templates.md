# Plan: Fun Release — CSS Templates + Features + Easter Eggs (Freemium)

Date: 2026-09-04 · Repo: getmvx (Next.js 16, TS, Prisma 7, NextAuth v5, Postgres/Neon)

## Goal & Strategy

Ship a cohesive "fun" release that:

1. Fixes the **custom-CSS render gap** on the public profile.
2. Adds a **real WYSIWYG iframe preview** in the editor.
3. Adds **curated CSS templates**.
4. Adds **8 new features** across Free + Pro.
5. Adds **hidden easter eggs** across Free + Pro.
6. Uses **freemium conversion mechanics** — every gated (Pro) feature is
   *previewable* by Free users live, with an inline upsell, so the free
   experience is delightful but pulls users toward Pro.

**Conversion principle (user directive):** Free users get genuinely fun,
complete features. Pro features are the "power tools." The bridge is
**live-preview blur / teaser** — a Free user can *see* exactly what a Pro
feature would look like on their own profile, but clicking to lock it in
prompts an upgrade. This is the highest-leverage engagement → purchase path
link-in-bio tools use.

## Tier model (this release)

Defined once, consumed everywhere. Pro = `Badge.type === "PRO"` (existing).
No new billing; reuse existing `UpgradeButton`.

| Feature | Tier |
|---|---|
| Reset of earlier plan (render fix, iframe preview) | — (all) |
| CSS templates — **live preview** | FREE (preview) |
| CSS templates — **apply** (replace-with-confirm) | PRO (gated) |
| Raw custom-CSS editor | PRO (gated, currently unenforced → enforce) |
| Profilepodiums (section tabs) | PRO (gated, preview teaser NOT applicable — structural) |
| Dark/lite per-profile theme toggle | PRO (gated, live preview works) |
| QR-code share (downloadable) | PRO (gated) |
| Bio markdown (safe subset) | FREE |
| Link labels/tags | FREE |
| Copy-link share + confetti | FREE |
| Editor shortcut (⌘K shown; ⌘K/⌘⇧P implemented) | FREE |
| Profile birthday/stat card | FREE |
| Identity badges (existing) | FREE + PRO |
| Easter eggs (incl. Hidden Hunter badge) | FREE |
| Seasonal day-theme (small fixed set) | FREE |

## Implementation Steps

### Phase 0 — Gating infrastructure (enables conversion)
- Add `src/lib/features.ts`:
  `export type Tier = 'free' | 'pro'; export const isPro = (b: Badge[]|null|undefined) => …`
  `export const PRO_FEATURES = ['css-templates','custom-css','podiums','theme-darklite','qr-share'] as const;`
- Thread `isPro` from server components into clients:
  - `src/app/(app)/editor/page.tsx`: fetch `Badge type=PRO`, pass `isPro` to `EditorClient`.
  - `src/app/(app)/settings/page.tsx`: already computes `isPro`; keep.
- New `src/components/ui/Lock.tsx` — wraps a Pro control: renders children normally
  but when `locked`, shows a small 🔒 PRO chip + blur/dim + `UpgradeButton` →
  hard-gates the *action* (apply), not the *preview*.

### Phase 1 — CSS render fix + stable hooks (all tiers)
**`src/components/profile/PublicProfile.tsx`**
- Add `preview?: boolean` prop: suppress analytics click tracking; in preview,
  render inside the iframe's own viewport (no full-screen page assumptions).
- Add stable `data-mvx-*` attributes: profile, layout, header, avatar, name,
  handle, bio, links, link (+index), footer. (Needed by templates/seasonal/etc.)
- Inject sanitized CSS:
  `{customCss && <style dangerouslySetInnerHTML={{__html: sanitizeCustomCss(customCss)}}/>}`
  (reuse `sanitizeCustomCss` from `src/lib/sanitize.ts` on render for defense).

### Phase 2 — Curated CSS templates (Free preview / Pro apply)
**New `src/lib/css-templates.ts`** — `interface CssTemplate {id,name,description,accent,css}`,
`CSS_TEMPLATES: 8 presets` (neon-glow, glassmorphism, neo-brutalism,
minimal-high-contrast, gradient-mesh, terminal, editorial, rounded-soft), all
targeting `data-mvx-*`; no `@import`/`javascript:`.
**`src/components/editor/CssEditor.tsx`** — template gallery cards (name, desc,
accent swatch, active state); click → if Free:
  - set the chosen template's CSS into the live editor/preview state so user
    *sees it working* (preview_mode = true, non-persistable), show `Lock` →
    UpgradeButton to actually save. If Pro: apply with replace-with-confirm.
**`src/components/ui/ConfirmDialog.tsx`** — reusable confirm (overwrite guard).

### Phase 3 — Real iframe live preview
**New `src/components/editor/LivePreview.tsx`** — `<iframe>` (360px mobile frame)
that mounts the real `PublicProfile` (via `react-dom/client` `createRoot`) into
`iframe.contentDocument`, re-rendering on every state change (bio, links,
avatar, theme config, layout, font, customCss). `preview` mode → no tracking.
CSS is fully isolated (own document) → can't restyle the editor.
**Remove `ProfilePreviewCard.tsx`**; wire `LivePreview` in `EditorClient`.

### Phase 4 — The 8 features

1. **Profilepodiums (section tabs)** — PRO, structural.
   Schema: add `Profile.podiumMode String @default("stack")` ('stack'|'tabs') and
   optional `Profile.tabTitles Json?`. Editor toggles; public profile renders a
   small pill tab-bar when podiumMode='tabs', switching active section.
   Migration: additive nullable/defaulted.
   *(Not live-preview-teasable — structural; gate via `Lock` + upsell note.)*
2. **Bio markdown (safe subset)** — FREE. `src/lib/markdown.ts`: mini-renderer for
   `**bold**`, `*italic*`, `[text](url)` (http/https/mailto only), `- item`,
   newlines; output to React elements (no `dangerouslySetInnerHTML`, no HTML
   passthrough → no XSS). Render in `PublicProfile` bio + preview + OG desc.
3. **Copy-link share + confetti** — FREE. Share button (dashboard + editor) copies
   `APP_DOMAIN/username`; `canvas-confetti`-style hand-rolled CSS confetti (no dep)
   or tiny canvas. Add `useCopy` hook.
4. **Editor shortcuts** — FREE. ⌘K new link, ⌘⇧P toggle preview, ⌘S save (exists).
   `src/components/editor/shortcuts.ts` + hints bar.
5. **Profile birthday/stat card** — FREE. Show "MVX since {createdAt}" + viewCount
   on the public profile footer ("stats" line). Pass `createdAt`/`viewCount`.
6. **Dark/lite per-profile theme** — PRO (live-preview teasable). `Profile.colorMode
   String @default("dark")` ('dark'|'light'); theme config provides light overrides;
   editor toggle flips colors; preview updates live; save gated to Pro via `Lock`.
   Migration: additive defaulted.
7. **QR-code share** — PRO. Add dep `qrcode` (+ types). `src/components/pro/QrModal.tsx`
   renders shareable QR for `APP_DOMAIN/username`, downloadable PNG. Gated Pro.
8. **Link labels/tags** — FREE. Schema: `Link.label String?` + `Link.labelColor String?`.
   Editor: label input + color swatches. Public: small pill on the link button
   (`.mvx-label` hook). Migration: additive nullable.

### Phase 5 — Easter eggs (FREE) + Hidden Hunter badge
- **Klik-een-kleurei op Symbol** — clicking the MVX logo N times in the footer/nav
  cycles a hidden hue (localStorage counter); 5th click fires a confetti burst.
- **/dev route** — hidden URL `/dev` (or `/dev-mode`) renders a secret "crew"
  page (brand symbols, inside jokes) only reachable by typing the path.
- **1-april + seasonal banner** — landing shows a small seasonal banner/theme
  on a fixed set of dates: New Year, Valentine, Easter, Summer, Halloween,
  Christmas (each: accent hue shift + small message/emoji). Data in
  `src/lib/seasons.ts` (date → config). Cheap CSS `data-season` variant.
- **Hidden Hunter badge** — a tiny progress tracker counts found eggs
  (logo clicks, /dev visit, seasonal). At threshold, **grant `Badge
  type="HIDDEN_HUNTER"`** via a small POST `/api/badges/claim`; renders on the
  public profile like other badges. (Reuses Badge model — no schema change.)
  Celebration confetti when unlocked.

### Phase 6 — Verification
- Migrations: additive only (4: podiumMode, colorMode, Link.label, Link.labelColor).
- `npx prisma generate`, `npm ci`, `tsc --noEmit`, `lint`, `next build` all green.
- Manual: Free user previews a template live, sees upsell, cannot save; Pro saves.
- Confirm preview CSS never restyles editor; `</style>` breakout neutered.

## Dependencies added
- `qrcode` (+ `@types/qrcode`) — QR share (Pro). (Approved.)
- No animation lib, no markdown lib (safe mini-renderer). (Approved.)

## Files (summary)
- schema: `prisma/schema.prisma` (4 additive fields) + 1 new migration
- new libs: `features.ts`, `css-templates.ts`, `markdown.ts`, `seasons.ts`, `useCopy.ts`
- new UI: `LivePreview.tsx`, `ConfirmDialog.tsx`, `Lock.tsx`, `QrModal.tsx`,
  `SeasonalBanner.tsx`, `HiddenHunter.tsx`, `shortcuts.ts`
- edited: `PublicProfile.tsx`, `CssEditor.tsx`, `EditorClient.tsx`, editor/page.tsx,
  settings/SettingsClient.tsx, dashboard Nav, landing (seasonal), brand Symbol
- deleted: `ProfilePreviewCard.tsx`
- api: `/api/badges/claim`
- docs: this plan

## Out of Scope
- Real billing changes (reuse UpgradeButton; grant stays via existing webhook/admin).
- Full markdown or HTML bio.
- Big calendar engine (small fixed season set only).
- The unselected eggs (Konami, console ascii, html-comment).

## Milestones (build order)
M1 gating → M2 render fix + hooks → M3 templates (+Preview lock) → M4 iframe preview →
M5 features (schema migration first) → M6 easter eggs + Hidden Hunter → M7 verify.
