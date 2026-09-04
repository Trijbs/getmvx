import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { isValidLinkUrl } from "@/lib/validate-url";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await rateLimit(`links:${session.user.id}`, 20, 60);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { title, url, icon, profileId, position, label, labelColor } =
      (await req.json()) as {
        title: string;
        url: string;
        icon?: string;
        profileId: string;
        position?: number;
        label?: string;
        labelColor?: string;
      };

    if (!title || !url || !profileId) {
      return NextResponse.json(
        { error: "Title, URL, and profileId are required" },
        { status: 400 }
      );
    }

    if (!isValidLinkUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL. Must start with http://, https://, mailto:, or tel:" },
        { status: 400 }
      );
    }

    // Verify profile belongs to user
    const profile = await prisma.profile.findFirst({
      where: { id: profileId, userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const link = await prisma.link.create({
      data: {
        profileId,
        title,
        url,
        icon: icon || null,
        position: position ?? 0,
        label: label?.trim() ? label.trim() : null,
        labelColor: labelColor || null,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
