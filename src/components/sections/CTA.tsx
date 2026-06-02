import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)]">
      {/* Decorative elements */}
      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-gradient-to-r from-honey/8 to-transparent blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gradient-to-l from-sky/8 to-transparent blur-3xl" />

      <div
        data-reveal
        className="mx-auto w-[min(1180px,calc(100vw-2rem))] rounded-[2.25rem] border border-line/50 bg-gradient-to-br from-[#FCFBF9] via-[#F7F5F2] to-[#F3EDE4] p-8 sm:p-10 lg:p-14 backdrop-blur-sm"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.finalCta.eyebrow}</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
          {homepageContent.finalCta.title}
        </h2>
        <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{homepageContent.finalCta.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/products">{homepageContent.finalCta.primaryCta}</ButtonLink>
          <Link
            href="#top"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/5"
          >
            {homepageContent.finalCta.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

