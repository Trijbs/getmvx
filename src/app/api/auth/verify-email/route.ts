import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const ip = clientIp(req);
  const rl = await rateLimit(`verify-email:${ip}`, 10, 60);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://getmvx.cc";

  if (!token || !email) {
    return NextResponse.redirect(`${baseUrl}/verify-email?error=invalid`);
  }

  const identifier = `verify:${email}`;

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.identifier !== identifier) {
    return NextResponse.redirect(`${baseUrl}/verify-email?error=invalid`);
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.redirect(`${baseUrl}/verify-email?error=expired&email=${encodeURIComponent(email)}`);
  }

  // Mark email as verified and clean up token in one transaction.
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  return NextResponse.redirect(`${baseUrl}/verify-email?success=1`);
}
