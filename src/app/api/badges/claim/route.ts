import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { isValidEgg } from "@/lib/eggs";

const BADGE_LABELS: Record<string, string> = {
  dev: "Hidden Hunter",
  seasonal: "Hidden Hunter",
  logo: "Hidden Hunter",
  hunter: "Hidden Hunter",
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await rateLimit(`badge:${session.user.id}`, 10, 60);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await req.json()) as { egg?: string };
    const egg = body?.egg;

    if (!egg || typeof egg !== "string") {
      return NextResponse.json({ error: "Missing egg id" }, { status: 400 });
    }

    // Accept the "hunter" composite claim and all individual egg ids.
    if (egg !== "hunter" && !isValidEgg(egg)) {
      return NextResponse.json({ error: "Unknown egg" }, { status: 400 });
    }

    // Check if user already has an EASTER badge.
    const existing = await prisma.badge.findFirst({
      where: { userId: session.user.id, type: "EASTER" },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Badge already granted" },
        { status: 409 }
      );
    }

    const badge = await prisma.badge.create({
      data: {
        userId: session.user.id,
        type: "EASTER",
        label: BADGE_LABELS[egg] ?? "Hidden Hunter",
      },
    });

    return NextResponse.json(badge);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
