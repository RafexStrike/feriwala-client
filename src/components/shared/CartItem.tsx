"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import type { CartItem } from "@/types/api";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity, priceSnapshot } = item;
  const image = product.images[0];
  const lineTotal = priceSnapshot * quantity;
  const maxQuantity = product.stock;

  return (
    <div className="flex gap-4 p-4 border-b border-line last:border-0">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-canvas">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            No image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-ink truncate">{product.name}</h4>
        <p className="mt-1 text-sm text-muted">{formatCurrency(priceSnapshot)}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onQuantityChange(product._id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium text-ink">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onQuantityChange(product._id, quantity + 1)}
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="ml-2 text-sm text-muted">Max: {maxQuantity}</span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="font-medium text-ink">{formatCurrency(lineTotal)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted hover:text-clay hover:bg-clay/10"
          onClick={() => onRemove(product._id)}
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}