# MVX Architecture

How the system works, end to end. This document describes *behavior and structure*; for setup and env vars see the [README](../README.md), for direction and priorities see [GOALS.md](GOALS.md).

> When code and this document disagree, the code wins — and this document should be updated in the same change.

## High-level shape

MVX is a single Next.js 16 App Router application backed by Postgres (Neon), deployed on Vercel, with one satellite service: a Cloudflare Email Worker (`email-worker/`). There is no separate backend — all server logic lives in App Router route handlers and server components.

```text
Browser ──► Next.js on Vercel
              ├── src/middleware.ts        cookie-based route protection
              ├── src/app/(auth)/          login, register, verify-email, reset-password, onboarding
              ├── src/app/(app)/           dashboard, editor, analytics, settings   (auth required)
              ├── src/app/[username]/      public profile (root pretty URL)
              ├── src/app/u/[username]/    public profile (legacy path)
              ├── src/app/terms|privacy/   legal pages
              └── src/app/api/*            route handlers (see API surface below)
                        │
                        ├── Neon Postgres (Prisma 7, adapter-neon, client generated to prisma/generated/)
                        ├── Cloudflare R2 (presigned avatar uploads)
                        ├── Upstash Redis (rate limiting — fails open)
                        ├── Brevo (transactional + newsletter email)
                        ├── Gumroad (Pro billing webhook — fails closed)
                        └── Sentry (client/edge/server configs at repo root)

help@/info@getmvx.cc ──► Cloudflare Email Worker (email-worker/) — parse, auto-reply, /send endpoint
```

## Directory map

```text
src/
  app/            Routes. Route groups: (auth) public auth pages, (app) authenticated app.
  components/     By feature: landing/ editor/ dashboard/ analytics/ profile/ settings/ pro/ brand/ ui/
  lib/            All integrations & domain logic (one file per concern):
                    auth.ts       NextAuth v5 config (JWT strategy; credentials + Google + Discord)
                    db.ts         Prisma singleton (Neon adapter, poolQueryViaFetch for edge/workers)
                    gumroad.ts    Webhook verification (verifySellerId, verifySale) + Pro status grant
                    stripe.ts     Stripe client + PLANS constants (scaffolded, not the live billing path)
                    brevo.ts      Transactional/newsletter email
                    r2.ts         Presigned R2 uploads
                    ratelimit.ts  Upstash per-IP limiter (no-ops if env unset)
                    sanitize.ts   Custom-CSS sanitizer for user themes
                    themes.ts     10 built-in theme presets
                    reserved-usernames.ts  Usernames that would shadow routes
  hooks/          Client hooks
  types/          Shared TS types
  middleware.ts   Redirect logic (see Auth below)
prisma/           schema.prisma, migrations/, seed.ts, generated/ (generated client — imported by src/lib/db.ts)
email-worker/     Standalone Cloudflare Worker (own package.json + wrangler.jsonc)
public/           Static assets, brand files
```

## Auth

- **NextAuth v5 (Auth.js) with the JWT session strategy** — no DB sessions. Config in `src/lib/auth.ts`.
- Providers: **credentials** (bcryptjs-hashed passwords), **Google**, **Discord**.
- **Registration** (`POST /api/auth/register`) → email verification (`/api/auth/verify-email`, token stored in `VerificationToken`). **Password reset** via `/api/auth/forgot-password` + `/api/auth/reset-password`.
- **`src/middleware.ts`** does lightweight protection by cookie *presence* (`authjs.session-token` / `__Secure-authjs.session-token`): unauthenticated users are redirected away from `/dashboard`, `/editor`, `/analytics`, `/settings`, `/onboarding`; logged-in users are redirected away from `/login`, `/register`. Real authorization happens in route handlers/server components via the session — middleware is only UX-level routing.
- New users pick a username at `/onboarding` (`POST /api/profile/setup`), which is checked against `reserved-usernames.ts` so no one can claim a route segment like `dashboard` or `api`.

## Data model

Schema at `prisma/schema.prisma` (authoritative). Models:

| Model | Role |
| --- | --- |
| `User` | Account (email, password hash, pro status) |
| `Account` / `Session` / `VerificationToken` | Auth.js adapter models (sessions unused — JWT strategy) |
| `Profile` | 1:1 with User — username, bio, theme config, custom CSS, layout, avatar URL, visibility |
| `Link` | Ordered links on a profile (position for drag-and-drop reorder) |
| `Widget` | Platform embeds (Twitch, Spotify, Discord, YouTube, Steam) |
| `Theme` | Custom theme storage (built-ins live in `src/lib/themes.ts`) |
| `Badge` | Pro / Verified / Early Adopter / custom badges |
| `File` | Uploaded file records (R2) |
| `AnalyticsEvent` | `VIEW` and `CLICK` events powering the analytics dashboard |
| `WaitlistSignup` | Pre-launch waitlist entries |

Prisma 7 with `@prisma/adapter-neon`; the client is **generated into `prisma/generated/`** and imported from there (`src/lib/db.ts`), not from `@prisma/client`. Always run `npx prisma generate` after a fresh install or schema change.

## API surface

All handlers under `src/app/api/`. Mutating routes check session ownership; abuse-prone routes are rate-limited.

