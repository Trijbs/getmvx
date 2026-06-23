import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/brevo";

function waitlistEmailHtml(): string {
  return `
  <div style="background:#0c0c0e;padding:40px 20px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;">
      <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-weight:800;font-size:28px;letter-spacing:2px;color:#f0eff4;">
        GETMV<span style="color:#c9a96e;">X</span>
      </div>
      <h1 style="font-size:24px;color:#f0eff4;margin:24px 0 16px;">You're in.</h1>
      <p style="color:#b8b7c0;line-height:1.7;font-size:15px;">
        Thanks for joining the MVX waitlist. We're building the most customizable
        link-in-bio platform, and you'll be first to know when we launch.
      </p>
      <p style="color:#b8b7c0;line-height:1.7;font-size:15px;">
        As an early adopter, you'll get a special badge on your profile when you sign up.
      </p>
      <p style="color:#8a8998;font-size:13px;margin-top:32px;">— The MVX Team</p>
      <p style="color:#5a5968;font-size:12px;margin-top:24px;font-family:'DM Mono',monospace;">
        getmvx.cc · Your identity, fully yours.
      </p>
    </div>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const { email, role } = (await req.json()) as {
      email: string;
      role?: string;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if already signed up
    const existing = await prisma.waitlistSignup.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Store signup
    const signup = await prisma.waitlistSignup.create({
      data: {
        email,
        role: role || null,
      },
    });

    // Send confirmation email via Brevo (non-blocking — never fail the signup)
    if (process.env.BREVO_API_KEY) {
      try {
        await sendTransactionalEmail({
          to: [{ email }],
          subject: "You're on the MVX waitlist!",
          htmlContent: waitlistEmailHtml(),
          tags: ["waitlist-confirmation"],
        });
      } catch (emailError: unknown) {
        const message =
          emailError instanceof Error ? emailError.message : "unknown error";
        console.error("Failed to send waitlist confirmation email:", message);
      }
    }

    return NextResponse.json(
      {
        message: "You're on the waitlist!",
        id: signup.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error("Waitlist signup error:", message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
