import { homepageContent } from "@/content/homepage";
import { Reveal } from "@/components/ui/Reveal";

export function Editorial() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="max-w-xl" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.editorial.eyebrow}</p>
          <Reveal>
            <blockquote className="mt-5 font-display text-[clamp(2.8rem,5.6vw,5.6rem)] leading-[0.93] tracking-[-0.04em] text-ink">
              {homepageContent.editorial.pullQuote}
            </blockquote>
          </Reveal>
        </div>
        <div className="max-w-2xl" data-reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2.3rem,4.5vw,4rem)] leading-[0.98] tracking-[-0.03em] text-ink">
              {homepageContent.editorial.title}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-[1.02rem] leading-8 text-muted">{homepageContent.editorial.description}</p>
          </Reveal>
          <div className="mt-8 flex h-px w-full bg-line">
            <span className="w-2/5 bg-gradient-to-r from-sky via-clay to-honey" />
          </div>
        </div>
      </div>
    </section>
  );
}
