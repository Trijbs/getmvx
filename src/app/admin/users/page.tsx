import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 20;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdmin();
  const { q = "", page: pageParam = "1" } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { id: q },
          {
            profile: {
              username: { contains: q, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        email: true,
        emailVerified: true,
        role: true,
        suspendedAt: true,
        createdAt: true,
        badges: { where: { type: "PRO" }, select: { id: true } },
        profile: { select: { username: true, viewCount: true } },
      },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Users <span className="text-base font-normal opacity-60">({total})</span>
        </h1>
        <form className="flex gap-2" action="/admin/users">
          <input
            name="q"
            defaultValue={q}
            placeholder="email, username, or id"
            className="rounded-md border border-[color:var(--border,rgba(255,255,255,0.15))] bg-transparent px-3 py-1.5 text-sm"
          />
          <button className="rounded-md border border-[color:var(--border,rgba(255,255,255,0.15))] px-3 py-1.5 text-sm">
            Search
          </button>
        </form>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide opacity-60">
            <th className="py-2">Email</th>
            <th className="py-2">Username</th>
            <th className="py-2">Role</th>
            <th className="py-2">Status</th>
            <th className="py-2 text-right">Views</th>
            <th className="py-2 text-right">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b border-[color:var(--border,rgba(255,255,255,0.06))]"
            >
              <td className="py-2">
                <Link
                  href={`/admin/users/${u.id}`}
                  className="underline-offset-2 hover:underline"
                >
                  {u.email}
                </Link>
                {!u.emailVerified && (
                  <span className="ml-2 text-xs opacity-50">unverified</span>
                )}
                {u.badges.length > 0 && (
                  <span className="ml-2 rounded bg-[color:rgba(155,126,248,0.2)] px-1.5 text-xs">
                    PRO
                  </span>
                )}
              </td>
              <td className="py-2 opacity-80">
                {u.profile ? `/${u.profile.username}` : "—"}
              </td>
              <td className="py-2 opacity-80">{u.role}</td>
              <td className="py-2">
                {u.suspendedAt ? (
                  <span className="text-red-400">suspended</span>
                ) : (
                  <span className="opacity-60">active</span>
                )}
              </td>
              <td className="py-2 text-right tabular-nums opacity-80">
                {u.profile?.viewCount ?? 0}
              </td>
              <td className="py-2 text-right tabular-nums opacity-60">
                {u.createdAt.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td className="py-3 opacity-50" colSpan={6}>
                No users match
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pages > 1 && (
        <div className="mt-4 flex gap-3 text-sm">
          {page > 1 && (
            <Link
              className="underline"
              href={`/admin/users?q=${encodeURIComponent(q)}&page=${page - 1}`}
            >
              ← Prev
            </Link>
          )}
          <span className="opacity-60">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link
              className="underline"
              href={`/admin/users?q=${encodeURIComponent(q)}&page=${page + 1}`}
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
