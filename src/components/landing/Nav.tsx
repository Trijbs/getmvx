"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { EggLogo } from "@/components/brand/EggLogo";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Customize", href: "#customize" },
  { label: "Pricing", href: "#pricing" },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/85 px-[5%] backdrop-blur-xl" aria-label="Main navigation">
      <Link href="/" className="flex items-center gap-3" aria-label="MVX Home">
        <EggLogo size={32} />
        <span className="font-[family-name:var(--font-display)] text-[18px] font-700 tracking-[0.08em] uppercase text-[var(--text)]">
          GETMV<span className="text-[var(--accent)]">X</span>
        </span>
      </Link>

      <ul className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
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
          className="hidden rounded-lg border border-[var(--border2)] bg-transparent px-[18px] py-2 text-sm font-500 text-[var(--muted)] transition-all hover:border-white/25 hover:text-[var(--text)] sm:inline-block"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
        >
          Get started free
        </Link>

        <button
          className="ml-1 flex items-center justify-center rounded-lg p-2 text-[var(--text)] md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 right-0 border-b border-[var(--border)] bg-[var(--bg)] px-[5%] py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 text-sm font-500 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2.5 text-sm font-500 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
