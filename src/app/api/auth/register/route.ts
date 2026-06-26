import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { sendTransactionalEmail } from "@/lib/brevo";

function verifyEmailHtml(verifyUrl: string): string {
  return `
  <div style="background:#0c0c0e;padding:40px 20px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;">
      <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-weight:800;font-size:28px;letter-spacing:2px;color:#f0eff4;">
        GETMV<span style="color:#c9a96e;">X</span>
      </div>
      <h1 style="font-size:22px;color:#f0eff4;margin:24px 0 12px;">Verify your email</h1>
      <p style="color:#b8b7c0;line-height:1.7;font-size:15px;">
        Welcome to MVX! Click the button below to verify your email address and activate your account.
        This link expires in 24 hours.
      </p>
      <a href="${verifyUrl}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#c9a96e;color:#0c0c0e;font-weight:700;font-size:15px;border-radius:10px;text-decoration:none;">
        Verify email
      </a>
      <p style="color:#8a8998;font-size:13px;">
        If you didn't create an MVX account, you can safely ignore this email.
      </p>
      <p style="color:#5a5968;font-size:12px;margin-top:24px;font-family:'DM Mono',monospace;">
        getmvx.cc · Your identity, fully yours.
      </p>
    </div>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const rl = await rateLimit(`register:${clientIp(req)}`, 5, 60);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password, name } = (await req.json()) as {
      email: string;
      password: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
    });

    // Default themes are created once during profile setup (the single path all
    // users — credentials and OAuth — take to get a profile), so we don't create
    // them here. Doing both produced duplicate themes for credentials users.

    // Generate email verification token (prefix "verify:" distinguishes from
    // password-reset tokens which use the bare email as identifier).
    const verifyIdentifier = `verify:${email}`;
    await prisma.verificationToken.deleteMany({ where: { identifier: verifyIdentifier } });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: { identifier: verifyIdentifier, token, expires },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://getmvx.cc";
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendTransactionalEmail({
      to: [{ email }],
      subject: "Verify your MVX email",
      htmlContent: verifyEmailHtml(verifyUrl),
      tags: ["email-verification"],
    });

    return NextResponse.json(
      { message: "Account created. Check your email to verify your address." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
