import { homepageContent } from "@/content/homepage";
import { SceneSlot } from "@/components/three/SceneSlot";

export function Universe() {
  return (
    <section id="universe" className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.universe.eyebrow}</p>
          <h2 className="mt-4 max-w-lg font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.universe.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.universe.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {homepageContent.universe.notes.map((note) => (
              <span key={note} className="rounded-full border border-line bg-surface px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
                {note}
              </span>
            ))}
          </div>
        </div>
        <SceneSlot
          scene="assembly"
          fallbackTitle="Products entering the universe"
          className="min-h-[24rem] lg:min-h-[34rem]"
          scrub={false}
        />
      </div>
    </section>
  );
}
