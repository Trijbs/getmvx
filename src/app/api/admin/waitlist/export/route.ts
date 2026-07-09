import { NextResponse } from "next/server";
import { requireAdmin, audit } from "@/lib/admin";
import { getWaitlist } from "@/lib/metrics";

function csvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export async function GET() {
  // requireAdmin() signals denial via notFound(), which is a rendering
  // concept — in a route handler we translate any failure (including a DB
  // outage mid-check) into a plain 404. Fail closed, reveal nothing.
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  const signups = await getWaitlist();
  await audit(session.user.id, "waitlist.exported", {
    type: "route",
    id: "/api/admin/waitlist/export",
  });

  const rows = [
    "email,role,createdAt",
    ...signups.map((s) =>
      [
        csvField(s.email),
        csvField(s.role ?? ""),
        s.createdAt.toISOString(),
      ].join(",")
    ),
  ];

  return new NextResponse(rows.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mvx-waitlist-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
