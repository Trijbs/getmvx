import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeCustomCss } from "@/lib/sanitize";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      bio?: string;
      themeId?: string;
      customCss?: string;
      layoutType?: string;
      isPublic?: boolean;
    };
    const { bio, themeId, customCss, layoutType } = body;

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
