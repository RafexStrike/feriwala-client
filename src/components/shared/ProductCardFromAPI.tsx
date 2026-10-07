"use client";

import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import type { ProductBrief } from "@/lib/api/types";

interface ProductCardFromAPIProps {
  product: ProductBrief;
  className?: string;
}

export function ProductCardFromAPI({ product, className }: ProductCardFromAPIProps) {
  const category = product.categories[0];
  const image = product.images[0];
  const chips = [
    ...product.categories.map((c) => c.name),
    ...product.tags.map((t) => t.name),
  ].slice(0, 3);
  const accents = ["#f58c4c", "#f46764", "#37aff5"];
  const accent = accents[(product.name.length + product.price) % accents.length];

  return (
    <Link
      href={`/products/${product._id}`}
      className={cn(
        "group block h-full overflow-hidden rounded-[1.8rem] border border-line/80 bg-white/20 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 sm:p-4",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.45rem] border border-line/80 bg-surface">
        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/60 bg-white/70 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-ink/70 backdrop-blur-sm">
            {category?.name || "Uncategorized"}
          </span>
          <span className="rounded-full bg-white/75 px-2.5 py-1 text-[0.7rem] font-medium text-ink shadow-sm">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">Featured</p>
          <h3 className="mt-2 font-display text-[clamp(2rem,3vw,2.7rem)] leading-none text-ink">
            {product.name}
          </h3>
        </div>
        <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
      </div>

      <p className="mt-3 text-sm leading-7 text-muted">{product.briefDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span key={chip} className="rounded-full border border-line bg-white/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-ink/70">
            {chip}
          </span>
        ))}
      </div>
    </Link>
  );
}