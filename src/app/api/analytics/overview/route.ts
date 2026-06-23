import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get totals
    const [totalViews, totalClicks, recentViews, recentClicks] =
      await Promise.all([
        prisma.analyticsEvent.count({
          where: { profileId: profile.id, type: "VIEW" },
        }),
        prisma.analyticsEvent.count({
          where: { profileId: profile.id, type: "CLICK" },
        }),
        prisma.analyticsEvent.count({
          where: {
            profileId: profile.id,
            type: "VIEW",
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
        prisma.analyticsEvent.count({
          where: {
            profileId: profile.id,
            type: "CLICK",
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
      ]);

    // Get daily views for last 30 days
    const dailyViews = await prisma.$queryRaw<
      { date: string; count: bigint }[]
    >`
      SELECT 
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date,
        COUNT(*)::bigint as count
      FROM "AnalyticsEvent"
      WHERE "profileId" = ${profile.id}
        AND type = 'VIEW'
        AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get daily clicks for last 30 days
    const dailyClicks = await prisma.$queryRaw<
      { date: string; count: bigint }[]
    >`
      SELECT 
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date,
        COUNT(*)::bigint as count
      FROM "AnalyticsEvent"
      WHERE "profileId" = ${profile.id}
        AND type = 'CLICK'
        AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get top links
    const topLinks = await prisma.link.findMany({
      where: { profileId: profile.id },
      orderBy: { clickCount: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        url: true,
        icon: true,
        clickCount: true,
      },
    });

    // Get recent events
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        type: true,
        createdAt: true,
        country: true,
        device: true,
      },
    });

    return NextResponse.json({
      totals: {
        views: totalViews,
        clicks: totalClicks,
        viewsLast30Days: recentViews,
        clicksLast30Days: recentClicks,
      },
      dailyViews: dailyViews.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
      dailyClicks: dailyClicks.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
      topLinks,
      recentEvents,
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
