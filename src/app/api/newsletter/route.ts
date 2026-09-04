import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createContact, updateContact } from "@/lib/brevo";

const NEWSLETTER_LIST_ID = Number(process.env.BREVO_NEWSLETTER_LIST_ID ?? "0");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body as {
      email: string;
      firstName?: string;
      lastName?: string;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    try {
      await createContact({
        email,
        firstName,
        lastName,
        listIds: NEWSLETTER_LIST_ID ? [NEWSLETTER_LIST_ID] : [],
        updateEnabled: true,
      });
      return NextResponse.json({ success: true, message: "Subscribed successfully" });
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message?.includes("MEMBER_EXISTS_WITH_EMAIL_ADDRESS")) {
        await updateContact(email, {
          firstName,
          lastName,
          listIds: NEWSLETTER_LIST_ID ? [NEWSLETTER_LIST_ID] : [],
        });
        return NextResponse.json({ success: true, message: "Subscribed successfully" });
      }
      throw error;
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Newsletter subscribe error:", err.message);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (email !== session.user.email && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await updateContact(email, {
      attributes: { LIST_EXCLUDE: [NEWSLETTER_LIST_ID] },
    });

    return NextResponse.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Newsletter unsubscribe error:", err.message);
    return NextResponse.json({ error: "Unsubscribe failed" }, { status: 500 });
  }
}
