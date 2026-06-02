import { homepageContent } from "@/content/homepage";

export function Trust() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      {/* Decorative background */}
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-gradient-to-l from-sky/5 to-transparent blur-3xl" />

      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.trust.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.trust.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.trust.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {homepageContent.trust.proof.map((item) => (
            <div key={item} className="rounded-[1.45rem] border border-line/50 bg-gradient-to-br from-surface/50 via-white to-canvas/50 p-5 hover:border-line/80 transition-colors duration-300">
              <div className="h-2 w-2 rounded-full bg-gradient-to-br from-sky via-clay to-honey" />
              <p className="mt-4 text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
