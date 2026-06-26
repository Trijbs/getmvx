import Link from "next/link";

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-[400px] text-center">
        {/* Logo */}
        <Link
          href="/"
          className="mb-10 block font-[family-name:var(--font-barlow)] text-3xl font-800 text-[var(--text)]"
        >
          mv<span className="text-[var(--accent)]">x</span>
        </Link>

        {/* Envelope icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10">
          <svg
            className="h-8 w-8 text-[var(--accent)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-[28px] font-700 text-[var(--text)]">
          Check your inbox
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
          We sent a verification link to your email address. Click it to activate
          your account — the link expires in 24 hours.
        </p>

        <p className="text-xs text-[var(--muted)]">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <Link
            href="/register"
            className="font-500 text-[var(--accent)] hover:underline"
          >
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
