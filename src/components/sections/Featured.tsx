"use client";

import { homepageContent } from "@/content/homepage";
import { ProductCardFromAPI } from "@/components/shared/ProductCardFromAPI";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useFeaturedProducts } from "@/lib/hooks/useProducts";

export function Featured() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="max-w-3xl" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.featured.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.featured.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{homepageContent.featured.description}</p>
        </div>
        <div data-reveal className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            null
          ) : (
            products.map((product) => (
              <ProductCardFromAPI key={product._id} product={product} />
            ))
          )}
        </div>
        <div className="mt-10">
          <ButtonLink href="/products" variant="secondary">
            {homepageContent.featured.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
