import { homepageContent } from "@/content/homepage";
import { SceneSlot } from "@/components/three/SceneSlot";
import Link from "next/link";

export function Categories() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/50 py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.categories.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.categories.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.categories.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {homepageContent.categories.items.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group rounded-[1.45rem] border border-line bg-canvas p-4 transition-transform duration-300 hover:-translate-y-1 hover:border-ink/15"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.accent }} />
                    <h3 className="font-display text-2xl leading-none text-ink">{category.name}</h3>
                  </div>
                  <span className="text-xs uppercase tracking-[0.28em] text-muted">{category.count}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{category.summary}</p>
                <span className="mt-5 inline-flex text-sm text-ink/80 transition-transform duration-300 group-hover:translate-x-1">
                  Open category
                </span>
              </Link>
            ))}
          </div>
        </div>
        <SceneSlot scene="category-galaxy" fallbackTitle="A category constellation" className="min-h-[26rem] lg:min-h-[42rem]" />
      </div>
    </section>
  );
}
