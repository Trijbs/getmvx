import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
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
