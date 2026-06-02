import { homepageContent } from "@/content/homepage";

export function Trust() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
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
            <div key={item} className="rounded-[1.45rem] border border-line bg-surface p-5 shadow-soft">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky via-clay to-honey" />
              <p className="mt-6 text-sm leading-7 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
