import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/ratelimit";

// Generous enough for real visitors, tight enough to blunt scripted inflation.
const CLICK_LIMIT = 30;
const CLICK_WINDOW_SECONDS = 10;

export async function POST(req: Request) {
  try {
    // Throttle per client IP so a script can't pump click counts in a loop.
    const { success } = await rateLimit(
      `click:${clientIp(req)}`,
      CLICK_LIMIT,
      CLICK_WINDOW_SECONDS
    );
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { linkId, profileId } = (await req.json()) as {
      linkId: string;
      profileId: string;
    };

    if (!linkId || !profileId) {
      return NextResponse.json(
        { error: "linkId and profileId are required" },
        { status: 400 }
      );
    }

    // Validate the link exists and actually belongs to the claimed profile, so
    // a caller can't inflate counts for arbitrary links or pollute another
    // profile's analytics with a forged profileId. (Rate limiting still TODO.)
    const link = await prisma.link.findFirst({
      where: { id: linkId, profileId },
      select: { id: true, profileId: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Increment click count and create analytics event
    await Promise.all([
      prisma.link.update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } },
      }),
      prisma.analyticsEvent.create({
        data: {
          profileId: link.profileId,
          linkId: link.id,
          type: "CLICK",
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
