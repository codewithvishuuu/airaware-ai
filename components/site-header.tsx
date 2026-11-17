"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocationButton } from "./location-button";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assistant", label: "Assistant" },
  { href: "/plan", label: "Daily plan" },
  { href: "/indoor", label: "Indoor" },
  { href: "/impact", label: "Impact" },
  { href: "/insights", label: "Insights" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-ink text-white"
          : "text-ink-soft hover:bg-stone-100 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <g stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M5 8h10" opacity="0.95" />
                  <path d="M5 12h14" opacity="0.7" />
                  <path d="M5 16h7" opacity="0.45" />
                </g>
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight text-ink">AirAware AI</span>
              <span className="hidden text-[11px] text-ink-muted sm:block">
                Understand your air
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                active={pathname === link.href}
              />
            ))}
          </nav>

          <LocationButton />
        </div>

        <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink key={link.href} {...link} active={pathname === link.href} />
          ))}
        </nav>
      </div>
    </header>
  );
}
