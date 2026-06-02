import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)]">
      <div
        data-reveal
        className="mx-auto w-[min(1180px,calc(100vw-2rem))] rounded-[2.25rem] border border-line bg-[radial-gradient(circle_at_20%_20%,rgba(107,152,181,0.14),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(200,133,123,0.14),transparent_22%),linear-gradient(145deg,#f9f5ef,#f1e7d9)] p-8 sm:p-10 lg:p-14"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.cta.eyebrow}</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
          {homepageContent.cta.title}
        </h2>
        <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{homepageContent.cta.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/products">{homepageContent.cta.primaryCta}</ButtonLink>
          <Link
            href="#top"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/5"
          >
            {homepageContent.cta.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
