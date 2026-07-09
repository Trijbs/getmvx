import { requireAdmin } from "@/lib/admin";
import { getDailySeries, getTopProfiles, getTopLinks } from "@/lib/metrics";
import { AdminTrends } from "@/components/admin/AdminTrends";

export default async function AdminMetricsPage() {
  await requireAdmin();
  const [series, topProfiles, topLinks] = await Promise.all([
    getDailySeries(30),
    getTopProfiles(10),
    getTopLinks(10),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Metrics</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium opacity-70">
          Last 30 days — views · clicks · signups
        </h2>
        <div className="mt-3 rounded-lg border border-[color:var(--border,rgba(255,255,255,0.08))] p-4">
          <AdminTrends data={series} />
        </div>
      </section>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-sm font-medium opacity-70">Top profiles</h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {topProfiles.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[color:var(--border,rgba(255,255,255,0.06))]"
                >
                  <td className="py-2">
                    <a
                      href={`/${p.username}`}
                      className="underline-offset-2 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      /{p.username}
                    </a>
                    {!p.isPublic && (
                      <span className="ml-2 text-xs opacity-50">(private)</span>
                    )}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {p.viewCount} views
                  </td>
                </tr>
              ))}
              {topProfiles.length === 0 && (
                <tr>
                  <td className="py-2 opacity-50">No profiles yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-sm font-medium opacity-70">Top links</h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {topLinks.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-[color:var(--border,rgba(255,255,255,0.06))]"
                >
                  <td className="max-w-[220px] truncate py-2" title={l.url}>
                    {l.title}
                    <span className="ml-2 text-xs opacity-50">
                      /{l.profile.username}
                    </span>
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {l.clickCount} clicks
                  </td>
                </tr>
              ))}
              {topLinks.length === 0 && (
                <tr>
                  <td className="py-2 opacity-50">No links yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
