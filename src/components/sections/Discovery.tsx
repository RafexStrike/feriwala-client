import { homepageContent } from "@/content/homepage";
import { featuredProducts } from "@/config/products";
import { ProductCard } from "@/components/ui/ProductCard";

export function Discovery() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/60 py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.discovery.eyebrow}</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.discovery.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{homepageContent.discovery.description}</p>
        </div>
        <div className="mt-12 overflow-x-auto pb-4">
          <div className="grid min-w-max grid-flow-col gap-5">
            {[...featuredProducts, ...featuredProducts.slice(0, 2)].map((product) => (
              <ProductCard key={`${product.slug}-${product.priceLabel}`} product={product} className="w-[20rem] snap-start" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
