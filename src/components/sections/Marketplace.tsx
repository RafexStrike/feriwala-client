import { homepageContent } from "@/content/homepage";
import { SceneSlot } from "@/components/three/SceneSlot";

export function Marketplace() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/55 py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.marketplace.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.marketplace.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.marketplace.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {homepageContent.marketplace.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[1.35rem] border border-line bg-canvas p-5">
                <p className="font-display text-4xl leading-none text-ink">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
        <SceneSlot scene="marketplace-explosion" fallbackTitle="Marketplace scale in motion" className="min-h-[26rem] lg:min-h-[40rem]" />
      </div>
    </section>
  );
}
