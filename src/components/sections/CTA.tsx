import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BrandMotif } from "@/components/ui/BrandMotif";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden pb-[clamp(5rem,10vw,9rem)] pt-3">
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2.5rem] border border-line/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.64),rgba(244,239,230,0.85),rgba(255,255,255,0.5))] p-6 sm:p-8 lg:p-12"
        >
          <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-[#37aff5]/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-[#f46764]/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="section-kicker">{homepageContent.finalCta.eyebrow}</p>
              <h2 className="editorial-headline mt-4 text-[clamp(3.1rem,5vw,6rem)] leading-[0.9] text-ink">
                {homepageContent.finalCta.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {homepageContent.finalCta.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/products">{homepageContent.finalCta.primaryCta}</ButtonLink>
                <Link
                  href="#top"
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white/40 px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-white/70"
                >
                  {homepageContent.finalCta.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="flex justify-end">
              <BrandMotif className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

