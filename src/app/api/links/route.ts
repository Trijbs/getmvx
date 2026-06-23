import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url, icon, profileId, position } = (await req.json()) as {
      title: string;
      url: string;
      icon?: string;
      profileId: string;
      position?: number;
    };

    if (!title || !url || !profileId) {
      return NextResponse.json(
        { error: "Title, URL, and profileId are required" },
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
