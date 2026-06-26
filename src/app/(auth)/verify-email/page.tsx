import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; email?: string }>;
}) {
  const params = await searchParams;
  const isSuccess = params.success === "1";
  const isExpired = params.error === "expired";
  const isInvalid = params.error === "invalid";
  const email = params.email;

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

        {isSuccess && (
          <>
            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--green)]/10">
              <svg
                className="h-8 w-8 text-[var(--green)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-[28px] font-700 text-[var(--text)]">
              Email verified!
            </h1>
            <p className="mb-8 text-sm text-[var(--muted)]">
              Your account is active. Sign in to set up your profile.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-[10px] bg-[var(--accent)] px-8 py-3 text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
            >
              Sign in
            </Link>
          </>
        )}

        {isExpired && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--red)]/10">
              <svg
                className="h-8 w-8 text-[var(--red)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-[28px] font-700 text-[var(--text)]">
              Link expired
            </h1>
            <p className="mb-8 text-sm text-[var(--muted)]">
              This verification link has expired. Register again to get a new one.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-[10px] bg-[var(--accent)] px-8 py-3 text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
            >
              Register again
            </Link>
          </>
        )}

        {isInvalid && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--red)]/10">
              <svg
                className="h-8 w-8 text-[var(--red)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-[28px] font-700 text-[var(--text)]">
              Invalid link
            </h1>
            <p className="mb-8 text-sm text-[var(--muted)]">
              This verification link is invalid or has already been used.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-[10px] bg-[var(--accent)] px-8 py-3 text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
            >
              Sign in
            </Link>
          </>
        )}

        {!isSuccess && !isExpired && !isInvalid && (
          <>
            <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-[28px] font-700 text-[var(--text)]">
              Verifying...
            </h1>
            <p className="text-sm text-[var(--muted)]">Please wait.</p>
          </>
        )}
      </div>
    </div>
  );
}
