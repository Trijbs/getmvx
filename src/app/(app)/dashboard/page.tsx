import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  const profile = await prisma.profile.findUnique({
    where: { userId: session!.user!.id },
    include: {
      links: { where: { isActive: true } },
      theme: true,
    },
  });

  if (!profile) {
    return (
      <div>
        <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-2xl font-700">
          Welcome to MVX
        </h1>
        <p className="mb-6 text-[var(--muted)]">
          Set up your profile to get started.
        </p>
        <Link
          href="/onboarding"
          className="inline-block rounded-[10px] bg-[var(--accent)] px-6 py-3 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
        >
          Create your page
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-barlow)] text-2xl font-700">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Welcome back, {session!.user!.name || profile.username}
          </p>
        </div>
        <a
          href={`/${profile.username}`}
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-[var(--border2)] bg-[var(--bg2)] px-4 py-2 text-sm font-500 text-[var(--text)] transition-all hover:bg-[var(--bg3)]"
        >
          View your page ↗
        </a>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <p className="text-xs font-500 text-[var(--muted)]">Total views</p>
          <p className="mt-1 font-[family-name:var(--font-barlow)] text-3xl font-800 text-[var(--accent)]">
            {profile.viewCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <p className="text-xs font-500 text-[var(--muted)]">Active links</p>
          <p className="mt-1 font-[family-name:var(--font-barlow)] text-3xl font-800 text-[var(--accent)]">
            {profile.links.length}
          </p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <p className="text-xs font-500 text-[var(--muted)]">
            Current theme
          </p>
          <p className="mt-1 font-[family-name:var(--font-barlow)] text-3xl font-800 text-[var(--accent)]">
            {profile.theme?.name || "None"}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-sm font-600 text-[var(--muted)]">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/editor"
          className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-4 transition-all hover:bg-[var(--bg3)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-lg">
            ✏️
          </span>
          <div>
            <p className="text-sm font-600">Edit your page</p>
            <p className="text-xs text-[var(--muted)]">
              Add links, change theme, update bio
            </p>
          </div>
        </Link>
        <Link
          href="/analytics"
          className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-4 transition-all hover:bg-[var(--bg3)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-lg">
            📈
          </span>
          <div>
            <p className="text-sm font-600">View analytics</p>
            <p className="text-xs text-[var(--muted)]">
              See who&apos;s visiting your page
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
