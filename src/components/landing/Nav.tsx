"use client";

import Link from "next/link";
import { LogoMark } from "@/components/brand";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/85 px-[5%] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <LogoMark size={32} />
        <span className="font-[family-name:var(--font-display)] text-[18px] font-700 tracking-[0.08em] uppercase text-[var(--text)]">
          GETMV<span className="text-[var(--accent)]">X</span>
        </span>
      </Link>

      <ul className="hidden items-center gap-8 md:flex">
        {[
          { label: "Features", href: "#features" },
          { label: "Customize", href: "#customize" },
          { label: "Pricing", href: "#pricing" },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm font-500 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="rounded-lg border border-[var(--border2)] bg-transparent px-[18px] py-2 text-sm font-500 text-[var(--muted)] transition-all hover:border-white/25 hover:text-[var(--text)]"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}
