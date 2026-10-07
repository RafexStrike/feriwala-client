import { homepageContent } from "@/content/homepage";
import { BrandMotif } from "@/components/ui/BrandMotif";

export function BrandStatement() {
  const accentColors = ["#f58c4c", "#f46764", "#37aff5"];

  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-[#f58c4c]/5 blur-3xl" />

      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
          <div data-reveal>
            <p className="section-kicker">{homepageContent.brandStatement.eyebrow}</p>
            <div className="mt-5 space-y-2">
              <span className="editorial-headline block text-[clamp(3.8rem,6vw,8rem)] text-ink">WHY</span>
              <span className="editorial-headline block text-[clamp(4rem,6vw,8.2rem)] text-ink">FERIWALA</span>
            </div>
            <BrandMotif className="mt-6 h-3 w-12" />
            <p className="mt-8 max-w-xl text-base leading-8 text-muted sm:text-lg">
              {homepageContent.brandStatement.description}
            </p>
          </div>

          <div data-reveal className="space-y-3">
            {homepageContent.brandStatement.highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="group border-b border-line/80 pb-4 transition-colors duration-300 hover:border-ink/40"
              >
                <div className="flex items-start gap-5 rounded-[1.5rem] p-2 sm:p-4">
                  <span className="editorial-headline text-[2.2rem] leading-none text-ink/70 sm:text-[3rem]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 border-l border-line/80 pl-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-[clamp(1.6rem,2vw,2.3rem)] leading-none text-ink">
                        {highlight.title}
                      </h3>
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: accentColors[index % accentColors.length] }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{highlight.description}</p>
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
