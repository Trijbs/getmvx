# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| Latest (`main`) | Yes |

Only the latest deployed version on [getmvx.cc](https://getmvx.cc) is supported with security updates.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue, please report it responsibly:

1. **Email** — send details to **security@getmvx.cc**
2. **Include** — a description of the vulnerability, steps to reproduce, the potential impact, and any suggested fix
3. **What to expect** — acknowledgement within 48 hours, a fix timeline within 7 days for confirmed issues, and credit in the release notes (unless you prefer anonymity)

We ask that you give us reasonable time to address the issue before disclosing it publicly.

## Scope

The following are in scope:

- The getmvx.cc web application (Next.js App Router, all API routes, auth flows)
- The public profile system and editor
- Payment verification (Gumroad webhook, Stripe integration)
- Admin console access controls
- API input validation and rate limiting

The following are **out of scope**:

- Third-party services (Vercel, Cloudflare, Brevo, Gumroad, Upstash, Sentry) — report issues in those services to their respective security teams
- Social engineering attacks against users
- Denial-of-service attacks against infrastructure

## Security Model Overview

For full architectural detail, see [`docs/ARCHITECTURE.md#security-model`](docs/ARCHITECTURE.md#security-model).

Key defenses:

| Layer | Mechanism |
| --- | --- |
| **Authentication** | NextAuth v5 with JWT sessions; credentials, Google, Discord providers |
| **Authorization** | Ownership checks on all mutating routes; admin gate (`requireAdmin()`) with DB role verification on all admin endpoints |
| **Rate limiting** | Per-IP rate limiting on every mutating endpoint via Upstash Redis (fails open if unconfigured) |
| **Input validation** | Length and format validation at API boundary; URL scheme validation (`http`, `https`, `mailto`, `tel`) on link create/update |
| **Output protection** | CSS sanitization on custom themes; HTML escaping in public profiles |
| **Webhook verification** | Gumroad: seller-id gate + sale API confirmation (fails closed); Stripe: webhook secret validation |
| **Security headers** | `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` via `vercel.json` |
| **Monitoring** | Sentry client/edge/server error capture; admin audit log on all privileged actions |
| **Secrets** | All secrets in environment variables; CI builds use dummy placeholders |

## Hardening History

- **September 2026** — Full security overhaul: admin-gated campaigns/newsletter, hardened Stripe checkout, rate limiting on all mutation endpoints, input validation, CSV injection prevention, security headers, ReDoS-safe email validation, removal of debug logging that leaked env values, legacy `/u/` route deleted
- **Pre-launch** — CSS sanitizer, reserved usernames, Gumroad webhook verification, Upstash rate limiting

## Authentication & Session Security

- Passwords are hashed with **bcryptjs** (cost factor 12)
- Sessions are **JWT-only** (no DB session storage); tokens are signed with `NEXTAUTH_SECRET`
- Session tokens use secure cookie attributes (`httpOnly`, `secure`, `sameSite: lax`)
- Email verification required before account is usable
- Rate limited: 5 registration attempts per minute per IP

## API Security

All mutating API routes enforce:

1. **Session check** — unauthenticated requests receive 401
2. **Ownership check** — users can only modify their own resources
3. **Rate limiting** — per-IP via Upstash Redis
4. **Input validation** — field length limits, format checks, URL scheme validation
5. **Output escaping** — all user data is escaped before rendering

Admin routes add a **DB-backed role check** (`requireAdmin()` / `requireAdminApi()`) that verifies the user's `role` column on every request — JWT role claims are never trusted for authorization.

## Dependencies

We use `npm audit` and Dependabot to monitor dependencies for known vulnerabilities. Dependabot PRs are reviewed and merged promptly. The `legacy-peer-deps` flag is not used — peer dependency conflicts are resolved directly.

## Changes to This Policy

This policy will be updated as the project evolves. Changes will be committed to this file and reflected in the repository's commit history.
