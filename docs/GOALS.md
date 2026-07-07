# MVX Goals & Roadmap

What we're building toward and why. Read this to understand *intent* before changing product behavior. For how the system works, see [ARCHITECTURE.md](ARCHITECTURE.md).

> Status snapshot last updated: **2026-07-07**. The older planning files at the repo root (`LAUNCH_PLAN.md`, `EDITOR_EXPANSION_PLAN.md`, `ICON_PLAN.md`, `LEGAL_PLAN.md`, `tasks/todo.md`) are working documents from specific efforts — several are partially stale. **This file supersedes them for overall direction**; consult them only for the fine detail of their own effort.

## Mission

Give gamers, streamers, and digital creators a link-in-bio home that is genuinely *theirs* — faster, deeper-customizable, and more creator-aligned than the incumbents. Tagline: **"Your identity, fully yours."** Live at **getmvx.cc**, profile URLs are `getmvx.cc/<username>`.

## Positioning

| Versus | Our edge |
| --- | --- |
| **Linktree** | Deeper customization (custom CSS, fonts, layouts), gamer-native widgets (Twitch/Discord/Steam), 0% cut of creator earnings, better price |
| **guns.lol** | Better analytics, CSS injection, cleaner brand (no edgy/cyberpunk clichés), custom domains (future), monetization layer (future) |

**Brand direction:** Apple × Notion × Linear × Stripe — "The Gateway to Building". Precision, momentum, simplicity. **Avoid:** generic SaaS look, crypto aesthetics, gaming clichés, cyberpunk, corporate blue.

## Business model

Free tier + **Pro at €3.99/mo or €31.99/yr (33% off)**, optional **Verified badge add-on €4.99 one-time**. Billing currently via **Gumroad**; Stripe integration is scaffolded as a possible future path. Pricing source of truth: `src/components/landing/Pricing.tsx` + `PLANS` in `src/lib/stripe.ts` — change both together.

## Where we are

The core product is **built and deployed on Vercel**: auth (credentials + Google + Discord, email verification, password reset), profile editor with drag-and-drop links, themes, custom CSS, widgets, avatar upload, public profiles at root usernames, analytics dashboard, dynamic OG images, waitlist + newsletter, rate limiting, reserved usernames, CSS sanitization, Sentry monitoring, and a verified Gumroad Pro webhook. Legal pages (`/terms`, `/privacy`) exist as routes.

## North star (current phase)

**Public launch of getmvx.cc: convert the waitlist into real users, take real payments.**

### Active workstreams

1. **Brand icon & identity system** — replacing placeholder iconography with a coherent brand icon set (`ICON_PLAN.md`, `src/components/brand/`). In progress.
2. **Legal finalization** — polishing Privacy Policy and Terms of Service drafts (`PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md`, plan in `LEGAL_PLAN.md`) and wiring the final text into `/privacy` and `/terms`. Required before charging real money.
3. **Editor expansion** — remaining phases of `EDITOR_EXPANSION_PLAN.md`: widget persistence polish, layout type selector, link groups/sections, unsaved-changes UX, auto-save.

### Remaining launch checklist

- [ ] Email DNS: `_dmarc.getmvx.cc` TXT record; verify `getmvx.cc` sender domain in Brevo; enable Email Sending on the Cloudflare worker
- [ ] Finalize + publish legal pages (workstream 2)
- [ ] Confirm the Gumroad live product/pricing matches `Pricing.tsx` and remove the temp diagnostic logging from the Gumroad webhook once the flow is confirmed in production
- [ ] Apply the new brand identity to landing + app UI (workstream 1)
- [ ] Launch smoke test: register → verify email → onboard → edit profile → public page → click tracking → analytics → Pro upgrade
- [ ] Waitlist launch announcement email

## Engineering goals (ongoing)

- **Keep CI green**: lint + `tsc --noEmit` + build on every PR; dependabot PRs get merged promptly (watch for type breaks like Stripe apiVersion pins).
- **Add a real test suite** — currently there are zero automated tests; highest-value first targets: `sanitize.ts`, `gumroad.ts` verification, `reserved-usernames`, link reorder logic, auth flows (Playwright smoke).
- **Stay on plain npm** — `legacy-peer-deps` was removed; keep peer deps honest.
- **Keep docs truthful** — README, ARCHITECTURE.md, and this file are updated in the same PR as behavior changes.

## Post-launch backlog (rough priority order)

1. Custom domains per profile (major differentiator; wildcard SSL + per-domain routing)
2. QR code per profile (easy win)
3. Import tool from Linktree / guns.lol (acquisition play)
4. Monetization layer — digital product sales, tip jar (0% platform cut is the promise)
5. Music/now-playing embeds (Spotify / Apple Music)
6. Profile templates & seasonal/limited-edition themes
7. Team/agency accounts (multiple profiles per account)
8. Public API + webhooks
9. Localization (multi-language profiles)
10. Leaderboard / trending profiles; A/B testing on layouts; CRM-lite audience tools
