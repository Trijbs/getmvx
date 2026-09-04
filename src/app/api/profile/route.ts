import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeCustomCss } from "@/lib/sanitize";
import { rateLimit } from "@/lib/ratelimit";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await rateLimit(`profile:${session.user.id}`, 30, 60);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await req.json()) as {
      bio?: string;
      themeId?: string;
      customCss?: string;
      layoutType?: string;
      isPublic?: boolean;
      avatarUrl?: string;
    };
    const { bio, themeId, customCss, layoutType, isPublic, avatarUrl } = body;

    // Input validation
    if (bio != null && typeof bio !== "string") {
      return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
    }
    if (bio && bio.length > 500) {
      return NextResponse.json({ error: "Bio must be 500 characters or fewer" }, { status: 400 });
    }
    if (customCss != null && typeof customCss !== "string") {
      return NextResponse.json({ error: "Invalid customCss" }, { status: 400 });
    }
    if (customCss && customCss.length > 50_000) {
      return NextResponse.json({ error: "Custom CSS is too long" }, { status: 400 });
    }
    if (avatarUrl != null && typeof avatarUrl !== "string") {
      return NextResponse.json({ error: "Invalid avatarUrl" }, { status: 400 });
    }
    if (avatarUrl && avatarUrl.length > 2048) {
      return NextResponse.json({ error: "Avatar URL is too long" }, { status: 400 });
    }
    const VALID_LAYOUTS = ["centered", "left-aligned", "grid"];
    if (layoutType != null && !VALID_LAYOUTS.includes(layoutType as string)) {
      return NextResponse.json({ error: "Invalid layout type" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(themeId !== undefined && { themeId }),
        // Neutralize <style>/<script> breakout before storing user CSS.
        ...(customCss !== undefined && {
          customCss: sanitizeCustomCss(customCss),
        }),
        ...(layoutType !== undefined && { layoutType }),
        ...(isPublic !== undefined && { isPublic }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
