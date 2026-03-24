/**
 * @layer shared
 * @domain-free true
 *
 * Zero-domain UI primitive: reads only `siteConfig` (a plain string object
 * from shared/config). No imports from entities/ or features/.
 * Compile-time guarantee: this file must never import domain types.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/shared/config";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-200">
      <nav className="max-w-content mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <ul className="flex gap-6">
          {siteConfig.nav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm transition-colors hover:text-neutral-900 ${
                    isActive
                      ? "font-medium text-neutral-900"
                      : "text-neutral-600"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
