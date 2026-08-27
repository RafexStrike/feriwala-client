"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Package, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useOrders, useOrder } from "@/lib/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { VerifiedRoute } from "@/components/customer/RouteGuards";
import type { Order } from "@/types/api";

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

export default function OrdersPage() {
  const { data: orders, isLoading, error, refetch } = useOrders();
  const ordersList = orders || [];

  return (
    <VerifiedRoute>
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-10">
        <PageHeader
          title="My Orders"
          description="View your order history and track shipments."
        />

        {isLoading ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 text-center">
            <p className="text-muted mb-4">Failed to load orders</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : ordersList.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will appear here."
            action={{ label: "Start Shopping", href: "/products" }}
          />
        ) : (
          <div className="mt-8 space-y-4">
            {ordersList.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </VerifiedRoute>
  );
}

function OrderCard({ order }: { order: Order }) {
  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
  const statusStyle = statusStyles[order.status as keyof typeof statusStyles];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href={`/orders/${order._id}`} className="block">
      <article className="rounded-[1.5rem] border border-line bg-surface p-4 transition-colors hover:border-ink/15 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/10 text-sky">
              <Package className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-ink">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-muted">{formatDate(order.createdAt)} • {itemCount} item{itemCount !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <Badge className={cn("gap-1.5", statusStyle)} variant="outline">
              <StatusIcon className="h-3 w-3" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <div className="text-right">
              <p className="font-semibold text-ink">{formatCurrency(order.total)}</p>
              <ChevronRight className="h-4 w-4 text-muted" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function OrderSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-line bg-surface p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-canvas" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-canvas rounded" />
          <div className="h-4 w-32 bg-canvas rounded" />
        </div>
      </div>
    </div>
  );
}