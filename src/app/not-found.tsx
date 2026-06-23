import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-barlow)] text-[80px] font-800 leading-none text-[var(--accent)]">
          404
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          This page doesn&apos;t exist
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The profile you&apos;re looking for might have been removed or doesn&apos;t
          exist yet.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
          >
            Go home
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-[var(--border2)] px-6 py-2.5 text-sm font-500 text-[var(--text)] transition-all hover:bg-[var(--bg3)]"
          >
            Create your page
          </Link>
        </div>
      </div>
    </div>
  );
}
