<div align="center">

# MVX

**Your identity, fully yours.**

A fast, deeply customizable link-in-bio platform for gamers, streamers, and digital creators — one home for your links, socials, and content at **[getmvx.cc](https://getmvx.cc)**.

[![License: Proprietary](https://img.shields.io/badge/license-Proprietary-red.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://vercel.com/)

</div>

---

> [!IMPORTANT]
> This is a **proprietary, commercial product**. The source is published for transparency and reference only — it is **not** open source and may not be used, copied, or redistributed. See [LICENSE](./LICENSE).

## Documentation map

This README covers *what the project is and how to run it*. The deeper docs are the source of truth for everything else — **read them before making changes**:

| Doc | What it answers |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How everything works: routing, auth, data model, payments, analytics, email, security, deployment |
| [`docs/GOALS.md`](docs/GOALS.md) | What we're building toward: mission, positioning, pricing, current status, roadmap |
| `AGENTS.md` *(local-only, gitignored)* | Entry point for AI assistants: read order, gotchas, verification steps |
| [`prisma/schema.prisma`](prisma/schema.prisma) | The database schema (authoritative — never trust docs over this file) |

## What MVX is

MVX gives creators a public profile at `getmvx.cc/<username>` with:

- **Profile editor** — drag-and-drop links and sections, theme picker (10 built-in themes), font picker, custom CSS (sanitized server-side), layout modes, avatar upload, live preview
- **Platform widgets** — Twitch, Spotify, Discord, YouTube, Steam embeds
- **Analytics** — profile views, link clicks, top links, 30-day trends
- **Dynamic OG images** — per-profile Open Graph image at `/api/og/<username>`
- **Auth** — email/password (with verification + password reset), Google OAuth, Discord OAuth
- **Pro subscription** — €3.99/mo or €31.99/yr, billed via Gumroad (see [ARCHITECTURE — Payments](docs/ARCHITECTURE.md#payments))

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Database | PostgreSQL on [Neon](https://neon.tech/) via [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-neon` |
| Auth | [NextAuth v5 / Auth.js](https://authjs.dev/) (JWT strategy) — credentials, Google, Discord |
| Payments | [Gumroad](https://gumroad.com/) (live path) · Stripe (scaffolded, inactive) |
| File storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible presigned uploads) |
| Email | [Brevo](https://www.brevo.com/) + Cloudflare Email Worker (`email-worker/`) |
| Rate limiting | [Upstash Redis](https://upstash.com/) (fails open when unconfigured) |
| Monitoring | [Sentry](https://sentry.io/) (`@sentry/nextjs` 10) |
| Charts / DnD | [Recharts](https://recharts.org/) · [dnd-kit](https://dndkit.com/) |
| Hosting | [Vercel](https://vercel.com/) (production) · DNS on Cloudflare · OpenNext/Wrangler config exists for a Cloudflare deploy path |

## Getting started

Prerequisites: **Node.js 22.x** and a PostgreSQL database (the project targets Neon). Integrations fail gracefully when their keys are absent, so local dev needs only the database and auth configured.

```bash
# 1. Install dependencies (plain npm — legacy-peer-deps is NOT needed since @sentry/nextjs 10)
npm ci

# 2. Configure environment — create .env.local (see table below)

# 3. Generate the Prisma client (output goes to prisma/generated/) and apply migrations
npx prisma generate
npx prisma migrate deploy

# 4. Run the dev server → http://localhost:3000
npm run dev
```

## Environment variables

Create `.env.local` in the project root. Only `NEXT_PUBLIC_*` values are exposed to the browser.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL / Neon connection string |
| `NEXTAUTH_URL` · `NEXTAUTH_SECRET` | Auth.js base URL and signing secret |
| `NEXT_PUBLIC_APP_URL` | Public base URL used in emails (defaults to `https://getmvx.cc`) |
| `GOOGLE_CLIENT_ID` · `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `DISCORD_CLIENT_ID` · `DISCORD_CLIENT_SECRET` | Discord OAuth |
| `R2_ACCOUNT_ID` · `R2_ACCESS_KEY_ID` · `R2_SECRET_ACCESS_KEY` · `R2_BUCKET_NAME` · `R2_PUBLIC_URL` | Cloudflare R2 (avatar uploads) |
| `GUMROAD_ACCESS_TOKEN` · `GUMROAD_SELLER_ID` · `NEXT_PUBLIC_GUMROAD_PRODUCT_URL` | Gumroad payments & webhook verification |
| `BREVO_API_KEY` · `BREVO_NEWSLETTER_LIST_ID` | Brevo transactional & marketing email |
| `UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis rate limiting |
| `NEXT_PUBLIC_SENTRY_DSN` · `SENTRY_AUTH_TOKEN` | Sentry monitoring & source-map upload |
| `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe (scaffolded / optional) |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck (CI runs this — no test suite exists yet) |
| `npm run pages:build` / `pages:deploy` | Cloudflare build/deploy via OpenNext (alternative deploy path) |

## Database & migrations

Schema: [`prisma/schema.prisma`](prisma/schema.prisma). Migrations: `prisma/migrations/`. The generated client is written to `prisma/generated/` and imported from there (not `@prisma/client` directly).

```bash
npx prisma migrate dev --name <change>   # create & apply a migration locally
npx prisma migrate deploy                # apply pending migrations (CI / prod)
npx prisma studio                        # browse the database
```

> Production builds run `prisma generate` only — apply migrations explicitly with `prisma migrate deploy` before shipping schema changes.

## Deployment & CI

Production runs on **Vercel** (installs with `npm ci` per `vercel.json`); push to `main` deploys. GitHub Actions CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs lint → typecheck → build on every PR, plus CodeQL analysis. The Gumroad webhook (`/api/webhooks/gumroad`) and the R2 bucket must be configured in production for payments and avatar uploads.

## Security

See [ARCHITECTURE — Security](docs/ARCHITECTURE.md#security-model) for the full model. Highlights: server-side CSS sanitization, scheme-validated link URLs, ownership checks on all mutating routes, signature-verified Gumroad webhook (fails closed), per-IP rate limiting, reserved-username protection.

To report a vulnerability, contact the maintainer privately rather than opening a public issue.

## License

**Copyright © 2026 Trijbs. All rights reserved.** Proprietary software — no permission is granted to use, copy, modify, or distribute it. See [LICENSE](./LICENSE).
