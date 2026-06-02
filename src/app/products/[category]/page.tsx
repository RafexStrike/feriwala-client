import { categories } from "@/config/categories";
import { productsByCategory } from "@/config/products";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const products = productsByCategory[category.slug] ?? [];

  return (
    <main className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
      <Link href="/products" className="text-sm text-muted underline decoration-line underline-offset-4">
        Back to products
      </Link>
      <p className="mt-6 text-xs uppercase tracking-[0.32em] text-muted">{category.count}</p>
      <h1 className="mt-4 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
        {category.name}
      </h1>
      <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{category.summary}</p>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.slug} className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft">
            <div className="aspect-[4/3] rounded-[1.35rem] border border-line bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(145deg, rgba(255,255,255,0.88), ${category.accent}25)` }} />
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-muted">{product.priceLabel}</p>
            <h2 className="mt-3 font-display text-3xl leading-none text-ink">{product.name}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{product.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs text-muted">
                  {chip}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
