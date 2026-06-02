import { homepageContent } from "@/content/homepage";
import { SceneSlot } from "@/components/three/SceneSlot";

export function Anatomy() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <SceneSlot scene="marketplace-explosion" fallbackTitle="Exploded product anatomy" className="min-h-[24rem] lg:min-h-[38rem]" />
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.anatomy.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.anatomy.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.anatomy.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {homepageContent.anatomy.parts.map((part) => (
              <div key={part} className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">{part}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
