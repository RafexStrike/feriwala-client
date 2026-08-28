"use client";

import { useState } from "react";
import { ChevronRight, Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, ArrowLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOrder } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { VerifiedRoute } from "@/components/customer/RouteGuards";
import type { Order, OrderItem, OrderStatusHistory } from "@/types/api";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  canceled: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  canceled: XCircle,
};

interface OrderDetailContentProps {
  orderId: string;
}

function OrderDetailContent({ orderId }: OrderDetailContentProps) {
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">Failed to load order</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
  const statusStyle = statusStyles[order.status as keyof typeof statusStyles];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-1rem))] py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </a>
        </Button>
        <span className="text-muted">/</span>
        <span className="break-all font-medium text-ink">Order #{order._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-line bg-surface p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/10 text-sky">
                  <Package className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="break-all font-medium text-ink">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-muted">
                    Placed on {formatDate(order.createdAt)} • {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Badge className={cn("gap-1.5", statusStyle)} variant="outline">
                <StatusIcon className="h-3 w-3" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <OrderItemCard key={item.product} item={item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <OrderTimeline history={order.statusHistory} />
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <OrderSummary
            subtotal={order.subtotal}
            shipping={order.total - order.subtotal}
            total={order.total}
            notes={order.notes}
          />

          <div className="rounded-[1.5rem] border border-line bg-surface p-4 sm:p-6">
            <h3 className="mb-4 font-medium text-ink">Shipping Address</h3>
            <address className="whitespace-pre-line break-words text-muted not-italic">{order.shippingAddress}</address>
            <p className="mt-3 text-sm text-muted">
              <MapPin className="mr-1 inline h-3.5 w-3.5" />
              Email: {order.customerEmail}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderItemCard({ item }: { item: OrderItem }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row">
      <div className="relative h-20 w-full flex-shrink-0 overflow-hidden rounded-lg bg-canvas sm:w-20">
        <div className="flex h-full items-center justify-center text-muted">
          <Package className="h-8 w-8" />
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <h4 className="break-words font-medium text-ink">{item.name}</h4>
        <p className="text-sm text-muted">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="font-semibold text-ink">{formatCurrency(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}

function OrderTimeline({ history }: { history: OrderStatusHistory[] }) {
  return (
    <div className="space-y-6">
      {history.slice().reverse().map((entry, index) => (
        <div key={entry.changedAt} className="relative flex gap-4">
          {index < history.length - 1 && (
            <div className="absolute left-4 top-12 h-full w-0.5 bg-line" />
          )}
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky/10 text-sky">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-ink capitalize">{entry.status}</p>
              <span className="text-sm text-muted">{formatDate(entry.changedAt)}</span>
            </div>
            {entry.note && <p className="mt-1 break-words text-sm text-muted">{entry.note}</p>}
            {entry.changedBy && (
              <p className="mt-1 text-xs text-muted">Updated by {entry.changedBy}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderSummary({ subtotal, shipping, total, notes }: { subtotal: number; shipping: number; total: number; notes?: string }) {
  return (
    <div className="sticky top-24 rounded-[1.5rem] border border-line bg-surface p-4 sm:p-6">
      <h3 className="mb-4 font-display text-xl text-ink">Order Summary</h3>
      <Separator className="mb-4" />
      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted">Subtotal ({subtotal > 0 ? "items" : "0 items"})</span>
          <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Shipping</span>
          <span className="text-right font-medium text-ink">
            {shipping === 0 ? "Free" : formatCurrency(shipping)}
            {subtotal > 0 && subtotal < 100 && <span className="ml-2 block text-xs text-muted sm:inline">(Free over ৳100)</span>}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between gap-3 text-lg font-semibold">
          <span className="text-ink">Total</span>
          <span className="text-ink">{formatCurrency(total)}</span>
        </div>
      </div>
      {notes && (
        <div className="mt-4 rounded-lg bg-canvas p-3">
          <p className="text-sm font-medium text-muted">Order Notes</p>
          <p className="mt-1 break-words text-sm text-ink">{notes}</p>
        </div>
      )}
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-10 animate-pulse">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="h-24 rounded-[1.5rem] border border-line bg-surface" />
          <div className="h-12 rounded-lg bg-canvas" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl border border-line bg-surface" />
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="h-64 rounded-[1.5rem] border border-line bg-surface" />
          <div className="h-40 rounded-[1.5rem] border border-line bg-surface" />
          <div className="h-40 rounded-[1.5rem] border border-line bg-surface" />
        </aside>
      </div>
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <VerifiedRoute>
      <OrderDetailContent orderId={orderId} />
    </VerifiedRoute>
  );
}