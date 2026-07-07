import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Admin access control & audit (ADMIN_PLAN.md §4–5a).
 *
 * Layered gate — a request must pass every layer:
 *   1. authenticated session
 *   2. role claim on the token (cheap filter)
 *   3. authoritative DB re-check of role + suspension
 *   4. env IP allowlist (primary single-operator control)
 *
 * Failure is always a 404 (`notFound()`), never a 403/redirect, so the
 * surface stays undiscoverable.
 */

export type AdminSession = Session & { user: Session["user"] & { id: string } };

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

export function isModerator(session: Session | null): boolean {
  const role = session?.user?.role;
  return role === "ADMIN" || role === "MODERATOR";
}

/**
 * Parse ADMIN_IP_ALLOWLIST ("ip, ip, ...", exact IPv4/IPv6 matches).
 * Empty/unset = allowlist disabled (all IPs pass). Exported for tests.
 */
export function parseAllowlist(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ipAllowed(ip: string, allowlist: string[]): boolean {
  if (allowlist.length === 0) return true;
  return allowlist.includes(ip);
}

async function requestIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * One-line audit writer. Every mutating admin action calls this; denied
 * authenticated probes of the admin surface do too. Never throws — an audit
 * failure must not turn into an access-control failure, but it is loud.
 */
export async function audit(
  actorId: string,
  action: string,
  target: { type: string; id: string },
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const h = await headers();
    await prisma.adminAuditLog.create({
      data: {
        actorId,
        action,
        targetType: target.type,
        targetId: target.id,
        metadata: JSON.parse(
          JSON.stringify({
            ...metadata,
            ip: await requestIp(),
            userAgent: h.get("user-agent") ?? undefined,
          })
        ),
      },
    });
  } catch (error) {
    console.error("[admin audit] failed to write audit row", {
      action,
      error,
    });
  }
}

/**
 * Authoritative admin gate for every admin page and /api/admin route.
 * Returns the session on success; renders/throws a 404 on any failure.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();

  // Layer 1+2: session exists and carries the role claim.
  if (!session?.user?.id || !isAdmin(session)) {
    // Authenticated non-admins probing /admin are worth a trace; anonymous
    // 404s are not (that's just crawler noise, and unauthenticated writes
    // would let anyone fill the audit table).
    if (session?.user?.id) {
      await audit(session.user.id, "admin.access_denied", {
        type: "route",
        id: "admin",
      });
    }
    notFound();
  }

  // Layer 3: the token is never trusted for privileges — re-read from the DB
  // so demotion/suspension takes effect immediately.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, suspendedAt: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN" || dbUser.suspendedAt) {
    await audit(session.user.id, "admin.access_denied", {
      type: "route",
      id: "admin",
    });
    notFound();
  }

  // Layer 4: env IP allowlist (exact-match list; unset = disabled).
  const allowlist = parseAllowlist(process.env.ADMIN_IP_ALLOWLIST);
  const ip = await requestIp();
  if (!ipAllowed(ip, allowlist)) {
    await audit(session.user.id, "admin.access_denied", {
      type: "route",
      id: "admin",
    });
    notFound();
  }

  // Optional OAuth requirement (ADMIN_REQUIRE_OAUTH=true). Off by default:
  // OAuth sign-ins don't persist User rows yet, so this can only be enabled
  // once OAuth account persistence lands (see ADMIN_PLAN.md §5a review note).
  if (
    process.env.ADMIN_REQUIRE_OAUTH === "true" &&
    session.user.provider === "credentials"
  ) {
    await audit(session.user.id, "admin.access_denied", {
      type: "route",
      id: "admin",
    });
    notFound();
  }

  return session as AdminSession;
}
