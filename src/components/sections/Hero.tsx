import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SceneSlot } from "@/components/three/SceneSlot";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-[min(1180px,calc(100vw-2rem))] gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div data-reveal className="max-w-2xl">
          <p data-reveal className="text-xs uppercase tracking-[0.32em] text-muted">
            {homepageContent.hero.eyebrow}
          </p>
          <Reveal>
            <h1 className="mt-5 font-display text-[clamp(3.4rem,8vw,7.2rem)] leading-[0.92] tracking-[-0.05em] text-ink">
              {homepageContent.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[1.04rem] leading-8 text-muted">{homepageContent.hero.description}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products">{homepageContent.hero.primaryCta}</ButtonLink>
              <Link
                href="#universe"
                className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/5"
              >
                {homepageContent.hero.secondaryCta}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-2">
              {homepageContent.hero.meta.map((item) => (
                <span key={item} className="rounded-full border border-line bg-surface/80 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative" data-reveal>
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.65),rgba(244,239,230,0.2)_35%,rgba(244,239,230,0)_72%)]" />
          <SceneSlot scene="floating-universe" fallbackTitle="A floating universe of products" className="min-h-[28rem] lg:min-h-[42rem]" />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 grid gap-3 sm:grid-cols-3">
            {homepageContent.hero.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-line bg-surface/85 p-4 backdrop-blur-sm">
                <p className="font-display text-3xl leading-none text-ink">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
