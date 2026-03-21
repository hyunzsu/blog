import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

export function Header() {
  return (
    <header className="border-b border-neutral-200">
      <nav className="mx-auto flex max-w-[720px] items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <ul className="flex gap-6">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
