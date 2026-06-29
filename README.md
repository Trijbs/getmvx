<div align="center">

# MVX

**Your identity, fully yours.**

A fast, deeply customizable link-in-bio platform for gamers, streamers, and digital creators — one home for your links, socials, and content at **[getmvx.cc](https://getmvx.cc)**.

[![License: Proprietary](https://img.shields.io/badge/license-Proprietary-red.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://vercel.com/)

</div>

---

> [!IMPORTANT]
> This is a **proprietary, commercial product**. The source is published for transparency and reference only — it is **not** open source and may not be used, copied, or redistributed. See [LICENSE](./LICENSE).

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Database & migrations](#database--migrations)
- [Deployment](#deployment)
- [Security](#security)
- [License](#license)

## Features

- **Public profiles** at `getmvx.cc/<username>` with a dynamic Open Graph image per profile
- **Profile editor** — drag-and-drop links, link sections, theme picker, font picker, custom CSS, layout modes (centered / grid / minimal), avatar upload, and a live preview
- **Theming** — 10 built-in themes plus full custom-CSS injection (sanitized server-side)
- **Authentication** — email/password with email verification and password reset, plus Google and Discord OAuth
- **Pro subscription** — recurring billing via Gumroad, granted through a signature-verified webhook
- **Analytics dashboard** — profile views, link clicks, top links, and 30-day trends
- **Transactional & marketing email** — verification, password reset, and waitlist via Brevo
- **Abuse protection** — per-IP rate limiting, reserved usernames, and input sanitization
- **Observability** — error and performance monitoring via Sentry

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) ([Neon](https://neon.tech/)) via [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-neon` |
| Auth | [NextAuth v5 / Auth.js](https://authjs.dev/) — credentials, Google, Discord |
| Payments | [Gumroad](https://gumroad.com/) (Pro subscription) |
| File storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible presigned uploads) |
| Email | [Brevo](https://www.brevo.com/) + Cloudflare Email Worker |
| Rate limiting | [Upstash Redis](https://upstash.com/) |
| Monitoring | [Sentry](https://sentry.io/) |
| Charts | [Recharts](https://recharts.org/) |
| Drag & drop | [dnd-kit](https://dndkit.com/) |
| Hosting | [Vercel](https://vercel.com/) · DNS on [Cloudflare](https://www.cloudflare.com/) |

## Architecture

```text
src/
  app/
    (app)/          Authenticated app: dashboard, editor, analytics, settings
    (auth)/         Login, register, verify-email, reset-password, onboarding
    [username]/     Public profile (root-level pretty URL)
    u/[username]/   Public profile (legacy path)
    api/            Route handlers: auth, links, widgets, themes, analytics,
                    profile, stripe, webhooks/gumroad, og, waitlist
    terms/ privacy/ Legal pages
  components/        Landing, editor, dashboard, analytics, profile, brand
  lib/              auth, db, stripe, gumroad, brevo, r2, ratelimit,
                    sanitize, themes, reserved-usernames
prisma/             Schema, migrations, seed
email-worker/       Cloudflare Email Worker
```

## Getting started

### Prerequisites

- **Node.js 20+**
- A **PostgreSQL** database (the project targets [Neon](https://neon.tech/))
- Accounts for any integrations you want to enable (Google/Discord OAuth, Gumroad, Brevo, Cloudflare R2, Upstash, Sentry)

### Setup

```bash
# 1. Install dependencies (legacy peer deps required for the Next 16 / React 19 stack)
npm install --legacy-peer-deps

# 2. Configure environment — create .env.local and fill in the values (see below)

# 3. Generate the Prisma client and apply migrations
npx prisma generate
npx prisma migrate deploy

# 4. Run the dev server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` in the project root. All server secrets are read at runtime; only `NEXT_PUBLIC_*` values are exposed to the browser.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL / Neon connection string |
| `NEXTAUTH_URL` · `NEXTAUTH_SECRET` | Auth.js base URL and signing secret |
| `NEXT_PUBLIC_APP_URL` | Public base URL used in emails (defaults to `https://getmvx.cc`) |
| `GOOGLE_CLIENT_ID` · `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `DISCORD_CLIENT_ID` · `DISCORD_CLIENT_SECRET` | Discord OAuth |
| `R2_ACCOUNT_ID` · `R2_ACCESS_KEY_ID` · `R2_SECRET_ACCESS_KEY` · `R2_BUCKET_NAME` · `R2_PUBLIC_URL` | Cloudflare R2 storage (avatar uploads) |
| `GUMROAD_ACCESS_TOKEN` · `GUMROAD_SELLER_ID` · `NEXT_PUBLIC_GUMROAD_PRODUCT_URL` | Gumroad payments & webhook verification |
| `BREVO_API_KEY` · `BREVO_NEWSLETTER_LIST_ID` | Brevo transactional & marketing email |
| `UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis rate limiting |
| `NEXT_PUBLIC_SENTRY_DSN` · `SENTRY_AUTH_TOKEN` | Sentry monitoring & source-map upload |
| `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe (optional / scaffolded) |

> Integrations fail gracefully when their keys are absent (e.g. uploads return `503`, rate limiting fails open), so you can run locally with only the database and auth configured.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |
| `npm run pages:build` | Build for Cloudflare via OpenNext |
| `npm run pages:deploy` | Build and deploy to Cloudflare Pages |

## Database & migrations

The schema lives in [`prisma/schema.prisma`](prisma/schema.prisma); migrations are tracked under `prisma/migrations/`.

```bash
npx prisma migrate dev --name <change>   # create & apply a migration locally
npx prisma migrate deploy                # apply pending migrations (CI / prod)
npx prisma studio                        # browse the database
```

> Production builds run `prisma generate` only — apply migrations explicitly with `prisma migrate deploy` before shipping schema changes.

## Deployment

MVX is deployed on **Vercel** with DNS managed by **Cloudflare**. Configure the environment variables above in the Vercel project (Production scope), then push to `main`. The Gumroad webhook (`/api/webhooks/gumroad`) and Cloudflare R2 bucket must be configured for payments and avatar uploads respectively.

## Security

- Custom CSS is sanitized server-side ([`src/lib/sanitize.ts`](src/lib/sanitize.ts)) to prevent `<style>`/`<script>` breakout.
- Public link URLs are scheme-validated before rendering.
- All mutating API routes enforce ownership; the Gumroad webhook verifies `seller_id` and confirms sales against the Gumroad API.
- Per-IP rate limiting protects authentication and abuse-prone endpoints.

To report a vulnerability, please contact the maintainer privately rather than opening a public issue.

## License

**Copyright © 2026 Trijbs. All rights reserved.**

This project is proprietary software. No permission is granted to use, copy, modify, or distribute it. See [LICENSE](./LICENSE) for the full terms.
