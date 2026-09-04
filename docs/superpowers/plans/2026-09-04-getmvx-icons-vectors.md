# Plan: Richer Icons & Vectors in MVX App UI

**Datum:** 2026-09-04
**Status:** Gepland → Uitvoering

## Doel & scope
Vervang emoji/rauwe-unicode iconen in de app-UI door een rijk, consistent **vector-systeem**:
- **lucide-react** voor generieke UI-iconen (nav, acties, knoppen, lege-states)
- **Custom gebrandmerkte sociale-platform vectoren** die passen bij de bestaande `Symbol.tsx`/`Logo.tsx` esthetiek
- Overal, **inclusief het openbare profiel** (`PublicProfile.tsx`)

## Achtergrond / huidige situatie (inventarisatie)
- `src/components/brand/Icon.tsx`: ~30 custom stroke/filled iconen, alleen voor nav + brand-pagina. Gebruikt `dangerouslySetInnerHTML` (security-smell).
- `src/components/brand/Symbol.tsx` + `Logo.tsx`: rijke custom vectoren (merkenbasis) — **behouden**.
- Social-iconen in `AddLinkModal.tsx` zijn **emoji** (`🔗 𝕏 ▶ 📸 💬 🎵 🎮 🎧 🐙 💼 🌐 📧 📝 🛒 💡`) — cross-platform inconsistent.
- Acties gebruikten rauwe unicode: drag `⠿`, edit `✎`, delete `✕`, check `✓`/`✕`.
- Auth/landing SVGs handmatig inline (Google, Discord, hamburger, signout).
- `prisma/schema.prisma:134` — Link.`icon` is nullable `String` (opslaat emoji of platform-key).

## Aanpak

### Laag A — UI-library (lucide-react)
- Voeg `lucide-react` toe (React 19-compatibel, tree-shakable).
- Vervang ongelijksoortige glyphs door lucide-componenten:
  - `SortableLink`: drag `⠿`→`GripVertical`, edit `✎`→`Pencil`, delete `✕`→`Trash2`
  - checkmarks `✓`/`✕` in UI → `Check`/`X`
  - `dashboard/Nav` signout → `LogOut`
  - `landing/Nav` hamburger → `Menu`
  - `EditorClient` close `✕` → `X`

### Laag B — Custom sociale vector-iconen (brand)
- **Nieuw** `src/components/brand/social/social-icons.ts`: vector-definities per platform, stylistisch passend bij merk (zachte hoeken, 1.5px stroke waar passend, `currentColor`). Platforms: Twitch, Discord, YouTube, Instagram, TikTok, X, Spotify, GitHub, LinkedIn, Steam, Email, Website, Shop, Blog, Portfolio.
- **Nieuw** `src/components/brand/social/SocialIcon.tsx`: rendert vector van platform-key string.
- **Icon.tsx refactor**: verwijder `dangerouslySetInnerHTML`; behoud custom brand-icons; lucide als generieke basis/fallback.

### Laag C — Picker & data-opslag (link.icon)
- `AddLinkModal` emoji-picker → vector/deck-picker met grid van merk-iconen.
- Backwards compat: `link.icon` blijft `String`. Nieuwe opslag = platform-key; rendering: lookup key → `SocialIcon`, onbekende/legacy-waarde → tekst-fallback, eigen keuze → escape-hatch.

### Laag D — Data-migratie (emoji → key)
- Eenmalige Prisma-migration: bestaande emoji-waarden van `Link.icon` omzetten naar platform-keys zodat álle profielen direct het merk-gevoel tonen.
- Mapping-tabel emoji → key (de set uit `AddLinkModal`).

### Laag E — Openbaar profiel (PublicProfile.tsx)
- Regel 108 `{link.icon && <span>{link.icon}</span>}` → `SocialIcon`-render (key→vector + emoji-fallback).
- Kleur via `currentColor` zodat het meekleurt met de theme-config (`textColor`/`accentColor`).

## Bestanden
**Nieuw:**
- `src/components/brand/social/social-icons.ts`
- `src/components/brand/social/SocialIcon.tsx`
- Prisma-migration (+ data-backfill)

**Wijzig:**
- `package.json` + `package-lock.json` (lucide-react)
- `src/components/brand/Icon.tsx` (refactor, geen innerHTML)
- `src/components/brand/index.ts` (export `SocialIcon`)
- `src/components/editor/AddLinkModal.tsx` (vector-picker)
- `src/components/editor/SortableLink.tsx`
- `src/components/editor/EditorClient.tsx`
- `src/components/dashboard/Nav.tsx`
- `src/components/landing/Nav.tsx`
- `src/components/profile/PublicProfile.tsx`
- `src/components/landing/Pricing.tsx` / `src/components/editor/WidgetPicker.tsx` (checkmarks, waar relevant)

## Veiligheid / kwaliteit
- Geen `dangerouslySetInnerHTML` meer in `Icon.tsx`.
- Geen console.log, geen secrets; puur presentatie-laag.
- Toegankelijkheid: `aria-hidden` op decoratieve iconen.

## Verificatie
- `tsc --noEmit` → 0 errors
- `next build` → ✓ compiled
- `npm ci`/lockfile consistent
- Visueel: editor + nav + openbaar profiel in alle 3 layouts (centered/grid/minimal), beide themes, hover/focus/active states
- Backwards-compat: bestaande profielen tonen via migratie de vector-iconen
