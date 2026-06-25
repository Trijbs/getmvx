import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
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

  const widgets = await prisma.widget.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" },
  });

  return NextResponse.json(widgets);
}

export async function POST(req: Request) {
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

  const body = (await req.json()) as {
    type: string;
    label: string;
    enabled?: boolean;
    config?: Record<string, string>;
    position?: number;
  };

  const widget = await prisma.widget.create({
    data: {
      profileId: profile.id,
      type: body.type,
      label: body.label,
      enabled: body.enabled ?? true,
      config: body.config ?? {},
      position: body.position ?? 0,
    },
  });

  return NextResponse.json(widget, { status: 201 });
}