| Area | Routes | Notes |
| --- | --- | --- |
| Auth | `auth/register`, `auth/verify-email`, `auth/forgot-password`, `auth/reset-password`, `auth/[...nextauth]` | Rate-limited |
| Profile | `profile` (PATCH bio/theme/CSS/visibility), `profile/setup` (username claim), `profile/avatar` (presigned R2 upload) | Custom CSS passes through `sanitize.ts` server-side before save |
| Links | `links` (POST), `links/[id]` (PATCH/DELETE), `links/reorder` | Ownership enforced |
| Widgets | `widgets`, `widgets/[id]` | Platform embeds CRUD |
| Themes | `themes/[id]` | Custom themes |
| Analytics | `analytics/click` (public click tracking), `analytics/overview` (dashboard data) | |
| OG | `og/[username]` | Dynamic Open Graph image per profile |
| Billing | `webhooks/gumroad` (live), `stripe/checkout` + `stripe/portal` + `stripe/webhook` (scaffolded) | See Payments |
| Marketing | `waitlist`, `newsletter` (POST/DELETE), `campaigns` | Brevo-backed |

## Payments

**Gumroad is the live billing path.** Two-sided flow:

1. `src/components/pro/UpgradeButton.tsx` links the user to the Gumroad product checkout with `?user_id=<id>` appended.
2. Gumroad POSTs to `/api/webhooks/gumroad` as **`application/x-www-form-urlencoded`** (never parse as JSON). The handler:
   - **Fails closed**: rejects unless `seller_id` matches `GUMROAD_SELLER_ID` (`verifySellerId`).
   - Confirms the sale against the Gumroad API with our access token (`verifySale`) — except `test=true` pings, which aren't retrievable via the API but are already authenticated by the seller-id gate.
   - Reads `url_params[user_id]` (Gumroad echoes checkout query params) to find the user and grant Pro.

**Stripe is scaffolded but inactive**: `src/lib/stripe.ts` (client + `PLANS`: Pro monthly €3.99 / yearly €31.99) and the `api/stripe/*` routes exist for a possible future migration. The Stripe client's `apiVersion` is pinned and must match the installed `stripe` package's expected version — bumping the `stripe` dependency usually requires updating it.

**Pricing source of truth** is `src/components/landing/Pricing.tsx` (displayed) and `src/lib/stripe.ts` `PLANS` (constants): **Pro €3.99/mo or €31.99/yr (33% off); Verified badge add-on €4.99 once**. Change both together.

## Analytics

Public profile views write `AnalyticsEvent(type=VIEW)` on render; link clicks POST to `/api/analytics/click` (`type=CLICK`) before redirecting. The dashboard (`/analytics`) reads `analytics/overview` — stat cards, a 30-day Recharts area chart, top links, and recent activity.

## Email

Two independent systems:

- **Outbound (Brevo, `src/lib/brevo.ts`)** — verification emails, password resets, waitlist confirmation, newsletter subscribe/unsubscribe, campaigns.
- **Inbound (Cloudflare Email Worker, `email-worker/`)** — Cloudflare Email Routing delivers `help@getmvx.cc` and `info@getmvx.cc` to the worker, which parses with `postal-mime` and auto-replies. It also exposes `POST /send`, restricted to sending from `help@`/`info@`. Deployed separately (`wrangler` from inside `email-worker/`).

## Security model

| Threat | Defense | Where |
| --- | --- | --- |
| CSS injection via custom themes | Server-side sanitizer strips `@import`, `url()`, `expression()`, `javascript:` | `src/lib/sanitize.ts`, applied in profile PATCH |
| Malicious link URLs | Scheme validation before rendering | Public profile rendering |
| Fake Pro grants | Webhook fails closed: seller-id gate + sale verification against Gumroad API | `src/lib/gumroad.ts` |
| Route shadowing | Reserved username list checked at claim time | `src/lib/reserved-usernames.ts` |
| Credential stuffing / abuse | Per-IP rate limiting (Upstash) on auth, waitlist, click endpoints — **fails open** if Upstash is unconfigured | `src/lib/ratelimit.ts` |
| IDOR | Ownership checks on every mutating route | Each handler |
| Secrets | Env-only; CI build uses dummy `NEXTAUTH_*` placeholders, never real secrets | `.github/workflows/ci.yml` |

Sentry captures client, edge, and server errors (`sentry.*.config.ts` at repo root, `src/instrumentation.ts`).

## Deployment & CI

- **Production: Vercel.** `vercel.json` pins install to `npm ci`. Push to `main` → deploy. DNS on Cloudflare.
- **Alternative path: Cloudflare** via `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.toml`, `npm run pages:build|pages:deploy`). Kept working (e.g. `poolQueryViaFetch` in `db.ts`) but Vercel is the live target.
- **CI** (`.github/workflows/ci.yml`): `npm ci` → `prisma generate` → lint → `tsc --noEmit` → `next build`, plus a CodeQL workflow. The build runs without a real database.
- **Dependencies**: plain npm resolution — `legacy-peer-deps` was dropped when `@sentry/nextjs` 10 added Next 16 peer support. Don't reintroduce it.

## Verification (no test suite yet)

There are no automated tests. Before considering a change done:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

…and for user-facing changes, exercise the affected flow in `npm run dev` (register → onboard → edit → view public profile → click a link → check analytics is the core smoke path). Adding a real test suite is on the roadmap (see GOALS.md).
