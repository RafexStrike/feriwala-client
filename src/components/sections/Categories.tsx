import { homepageContent } from "@/content/homepage";
import Link from "next/link";
import Image from "next/image";

export function Categories() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-gradient-to-b from-white via-surface/30 to-canvas/20 py-[clamp(5rem,9vw,8rem)]">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-r from-clay/5 to-transparent blur-3xl" />

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
                href={`/products/৳{category.slug}`}
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

        <div data-reveal className="relative rounded-[2.5rem] overflow-hidden border border-line/30 bg-gradient-to-br from-surface/40 to-canvas/30 min-h-[26rem] lg:min-h-[42rem]">
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
            alt="Product categories showcase"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
