import { homepageContent } from "@/content/homepage";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1180px,calc(100vw-2rem))] items-center justify-between py-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="font-display text-xl tracking-tight text-ink">{homepageContent.nav.logo}</span>
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sky via-clay to-honey transition-transform duration-300 group-hover:scale-110" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-muted">
          <Link
            href={homepageContent.nav.primary.href}
            className="rounded-full border border-line px-4 py-2 transition-colors hover:border-ink/20 hover:bg-ink/5 hover:text-ink"
          >
            {homepageContent.nav.primary.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
