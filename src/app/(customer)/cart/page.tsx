"use client";

import { cn } from "@/lib/cn";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format";
import { useCart } from "@/lib/hooks/useCart";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import type { CartItem } from "@/lib/api/types";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemComponent({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity, priceSnapshot } = item;
  const lineTotal = priceSnapshot * quantity;
  const image = product.images[0];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line/50 bg-surface/80 p-4 shadow-sm sm:flex-row">
      <div className="relative h-24 w-full overflow-hidden rounded-lg bg-canvas sm:h-24 sm:w-24 sm:flex-shrink-0">
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <ShoppingBag className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="max-w-full text-base font-medium text-ink sm:text-lg">{product.name}</h4>
          <button
            onClick={() => onRemove(product._id)}
            className="flex-shrink-0 text-muted transition-colors hover:text-clay"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted">{formatCurrency(priceSnapshot)} each</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface">
            <button
              onClick={() => onQuantityChange(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium text-ink">{quantity}</span>
            <button
              onClick={() => onQuantityChange(product._id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="font-medium text-ink sm:ml-auto">{formatCurrency(lineTotal)}</span>
        </div>
        {quantity >= product.stock && product.stock > 0 && (
          <p className="text-xs text-clay">Only {product.stock} left in stock</p>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, isLoading, itemCount, subtotal, updateQuantity, removeItem, clearCart, refetch } = useCart();
  const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
        <PageHeader title="Your Cart" description="Review your items before checkout." />
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-canvas rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-1rem))] py-10 sm:py-16">
      <PageHeader
        title="Your Cart"
        description={`Review your ${itemCount} ${itemCount === 1 ? "item" : "items"} before checkout.`}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <a href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </a>
          </Button>
        }
      />

      {cart?.items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any products yet."
          action={{ label: "Browse Products", href: "/products" }}
        />
      ) : (
        <div className="mt-10 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          <div className="space-y-4">
            {cart?.items.map((item: CartItem) => (
              <CartItemComponent
                key={item.product._id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="ghost" asChild className="w-full sm:w-auto">
                <a href="/products" className="flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </a>
              </Button>
              <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>

          <aside className="mt-10 lg:mt-0 lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-line bg-surface p-4 shadow-soft sm:p-6">
              <h3 className="font-display text-xl text-ink">Order Summary</h3>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Shipping</span>
                  <span className="text-right font-medium text-ink">
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                    {subtotal > 0 && subtotal < 100 && (
                      <span className="ml-2 block text-xs text-muted sm:inline">(Free over ৳100)</span>
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between gap-3 text-lg font-semibold">
                  <span className="text-ink">Total</span>
                  <span className="text-ink">{formatCurrency(total)}</span>
                </div>
              </div>
              <Button className="mt-6 w-full" asChild size="lg">
                <a href="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}