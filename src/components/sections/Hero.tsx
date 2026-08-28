import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import DeskScene3D from "@/components/three/primitives/DeskScene3D"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F5F2] via-[#FCFBF9] to-white">
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
            </div>
          </Reveal>
        </div>

        <div className="relative" data-reveal>
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(107,152,181,0.15),transparent 32%)]" />
          {/* <div className="relative min-h-[28rem] lg:min-h-[42rem] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-surface/30 to-canvas/20 border border-line/30">
            <Image
               src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
              alt="Premium desk setup"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
          </div> */}
            <DeskScene3D />
        </div>
      </div>
    </section>
  );
}
