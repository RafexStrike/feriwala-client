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

  return (
    <Link
      href={`/products/${product._id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-4 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:border-ink/15 sm:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-line px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:px-3 sm:text-[0.7rem]">
          {category?.name || "Uncategorized"}
        </span>
        <span className="text-xs text-ink/70 sm:text-sm">{formatCurrency(product.price)}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col sm:mt-5">
        <div
          className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-line/70 bg-gradient-to-br sm:mb-6"
          style={{
            backgroundImage: image
              ? `url(${image})`
              : `linear-gradient(145deg, rgba(255,255,255,0.88), #6b98b518)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 220px"
            />
          )}
        </div>
        <h3 className="font-display text-xl leading-none tracking-[-0.02em] text-ink sm:text-2xl">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{product.briefDescription}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
        {chips.map((chip) => (
          <span key={chip} className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[10px] text-muted sm:text-xs">
            {chip}
          </span>
        ))}
      </div>
      <span className="mt-5 inline-flex items-center text-sm text-ink/80 transition-transform duration-300 group-hover:translate-x-1 sm:mt-6">
        View product
      </span>
    </Link>
  );
}