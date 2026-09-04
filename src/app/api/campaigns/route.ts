import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, audit } from "@/lib/admin";
import { createCampaign, sendCampaign, getCampaigns } from "@/lib/brevo";

const DEFAULT_SENDER = {
  email: "info@getmvx.cc",
  name: "MVX",
};

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const result = await getCampaigns();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Get campaigns error:", err.message);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { name, subject, htmlContent, textContent, listIds, scheduledAt, tags } = body as {
      name: string;
      subject: string;
      htmlContent: string;
      textContent?: string;
      listIds: number[];
      scheduledAt?: string;
      tags?: string[];
    };

    if (!name || !subject || !htmlContent || !listIds?.length) {
      return NextResponse.json(
        { error: "name, subject, htmlContent, and listIds are required" },
        { status: 400 }
      );
    }

    const result = await createCampaign({
      name,
      subject,
      sender: DEFAULT_SENDER,
      htmlContent,
      textContent,
      listIds,
      scheduledAt,
      tags,
    });

    if (!scheduledAt) {
      await sendCampaign(result.campaignId);
    }

    await audit(admin.user.id, "campaign.create", { type: "campaign", id: String(result.campaignId) }, {
      name,
      listIds,
      scheduled: !!scheduledAt,
    });

    return NextResponse.json({
      success: true,
      campaignId: result.campaignId,
      scheduled: !!scheduledAt,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Create campaign error:", err.message);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
