"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Truck, CreditCard, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/hooks/useCart";
import { formatCurrency } from "@/lib/utils/format";
import { checkoutSchema, type CheckoutInput } from "@/lib/utils/validation";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { VerifiedRoute } from "@/components/customer/RouteGuards";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/types/api";
import { createOrder } from "@/lib/api/customer";

function CheckoutForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { cart, subtotal, isLoading } = useCart();

  const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: "",
      customerEmail: "",
      notes: "",
    },
  });

  const customerEmail = watch("customerEmail");

  const onSubmit = async (data: CheckoutInput) => {
    try {
      const order = await createOrder({
        shippingAddress: data.shippingAddress,
        customerEmail: data.customerEmail || undefined,
        notes: data.notes || undefined,
      });
      router.push(`/orders/success?orderId=${order._id}&redirect=/products`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
        <PageHeader title="Checkout" description="Enter your shipping details to place your order." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse bg-canvas rounded-xl" />
            ))}
          </div>
          <div className="h-72 animate-pulse bg-canvas rounded-xl" />
        </div>
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <VerifiedRoute>
        <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
          <PageHeader
            title="Checkout"
            description="Your cart is empty. Add some products before checking out."
            actions={
              <Button asChild>
                <a href="/products">Continue Shopping</a>
              </Button>
            }
          />
        </div>
      </VerifiedRoute>
    );
  }

  return (
    <VerifiedRoute>
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
        <PageHeader
          title="Checkout"
          description="Enter your shipping details to place your order."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-line bg-surface p-6">
              <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                <Truck className="h-5 w-5 text-sky" />
                Shipping Address
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="shippingAddress" className="block text-sm font-medium text-ink">
                    Shipping Address <span className="text-clay">*</span>
                  </Label>
                  <Textarea
                    id="shippingAddress"
                    {...register("shippingAddress")}
                    rows={4}
                    placeholder="Street address, city, state, ZIP code, country"
                    className="mt-1"
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-sm text-clay">{errors.shippingAddress.message}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-line bg-surface p-6">
              <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                <Mail className="h-5 w-5 text-sky" />
                Contact Information
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="customerEmail" className="block text-sm font-medium text-ink">
                    Email Address
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register("customerEmail")}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                  {errors.customerEmail && (
                    <p className="mt-1 text-sm text-clay">{errors.customerEmail.message}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-line bg-surface p-6">
              <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                <Shield className="h-5 w-5 text-sky" />
                Order Notes (Optional)
              </h3>
              <div className="mt-4">
                <Textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Any special instructions for your order..."
                  className="mt-1"
                />
              </div>
            </section>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft">
              <h3 className="font-display text-lg text-ink">Order Summary</h3>
              <Separator className="my-4" />
              <div className="space-y-3">
                {cart.items.map((item: CartItem) => (
                  <div key={item.product._id} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.product.name}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity} × {formatCurrency(item.priceSnapshot)}</p>
                    </div>
                    <span className="text-sm font-medium text-ink whitespace-nowrap">
                      {formatCurrency(item.priceSnapshot * item.quantity)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span className="font-medium text-ink">
                      {shipping === 0 ? "Free" : formatCurrency(shipping)}
                      {subtotal > 0 && subtotal < 100 && (
                        <span className="ml-2 text-xs text-muted">(Free over $100)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-ink">Total</span>
                    <span className="text-ink">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>All major cards accepted</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </VerifiedRoute>
  );
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, subtotal, isLoading } = useCart();
  const redirectTo = searchParams.get("redirect") || "/orders";

  return <CheckoutForm redirectTo={redirectTo} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}