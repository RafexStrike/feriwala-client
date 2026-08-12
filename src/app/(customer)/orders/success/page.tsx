"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { VerifiedRoute } from "@/components/customer/RouteGuards";
import { useCart } from "@/lib/hooks/useCart";
import { clearCart } from "@/lib/api/customer";
import { useQueryClient } from "@tanstack/react-query";

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

function OrderSuccessContent({ searchParams }: OrderSuccessPageProps) {
  const router = useRouter();
  const searchParamsClient = useSearchParams();
  const queryClient = useQueryClient();
  const { clearCart: clearCartHook } = useCart();
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [showRedirectButton, setShowRedirectButton] = useState(false);

  const orderId = searchParamsClient.get("orderId");
  const redirectTo = searchParamsClient.get("redirect") || "/products";

  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectTo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, redirectTo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRedirectButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    clearCartHook();
  }, [queryClient, clearCartHook]);

  return (
    <VerifiedRoute>
      <div className="mx-auto w-[min(600px,calc(100vw-2rem))] py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-3xl font-display font-bold text-ink">Order Placed Successfully!</h1>
          <p className="mb-6 text-lg text-muted">
            Thank you for your order. Your order has been confirmed and is being processed.
          </p>

          {orderId && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Order ID:</strong> #{orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Order confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Shipped</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Delivered</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={redirectTo}>
                  Continue Shopping
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/orders/${orderId}`}>
                  View Order Details
                </Link>
              </Button>
            </div>

            {showRedirectButton && (
              <p className="text-sm text-muted">
                Redirecting to {redirectTo === "/products" ? "products" : "home"} in {redirectCountdown}s...
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => router.push(redirectTo)}
                >
                  Go now
                </Button>
              </p>
            )}
          </div>

          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </VerifiedRoute>
  );
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}