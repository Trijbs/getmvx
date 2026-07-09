import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

// The admin surface must never be indexed or discoverable.
export const metadata: Metadata = {
  title: "MVX Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative gate: 404s for anyone who isn't a live, unsuspended ADMIN
  // (session → role claim → DB re-check → IP allowlist). See src/lib/admin.ts.
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="flex items-center gap-6 border-b border-[color:var(--border,rgba(255,255,255,0.08))] px-6 py-4">
        <span className="font-semibold tracking-wide">MVX Admin</span>
        <nav className="flex gap-4 text-sm opacity-80">
          <Link className="hover:opacity-100" href="/admin">
            Overview
          </Link>
          <Link className="hover:opacity-100" href="/admin/users">
            Users
          </Link>
          <Link className="hover:opacity-100" href="/admin/metrics">
            Metrics
          </Link>
          <Link className="hover:opacity-100" href="/admin/waitlist">
            Waitlist
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-8">{children}</main>
    </div>
  );
}
