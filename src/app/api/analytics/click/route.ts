import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
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

    // Increment click count and create analytics event
    await Promise.all([
      prisma.link.update({
        where: { id: linkId },
        data: { clickCount: { increment: 1 } },
      }),
      prisma.analyticsEvent.create({
        data: {
          profileId,
          linkId,
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
