import { homepageContent } from "@/content/homepage";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      {/* Decorative background elements */}
      <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-sky/5 to-transparent blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-honey/5 to-transparent blur-3xl" />

      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div data-reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.brandStatement.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
              {homepageContent.brandStatement.title}
            </h2>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">
              {homepageContent.brandStatement.description}
            </p>
          </div>

          <div data-reveal className="grid gap-4">
            {homepageContent.brandStatement.highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="group rounded-[1.45rem] border border-line/50 bg-gradient-to-br from-white/50 via-surface/30 to-canvas/20 p-6 transition-all duration-300 hover:border-sky/30 hover:bg-gradient-to-br hover:from-sky/5 hover:via-surface/40 hover:to-canvas/30"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-sky via-clay to-honey flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg leading-tight text-ink">{highlight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{highlight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
