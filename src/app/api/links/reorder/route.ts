import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { links } = (await req.json()) as {
      links: { id: string; position: number }[];
    };

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { error: "links array is required" },
        { status: 400 }
      );
    }

    // Update positions in a transaction
    await prisma.$transaction(
      links.map((link: { id: string; position: number }) =>
        prisma.link.update({
          where: { id: link.id },
          data: { position: link.position },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder links error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
