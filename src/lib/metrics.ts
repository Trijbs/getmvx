import { prisma } from "@/lib/db";

/**
 * Platform-wide aggregate queries for the admin console (ADMIN_PLAN.md
 * Phase 3). Server-only; every caller sits behind requireAdmin().
 */

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

export interface OverviewMetrics {
  totalUsers: number;
  verifiedUsers: number;
  totalProfiles: number;
  publicProfiles: number;
  proUsers: number;
  waitlistCount: number;
  signupsLast7Days: number;
  signupsLast30Days: number;
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  const [
    totalUsers,
    verifiedUsers,
    totalProfiles,
    publicProfiles,
    proUsers,
    waitlistCount,
    signupsLast7Days,
    signupsLast30Days,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: { not: null } } }),
    prisma.profile.count(),
    prisma.profile.count({ where: { isPublic: true } }),
    // Pro is currently expressed as a PRO badge (written by the Gumroad
    // webhook); Phase 4 moves this to User.proSince/proUntil.
    prisma.badge.count({ where: { type: "PRO" } }),
    prisma.waitlistSignup.count(),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(30) } } }),
  ]);

  return {
    totalUsers,
    verifiedUsers,
    totalProfiles,
    publicProfiles,
    proUsers,
    waitlistCount,
    signupsLast7Days,
    signupsLast30Days,
  };
}

export interface DailyPoint {
  date: string;
  signups: number;
  views: number;
  clicks: number;
}

/** Signups, profile views, and link clicks per day for the last `days` days. */
export async function getDailySeries(days = 30): Promise<DailyPoint[]> {
  const since = daysAgo(days);

  const [signups, events] = await Promise.all([
    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') AS date,
             COUNT(*)::bigint AS count
      FROM "User"
      WHERE "createdAt" >= ${since}
      GROUP BY 1 ORDER BY 1
    `,
    prisma.$queryRaw<{ date: string; type: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') AS date,
             type,
             COUNT(*)::bigint AS count
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since}
      GROUP BY 1, 2 ORDER BY 1
    `,
  ]);

  // Dense series: every day appears even when empty, so charts don't skip.
  const byDate = new Map<string, DailyPoint>();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * DAY_MS).toISOString().slice(0, 10);
    byDate.set(date, { date, signups: 0, views: 0, clicks: 0 });
  }
  for (const row of signups) {
    const point = byDate.get(row.date);
    if (point) point.signups = Number(row.count);
  }
  for (const row of events) {
    const point = byDate.get(row.date);
    if (!point) continue;
    if (row.type === "VIEW") point.views = Number(row.count);
    if (row.type === "CLICK") point.clicks = Number(row.count);
  }
  return [...byDate.values()];
}

export async function getTopProfiles(limit = 10) {
  return prisma.profile.findMany({
    orderBy: { viewCount: "desc" },
    take: limit,
    select: {
      id: true,
      username: true,
      viewCount: true,
      isPublic: true,
      user: { select: { email: true } },
    },
  });
}

export async function getTopLinks(limit = 10) {
  return prisma.link.findMany({
    orderBy: { clickCount: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      url: true,
      clickCount: true,
      profile: { select: { username: true } },
    },
  });
}

export async function getWaitlist() {
  return prisma.waitlistSignup.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, role: true, createdAt: true },
  });
}
