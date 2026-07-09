import { requireAdmin } from "@/lib/admin";
import { getWaitlist } from "@/lib/metrics";

export default async function AdminWaitlistPage() {
  await requireAdmin();
  const signups = await getWaitlist();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Waitlist{" "}
          <span className="text-base font-normal opacity-60">
            ({signups.length})
          </span>
        </h1>
        <a
          href="/api/admin/waitlist/export"
          download
          className="rounded-md border border-[color:var(--border,rgba(255,255,255,0.15))] px-3 py-1.5 text-sm hover:bg-[color:rgba(255,255,255,0.05)]"
        >
          Export CSV
        </a>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide opacity-60">
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Signed up</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((s) => (
            <tr
              key={s.id}
              className="border-b border-[color:var(--border,rgba(255,255,255,0.06))]"
            >
              <td className="py-2">{s.email}</td>
              <td className="py-2 opacity-70">{s.role ?? "–"}</td>
              <td className="py-2 tabular-nums opacity-70">
                {s.createdAt.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
          {signups.length === 0 && (
            <tr>
              <td className="py-3 opacity-50" colSpan={3}>
                No waitlist signups yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
