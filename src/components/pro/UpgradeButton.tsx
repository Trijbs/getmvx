"use client";

type Props = {
  userId: string;
  email: string;
  className?: string;
};

export function UpgradeButton({ userId, email, className }: Props) {
  const base = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL;

  if (!base) return null;

  const checkoutUrl =
    `${base}?wanted=true` +
    `&email=${encodeURIComponent(email)}` +
    `&user_id=${encodeURIComponent(userId)}`;

  return (
    <a
      href={checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
      }
    >
      Upgrade to Pro — €3.99/mo
    </a>
  );
}
