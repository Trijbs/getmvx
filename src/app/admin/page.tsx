import Link from "next/link";
import { requireAdmin, audit } from "@/lib/admin";
import { getOverviewMetrics } from "@/lib/metrics";

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--border,rgba(255,255,255,0.08))] p-4">
      <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs opacity-50">{hint}</p> : null}
    </div>
  );
}

export default async function AdminOverviewPage() {
  // The layout already gated this render, but every admin page re-asserts —
  // defence in depth, and layouts don't re-run on soft navigation.
  const session = await requireAdmin();
  const m = await getOverviewMetrics();

  await audit(session.user.id, "admin.overview_viewed", {
    type: "route",
    id: "/admin",
  });

  const pct = (part: number, whole: number) =>
    whole === 0 ? "–" : `${Math.round((part / whole) * 100)}%`;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile
          label="Users"
          value={String(m.totalUsers)}
          hint={`${pct(m.verifiedUsers, m.totalUsers)} verified`}
        />
        <Tile
          label="Public profiles"
          value={String(m.publicProfiles)}
          hint={`${m.totalProfiles} total`}
        />
        <Tile
          label="Pro"
          value={String(m.proUsers)}
          hint={`${pct(m.proUsers, m.totalUsers)} conversion`}
        />
        <Tile label="Waitlist" value={String(m.waitlistCount)} />
        <Tile label="Signups · 7d" value={String(m.signupsLast7Days)} />
        <Tile label="Signups · 30d" value={String(m.signupsLast30Days)} />
      </div>

      <div className="mt-8 flex gap-4 text-sm">
        <Link className="underline opacity-80 hover:opacity-100" href="/admin/metrics">
          Trends & top lists →
        </Link>
        <Link className="underline opacity-80 hover:opacity-100" href="/admin/waitlist">
          Waitlist →
        </Link>
      </div>
    </div>
  );
}
