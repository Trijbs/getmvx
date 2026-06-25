import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPresignedPutUrl } from "@/lib/r2";

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

  // Validate content type from request body. The extension is derived from the
  // (whitelisted) content type — never from client input — so it can't smuggle
  // unexpected characters into the storage key.
  const body = (await req.json()) as { contentType?: string };
  const EXT_BY_TYPE: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const contentType = body.contentType ?? "image/jpeg";
  const ext = EXT_BY_TYPE[contentType];
  if (!ext) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const key = `avatars/${profile.id}.${ext}`;

  const r2Configured =
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY;

  if (!r2Configured) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 503 }
    );
  }

  const { uploadUrl, publicUrl } = getPresignedPutUrl(key, contentType);
  return NextResponse.json({ uploadUrl, publicUrl });
}
