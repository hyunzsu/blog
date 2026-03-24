/**
 * @layer shared
 * @domain-free true
 *
 * Zero-domain UI primitive: reads only `siteConfig` (a plain string object
 * from shared/config). No imports from entities/ or features/.
 * Compile-time guarantee: this file must never import domain types.
 */
import { siteConfig } from "@/shared/config";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="max-w-content mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <p className="text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} {siteConfig.author}
        </p>
      </div>
    </footer>
  );
}
