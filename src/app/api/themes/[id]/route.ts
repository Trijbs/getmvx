import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify theme belongs to user
    const theme = await prisma.theme.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const body = (await req.json()) as { config?: Record<string, string> };

    if (!body.config || typeof body.config !== "object") {
      return NextResponse.json({ error: "config is required" }, { status: 400 });
    }

    // Merge partial config update into the existing config
    const currentConfig = (theme.config as Record<string, string>) ?? {};
    const updatedConfig = { ...currentConfig, ...body.config };

    const updated = await prisma.theme.update({
      where: { id },
      data: { config: updatedConfig },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update theme error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
