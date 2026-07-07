import type { Metadata } from "next";
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
      <header className="border-b border-[color:var(--border,rgba(255,255,255,0.08))] px-6 py-4">
        <span className="font-semibold tracking-wide">MVX Admin</span>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-8">{children}</main>
    </div>
  );
}
