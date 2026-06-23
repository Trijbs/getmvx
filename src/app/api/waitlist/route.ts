import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    // Send confirmation email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "MVX <hello@getmvx.cc>",
            to: email,
            subject: "You're on the MVX waitlist!",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="font-size: 24px; margin-bottom: 16px;">You're in!</h1>
                <p style="color: #666; line-height: 1.6;">
                  Thanks for joining the MVX waitlist. We're building the most customizable
                  link-in-bio platform, and you'll be the first to know when we launch.
                </p>
                <p style="color: #666; line-height: 1.6;">
                  As an early adopter, you'll get a special badge on your profile when you sign up.
                </p>
                <p style="color: #999; font-size: 14px; margin-top: 32px;">
                  — The MVX Team
                </p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      {
        message: "You're on the waitlist!",
        id: signup.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
