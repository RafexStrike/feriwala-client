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
import { toast } from "sonner";

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

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast("Order ID copied to clipboard!");
    }
  };

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
            Thank you for your order. Our moderators will contact you via WhatsApp to confirm the order.
          </p>

          {orderId && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-green-800 break-all">
                <strong>Order ID:</strong> {orderId}
              </p>
              <Button onClick={handleCopyOrderId} variant="outline" size="sm" className="whitespace-nowrap">
                Copy Order ID
              </Button>
            </div>
          )}

          <div className="space-y-4">
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