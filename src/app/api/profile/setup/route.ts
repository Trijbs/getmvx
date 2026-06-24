import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultThemes } from "@/lib/themes";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, bio } = (await req.json()) as {
      username: string;
      bio?: string;
    };

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username can only contain lowercase letters, numbers, hyphens, and underscores",
        },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existing = await prisma.profile.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    // Check if user already has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "You already have a profile" },
        { status: 409 }
      );
    }

    // Create default themes for the user
    await prisma.theme.createMany({
      data: defaultThemes.map((theme) => ({
        userId: session.user.id,
        name: theme.name,
        config: theme.config,
        isDefault: theme.name === "Midnight",
      })),
    });

    // Get the default theme
    const midnightTheme = await prisma.theme.findFirst({
      where: { userId: session.user.id, name: "Midnight" },
    });

    // Create the profile
    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        username,
        bio: bio || null,
        themeId: midnightTheme?.id,
      },
    });

    return NextResponse.json(
      {
        profile: {
          id: profile.id,
          username: profile.username,
        },
        message: "Profile created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile setup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
