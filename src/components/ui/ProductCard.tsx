import { cn } from "@/lib/cn";
import type { ProductCard as ProductCardType } from "@/config/products";
import Link from "next/link";

type ProductCardProps = {
  product: ProductCardType;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/৳{product.categorySlug}`}
      className={cn(
        "group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:border-ink/15",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-line px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted">
          {product.categoryName}
        </span>
        <span className="text-sm text-ink/70">{product.priceLabel}</span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <div
          className="mb-6 aspect-[4/3] rounded-[1.35rem] border border-line/70 bg-gradient-to-br"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 28%, ৳{product.accent}33, transparent 38%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.7), transparent 26%), linear-gradient(145deg, rgba(255,255,255,0.88), ৳{product.accent}18)`,
          }}
        />
        <h3 className="font-display text-2xl leading-none tracking-[-0.02em] text-ink">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{product.summary}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {product.chips.map((chip) => (
          <span key={chip} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs text-muted">
            {chip}
          </span>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center text-sm text-ink/80 transition-transform duration-300 group-hover:translate-x-1">
        Explore category
      </span>
    </Link>
  );
}
