import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/brevo";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { randomBytes } from "crypto";

function resetEmailHtml(resetUrl: string): string {
  return `
  <div style="background:#0c0c0e;padding:40px 20px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;">
      <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-weight:800;font-size:28px;letter-spacing:2px;color:#f0eff4;">
        GETMV<span style="color:#c9a96e;">X</span>
      </div>
      <h1 style="font-size:22px;color:#f0eff4;margin:24px 0 12px;">Reset your password</h1>
      <p style="color:#b8b7c0;line-height:1.7;font-size:15px;">
        Someone requested a password reset for your MVX account.
        If that was you, click the button below. This link expires in 1 hour.
      </p>
      <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#c9a96e;color:#0c0c0e;font-weight:700;font-size:15px;border-radius:10px;text-decoration:none;">
        Reset password
      </a>
      <p style="color:#8a8998;font-size:13px;">
        If you didn't request this, you can safely ignore this email.
        Your password won't change.
      </p>
      <p style="color:#5a5968;font-size:12px;margin-top:24px;font-family:'DM Mono',monospace;">
        getmvx.cc · Your identity, fully yours.
      </p>
    </div>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const rl = await rateLimit(`forgot-password:${clientIp(req)}`, 3, 300);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = (await req.json()) as { email: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Always return success to avoid leaking which emails are registered.
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    // Delete any existing token for this identifier before creating a new one.
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://getmvx.cc";
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendTransactionalEmail({
      to: [{ email }],
      subject: "Reset your MVX password",
      htmlContent: resetEmailHtml(resetUrl),
      tags: ["password-reset"],
    });

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
