import { homepageContent } from "@/content/homepage";
import { SceneSlot } from "@/components/three/SceneSlot";

export function Formation() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/55 py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.formation.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.formation.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.formation.description}</p>
          <div className="mt-8 rounded-[1.75rem] border border-line bg-canvas p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-muted">Feriwala</p>
            <p className="mt-3 max-w-md font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.05em] text-ink">
              Discovery, organized.
            </p>
          </div>
        </div>
        <SceneSlot scene="formation" fallbackTitle="Brand formation moment" className="min-h-[26rem] lg:min-h-[40rem]" />
      </div>
    </section>
  );
}
