import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { UserActions } from "@/components/admin/UserActions";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      role: true,
      suspendedAt: true,
      suspendedReason: true,
      adminNote: true,
      proSince: true,
      proUntil: true,
      accounts: { select: { provider: true } },
      badges: { select: { id: true, type: true, label: true } },
      profile: {
        select: {
          username: true,
          bio: true,
          isPublic: true,
          viewCount: true,
          customCss: true,
          links: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              url: true,
              isActive: true,
              clickCount: true,
            },
          },
        },
      },
    },
  });
  if (!user) notFound();

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const isPro = user.badges.some((b) => b.type === "PRO");

  return (
    <div>
      <h1 className="text-2xl font-semibold">{user.email}</h1>
      <p className="mt-1 text-xs opacity-50">{user.id}</p>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <section>
            <h2 className="text-sm font-medium opacity-70">Identity</h2>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <dt className="opacity-60">Name</dt>
              <dd>{user.name ?? "—"}</dd>
              <dt className="opacity-60">Verified</dt>
              <dd>{user.emailVerified ? "yes" : "no"}</dd>
              <dt className="opacity-60">Joined</dt>
              <dd>{user.createdAt.toISOString().slice(0, 10)}</dd>
              <dt className="opacity-60">Auth providers</dt>
              <dd>
                {user.accounts.length > 0
                  ? user.accounts.map((a) => a.provider).join(", ")
                  : "credentials"}
              </dd>
              <dt className="opacity-60">Role</dt>
              <dd>{user.role}</dd>
              <dt className="opacity-60">Pro</dt>
              <dd>
                {isPro ? "yes" : "no"}
                {user.proSince &&
                  ` (since ${user.proSince.toISOString().slice(0, 10)})`}
              </dd>
              <dt className="opacity-60">Status</dt>
              <dd>
                {user.suspendedAt
                  ? `suspended — ${user.suspendedReason ?? "no reason"}`
                  : "active"}
              </dd>
            </dl>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-medium opacity-70">Profile</h2>
            {user.profile ? (
              <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <dt className="opacity-60">Username</dt>
                <dd>
                  <a
                    href={`/${user.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    /{user.profile.username}
                  </a>
                </dd>
                <dt className="opacity-60">Visibility</dt>
                <dd>{user.profile.isPublic ? "public" : "unpublished"}</dd>
                <dt className="opacity-60">Views</dt>
                <dd className="tabular-nums">{user.profile.viewCount}</dd>
                <dt className="opacity-60">Custom CSS</dt>
                <dd>
                  {user.profile.customCss
                    ? `${user.profile.customCss.length} chars`
                    : "none"}
                </dd>
                <dt className="opacity-60">Bio</dt>
                <dd className="col-span-1">{user.profile.bio ?? "—"}</dd>
              </dl>
            ) : (
              <p className="mt-2 text-sm opacity-50">No profile (not onboarded)</p>
            )}
          </section>

          {user.profile && user.profile.links.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-medium opacity-70">
                Links ({user.profile.links.length})
              </h2>
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {user.profile.links.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-[color:var(--border,rgba(255,255,255,0.06))]"
                    >
                      <td className="max-w-[260px] truncate py-1.5" title={l.url}>
                        {l.title}
                        {!l.isActive && (
                          <span className="ml-2 text-xs opacity-50">
                            inactive
                          </span>
                        )}
                      </td>
                      <td className="max-w-[220px] truncate py-1.5 text-xs opacity-50">
                        {l.url}
                      </td>
                      <td className="py-1.5 text-right tabular-nums opacity-70">
                        {l.clickCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>

        <UserActions
          user={{
            id: user.id,
            email: user.email,
            role: user.role,
            suspended: Boolean(user.suspendedAt),
            isPro,
            adminNote: user.adminNote,
            username: user.profile?.username ?? null,
            isPublic: user.profile?.isPublic ?? false,
          }}
          isSelf={session.user.id === user.id}
          isLastAdmin={user.role === "ADMIN" && adminCount <= 1}
        />
      </div>
    </div>
  );
}
