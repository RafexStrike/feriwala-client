import { homepageContent } from "@/content/homepage";
import Link from "next/link";
import { BrandMotif } from "@/components/ui/BrandMotif";

export function Categories() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div data-reveal>
            <p className="section-kicker">{homepageContent.categories.eyebrow}</p>
            <h2 className="editorial-headline mt-4 text-[clamp(3rem,5vw,6.2rem)] text-ink">
              <span className="block">Explore</span>
              <span className="block">by category</span>
            </h2>
          </div>

          <div data-reveal className="flex items-center gap-4 text-ink/60">
            <span className="text-[0.7rem] uppercase tracking-[0.28em]">Curated</span>
            <BrandMotif className="h-3 w-10" monochrome />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {homepageContent.categories.items.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className={`group relative overflow-hidden rounded-[2rem] border border-line/80 bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-ink/20 ${
                index % 2 === 1 ? "md:translate-y-6" : ""
              }`}
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${category.accent}22, rgba(255,255,255,0.26) 45%, rgba(23,20,16,0.04))`,
                }}
              />

              <div className="relative flex min-h-[18rem] flex-col justify-between">
                <div className="flex items-center justify-between gap-4 text-ink/80">
                  <span className="text-[0.68rem] uppercase tracking-[0.26em]">{category.count}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.accent }} />
                </div>

                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-ink/60">Category</p>
                  <h3 className="mt-3 font-display text-[clamp(2.2rem,4vw,4rem)] leading-[0.9] text-ink">
                    {category.name}
                  </h3>
                  <p className="mt-4 max-w-xs text-sm leading-7 text-ink/70">{category.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
