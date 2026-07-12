"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format";
import { useCart } from "@/lib/hooks/useCart";
import type { CartItem } from "@/lib/api/types";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity, priceSnapshot } = item;
  const lineTotal = priceSnapshot * quantity;
  const image = product.images[0];

  return (
    <div className="flex gap-4">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-canvas">
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-ink truncate">{product.name}</h4>
          <button
            onClick={() => onRemove(product._id)}
            className="text-muted hover:text-clay transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted">{formatCurrency(priceSnapshot)} each</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-surface">
            <button
              onClick={() => onQuantityChange(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-ink">{quantity}</span>
            <button
              onClick={() => onQuantityChange(product._id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="ml-auto font-medium text-ink">{formatCurrency(lineTotal)}</span>
        </div>
        {quantity >= product.stock && product.stock > 0 && (
          <p className="text-xs text-clay">Only {product.stock} left in stock</p>
        )}
      </div>
    </div>
  );
}

export function CartSidebar() {
  const { cart, isLoading, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="relative gap-2" aria-label="Cart">
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-canvas">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-sm sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <div className="flex flex-col flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 space-y-4 p-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-canvas rounded-xl" />
              ))}
            </div>
          ) : cart?.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted" />
              <p className="text-muted">Your cart is empty</p>
              <Button variant="link" className="mt-4" asChild>
                <a href="/products">Continue shopping</a>
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart?.items.map((item: CartItem) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
          <Separator className="mx-6" />
          <div className="p-6 space-y-3 border-t border-line">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              <span className="font-medium text-ink">
                {shipping === 0 ? "Free" : formatCurrency(shipping)}
                {subtotal > 0 && subtotal < 100 && (
                  <span className="ml-2 text-xs text-muted">(Free over $100)</span>
                )}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-ink">Total</span>
              <span className="text-ink">{formatCurrency(total)}</span>
            </div>
            <Button className="w-full" asChild size="lg">
              <a href="/checkout" className="flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            {itemCount > 0 && (
              <Button variant="ghost" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}