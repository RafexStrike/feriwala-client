"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight, Inbox } from "lucide-react";
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
    <div className="group flex gap-4 p-4 rounded-lg border border-orange-100/40 bg-gradient-to-br from-amber-50/30 to-orange-50/20 hover:from-amber-50/50 hover:to-orange-50/40 transition-all duration-300">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-canvas border border-orange-100/20 shadow-sm">
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sky/50">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-ink line-clamp-2 text-sm">{product.name}</h4>
          <button
            onClick={() => onRemove(product._id)}
            className="flex-shrink-0 text-muted hover:text-clay hover:bg-clay/5 p-1.5 rounded-md transition-all duration-200"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-sky font-medium">{formatCurrency(priceSnapshot)} per item</p>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-0.5 rounded-md border border-sky/30 bg-white/60 shadow-xs">
            <button
              onClick={() => onQuantityChange(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-7 w-7 items-center justify-center text-sky hover:text-clay hover:bg-clay/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-ink">{quantity}</span>
            <button
              onClick={() => onQuantityChange(product._id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="flex h-7 w-7 items-center justify-center text-sky hover:text-clay hover:bg-clay/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="ml-auto font-bold text-clay text-sm">{formatCurrency(lineTotal)}</span>
        </div>
        {quantity >= product.stock && product.stock > 0 && (
          <p className="text-xs text-clay/70 font-medium">Only {product.stock} left in stock</p>
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
        <Button variant="ghost" className="relative gap-2 hover:bg-sky/5 transition-colors" aria-label="Cart">
          <ShoppingBag className="h-5 w-5 text-sky" />
          <span className="hidden sm:inline text-ink">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-clay to-honey text-xs font-bold text-white shadow-lg">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-sm sm:max-w-md bg-surface">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-sky/95 via-sky/90 to-sky/85 rounded-t-2xl p-6 text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <DrawerTitle className="text-white font-bold text-lg">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Your Cart
                </div>
              </DrawerTitle>
              <DrawerClose className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all" />
            </div>
            <p className="text-sky-100 text-sm font-medium">
              {itemCount} {itemCount === 1 ? "item" : "items"} • {formatCurrency(subtotal)}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 overflow-hidden bg-surface">
          {isLoading ? (
            <div className="flex-1 space-y-4 p-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-canvas/60 rounded-lg" />
              ))}
            </div>
          ) : cart?.items?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-sky/10 flex items-center justify-center mb-4">
                <Inbox className="h-10 w-10 text-sky" />
              </div>
              <p className="text-ink font-semibold mb-1">Your cart is empty</p>
              <p className="text-muted text-sm mb-6">Add items to get started</p>
              <Button className="bg-clay hover:bg-clay/90 text-white gap-2" asChild>
                <a href="/products">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </a>
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
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

          {/* Pricing Section */}
          {(cart?.items?.length ?? 0) > 0 && (
            <div className="bg-canvas/40 border-t-2 border-sky/10 px-6 py-5 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm font-medium">Subtotal</span>
                <span className="text-ink font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm font-medium">Shipping</span>
                <div className="text-right">
                  <span className="text-ink font-semibold">
                    {shipping === 0 ? (
                      <span className="text-clay font-bold">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                  {subtotal > 0 && subtotal < 100 && (
                    <p className="text-xs text-sky/70 mt-0.5 font-medium">
                      Free over $100
                    </p>
                  )}
                </div>
              </div>

              <Separator className="bg-sky/15" />

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-ink font-bold text-base">Total</span>
                <span className="text-clay text-2xl font-bold">{formatCurrency(total)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Button 
                  className="w-full h-11 bg-gradient-to-r from-clay to-honey hover:from-clay/90 hover:to-honey/90 text-white font-semibold gap-2 shadow-lg hover:shadow-xl transition-all" 
                  asChild
                >
                  <a href="/checkout" className="flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-10 border-2 border-sky/20 hover:bg-sky/5 text-ink hover:text-sky font-medium transition-all"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}