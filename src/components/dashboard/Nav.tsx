"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Icon } from "@/components/brand";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "tasks" },
  { href: "/editor", label: "Editor", icon: "design" },
  { href: "/analytics", label: "Analytics", icon: "analysis" },
  { href: "/settings", label: "Settings", icon: "settings" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-[220px] flex-col border-r border-[var(--border)] bg-[var(--bg2)] max-lg:hidden">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex h-16 items-center border-b border-[var(--border)] px-5 font-[family-name:var(--font-barlow)] text-xl font-800 text-[var(--text)]"
      >
        mv<span className="text-[var(--accent)]">x</span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-500 transition-all ${
                  isActive
                    ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
                }`}
              >
                <Icon name={item.icon} size={18} variant="stroke" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Profile link + sign out */}
      <div className="border-t border-[var(--border)] p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-500 text-[var(--muted)] transition-all hover:bg-[var(--bg3)] hover:text-[var(--text)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--border)] bg-[var(--bg2)] lg:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-500 transition-all ${
              isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            <Icon name={item.icon} size={20} variant="stroke" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
