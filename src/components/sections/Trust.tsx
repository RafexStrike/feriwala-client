import { homepageContent } from "@/content/homepage";
import { BrandMotif } from "@/components/ui/BrandMotif";

export function Trust() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div data-reveal>
            <p className="section-kicker">{homepageContent.trust.eyebrow}</p>
            <h2 className="editorial-headline mt-5 text-[clamp(3.5rem,5vw,7rem)] leading-[0.9] text-ink">
              <span className="block">Built for</span>
              <span className="block">people who</span>
              <span className="block">care.</span>
            </h2>
            <BrandMotif className="mt-6 h-3 w-12" />
            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              {homepageContent.trust.description}
            </p>
          </div>

          <div data-reveal className="space-y-3">
            {homepageContent.trust.proof.map((item, index) => (
              <div
                key={item}
                className="editorial-rhythm flex items-center gap-5 bg-white/10 px-4 py-5 sm:px-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white/70 text-[0.7rem] uppercase tracking-[0.18em] text-ink/70">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p className="text-base font-medium leading-7 text-ink sm:text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
