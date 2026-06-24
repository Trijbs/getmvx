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
    const body = (await req.json()) as Record<string, unknown>;

    // Verify link belongs to user
    const link = await prisma.link.findFirst({
      where: {
        id,
        profile: { userId: session.user.id },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Whitelist updatable fields — never trust the raw body. This prevents
    // mass-assignment of protected columns (profileId, clickCount, id).
    const data: {
      title?: string;
      url?: string;
      icon?: string | null;
      position?: number;
      isActive?: boolean;
      groupId?: string | null;
    } = {};
    if (typeof body.title === "string") data.title = body.title;
    if (typeof body.url === "string") data.url = body.url;
    if (typeof body.icon === "string" || body.icon === null)
      data.icon = body.icon as string | null;
    if (typeof body.position === "number") data.position = body.position;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.groupId === "string" || body.groupId === null)
      data.groupId = body.groupId as string | null;

    const updated = await prisma.link.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update link error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify link belongs to user
    const link = await prisma.link.findFirst({
      where: {
        id,
        profile: { userId: session.user.id },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
