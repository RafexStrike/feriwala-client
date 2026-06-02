import { homepageContent } from "@/content/homepage";
import { SceneSlot } from "@/components/three/SceneSlot";
import { Reveal } from "@/components/ui/Reveal";

export function Assembly() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/60 py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="order-2 lg:order-1" data-reveal>
          <SceneSlot scene="assembly" fallbackTitle="A calm desk setup forms" className="min-h-[24rem] lg:min-h-[38rem]" />
        </div>
        <div className="order-1 lg:order-2" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.assembly.eyebrow}</p>
          <Reveal>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
              {homepageContent.assembly.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.assembly.description}</p>
          </Reveal>
          <div className="mt-8 space-y-3">
            {homepageContent.assembly.bulletPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-4">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-sky via-clay to-honey" />
                <p className="text-sm leading-7 text-muted">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
