import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, audit } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { isReservedUsername } from "@/lib/reserved-usernames";

type Ctx = { params: Promise<{ id: string }> };

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

async function guard(session: { user: { id: string } }) {
  // Per-admin-account limiter on mutations; generous but stops runaway loops.
  const rl = await rateLimit(`admin-mutate:${session.user.id}`, 30, 60);
  return rl.success;
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdminApi();
  if (!session) return new NextResponse(null, { status: 404 });
  if (!(await guard(session)))
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const { id } = await params;
  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, profile: { select: { id: true, username: true } } },
  });
  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body?.action)
    return NextResponse.json({ error: "Missing action" }, { status: 400 });

  switch (body.action) {
    case "suspend": {
      if (target.id === session.user.id)
        return NextResponse.json(
          { error: "You can't suspend yourself" },
          { status: 400 }
        );
      const reason =
        typeof body.reason === "string" && body.reason.trim()
          ? body.reason.trim().slice(0, 500)
          : "unspecified";
      await prisma.user.update({
        where: { id },
        data: { suspendedAt: new Date(), suspendedReason: reason },
      });
      await audit(session.user.id, "user.suspend", { type: "user", id }, { reason });
      break;
    }

    case "unsuspend": {
      await prisma.user.update({
        where: { id },
        data: { suspendedAt: null, suspendedReason: null },
      });
      await audit(session.user.id, "user.unsuspend", { type: "user", id });
      break;
    }

    case "setRole": {
      const role = body.role;
      if (role !== "USER" && role !== "MODERATOR" && role !== "ADMIN")
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      if (target.role === "ADMIN" && role !== "ADMIN") {
        const admins = await prisma.user.count({ where: { role: "ADMIN" } });
        if (admins <= 1)
          return NextResponse.json(
            { error: "Can't demote the last admin" },
            { status: 400 }
          );
      }
      await prisma.user.update({ where: { id }, data: { role } });
      await audit(
        session.user.id,
        "user.set_role",
        { type: "user", id },
        { from: target.role, to: role }
      );
      break;
    }

    case "setNote": {
      const note =
        typeof body.note === "string" ? body.note.slice(0, 5000) : "";
      await prisma.user.update({
        where: { id },
        data: { adminNote: note || null },
      });
      await audit(session.user.id, "user.set_note", { type: "user", id });
      break;
    }

    case "unpublishProfile": {
      if (!target.profile)
        return NextResponse.json({ error: "No profile" }, { status: 400 });
      await prisma.profile.update({
        where: { id: target.profile.id },
        data: { isPublic: false },
      });
      await audit(session.user.id, "profile.unpublish", {
        type: "profile",
        id: target.profile.id,
      });
      break;
    }

    case "resetUsername": {
      if (!target.profile)
        return NextResponse.json({ error: "No profile" }, { status: 400 });
      const username =
        typeof body.username === "string" ? body.username.toLowerCase() : "";
      if (!USERNAME_RE.test(username))
        return NextResponse.json(
          { error: "Invalid username (a-z, 0-9, _, 3-30 chars)" },
          { status: 400 }
        );
      if (isReservedUsername(username))
        return NextResponse.json(
          { error: "Username is reserved" },
          { status: 400 }
        );
      const taken = await prisma.profile.findUnique({ where: { username } });
      if (taken && taken.id !== target.profile.id)
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      await prisma.profile.update({
        where: { id: target.profile.id },
        data: { username },
      });
      await audit(
        session.user.id,
        "profile.reset_username",
        { type: "profile", id: target.profile.id },
        { from: target.profile.username, to: username }
      );
      break;
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await requireAdminApi();
  if (!session) return new NextResponse(null, { status: 404 });
  if (!(await guard(session)))
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const { id } = await params;
  const target = await prisma.user.findUnique({
    where: { id },
    select: { email: true, role: true },
  });
  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Admins are undeletable while privileged: demote first. This also makes
  // "delete the last admin" impossible by construction.
  if (target.role === "ADMIN")
    return NextResponse.json(
      { error: "Demote the admin role before deleting" },
      { status: 400 }
    );

  // Typed confirmation is enforced server-side, not just in the UI.
  const body = (await req.json().catch(() => null)) as { confirm?: string } | null;
  if (body?.confirm !== target.email)
    return NextResponse.json(
      { error: "Confirmation email does not match" },
      { status: 400 }
    );

  await prisma.user.delete({ where: { id } });
  await audit(
    session.user.id,
    "user.delete",
    { type: "user", id },
    { email: target.email }
  );
  return NextResponse.json({ ok: true });
}
