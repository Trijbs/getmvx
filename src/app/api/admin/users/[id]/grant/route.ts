import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, audit } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";

type Ctx = { params: Promise<{ id: string }> };

/** Manually grant or revoke Pro. Writes both the display badge and the
 *  first-class proSince/proUntil fields (Phase 4 reconciles these against
 *  Gumroad, so manual grants stay visible in the drift report). */
export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await requireAdminApi();
  if (!session) return new NextResponse(null, { status: 404 });
  const rl = await rateLimit(`admin-mutate:${session.user.id}`, 30, 60);
  if (!rl.success)
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const { id } = await params;
  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { pro?: boolean } | null;
  if (typeof body?.pro !== "boolean")
    return NextResponse.json({ error: "Missing pro flag" }, { status: 400 });

  if (body.pro) {
    const existing = await prisma.badge.findFirst({
      where: { userId: id, type: "PRO" },
    });
    if (!existing) {
      await prisma.badge.create({
        data: { userId: id, type: "PRO", label: "Pro" },
      });
    }
    await prisma.user.update({
      where: { id },
      data: { proSince: new Date(), proUntil: null },
    });
  } else {
    await prisma.badge.deleteMany({ where: { userId: id, type: "PRO" } });
    await prisma.user.update({
      where: { id },
      data: { proUntil: new Date() },
    });
  }

  await audit(
    session.user.id,
    body.pro ? "user.grant_pro" : "user.revoke_pro",
    { type: "user", id },
    { manual: true }
  );
  return NextResponse.json({ ok: true });
}
