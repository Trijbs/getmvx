# MVX

> Your identity, fully yours.

MVX (getmvx.cc) is a link-in-bio platform for gamers, streamers, and digital creators — a fast, deeply customizable home for your links, socials, and content.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Prisma** + **PostgreSQL** (Neon)
- **NextAuth v5** (email/password, Google, Discord)
- **Stripe** subscriptions
- **Recharts** for analytics
- Cloudflare **Email Worker** + **Brevo** for transactional/marketing email
- Deployed on **Vercel**, domain DNS on **Cloudflare**

## Features

- Public profiles at `getmvx.cc/[username]`
- Profile editor with drag-and-drop links, theme picker, and live preview
- 10 built-in themes, custom CSS injection, font picker, and platform widgets
- Analytics dashboard: profile views, link clicks, top links, 30-day trends
- Dynamic Open Graph images per profile
- Pro subscription tier via Stripe
- Waitlist and newsletter signup

## Getting started

```bash
npm install --legacy-peer-deps
npx prisma generate
npm run dev
```

Create a `.env.local` with the required secrets (database URL, NextAuth secret, OAuth keys, Stripe keys, email keys). See `src/lib` for the integrations that read them.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |

## Project structure

```
src/
  app/            # App Router: landing, auth, dashboard, public profiles, API routes
  components/     # Landing, editor, dashboard, analytics, profile, brand
  lib/            # auth, db, stripe, brevo, themes
prisma/           # schema, migrations, seed
email-worker/     # Cloudflare email worker
```
