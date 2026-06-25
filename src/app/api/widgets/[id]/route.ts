import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const widget = await prisma.widget.findFirst({
    where: { id, profileId: profile.id },
  });
  if (!widget) {
    return NextResponse.json({ error: "Widget not found" }, { status: 404 });
  }

  const body = (await req.json()) as {
    enabled?: boolean;
    config?: Record<string, string>;
    position?: number;
  };

  const updated = await prisma.widget.update({
    where: { id },
    data: {
      ...(body.enabled !== undefined && { enabled: body.enabled }),
      ...(body.config !== undefined && { config: body.config }),
      ...(body.position !== undefined && { position: body.position }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const widget = await prisma.widget.findFirst({
    where: { id, profileId: profile.id },
  });
  if (!widget) {
    return NextResponse.json({ error: "Widget not found" }, { status: 404 });
  }

  await prisma.widget.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
