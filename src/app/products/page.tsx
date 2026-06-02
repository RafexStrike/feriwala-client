import { categories } from "@/config/categories";
import { productsByCategory } from "@/config/products";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
      <p className="text-xs uppercase tracking-[0.32em] text-muted">Products</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
        The category pages will become the working shelf for the marketplace.
      </h1>
      <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">
        This placeholder route keeps navigation intact while the future product detail and collection flows are added.
      </p>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {categories.map((category) => (
          <section key={category.slug} className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">{category.count}</p>
                <h2 className="mt-3 font-display text-3xl leading-none text-ink">{category.name}</h2>
              </div>
              <Link href={`/products/${category.slug}`} className="rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:bg-ink/5">
                Show all
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">{category.summary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {(productsByCategory[category.slug] ?? []).slice(0, 3).map((product) => (
                <div key={product.slug} className="rounded-2xl border border-line bg-canvas p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{product.priceLabel}</p>
                  <p className="mt-3 font-display text-xl leading-none text-ink">{product.name}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
