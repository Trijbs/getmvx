import { requireAdmin, audit } from "@/lib/admin";

export default async function AdminOverviewPage() {
  // The layout already gated this render, but every admin page re-asserts —
  // defence in depth, and layouts don't re-run on soft navigation.
  const session = await requireAdmin();

  // Phase 0 smoke action: prove the audit pipeline works end to end.
  await audit(session.user.id, "admin.overview_viewed", {
    type: "route",
    id: "/admin",
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-2 text-sm opacity-70">
        Admin console Phase 0 — access gate and audit log are live. Users,
        moderation, metrics, and billing land in Phases 1–4 (see
        ADMIN_PLAN.md).
      </p>
      <p className="mt-4 text-xs opacity-50">
        Signed in as {session.user.email} · this view was written to the audit
        log.
      </p>
    </div>
  );
}
