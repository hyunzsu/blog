import { siteConfig } from "@/shared/config/site";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-[720px] px-6 py-8">
        <p className="text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} {siteConfig.author}
        </p>
      </div>
    </footer>
  );
}
