"use client";

import { useParams } from "next/navigation";
import { useAdminOrder, useUpdateOrderStatus } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import type { StatusUpdateInput } from "@/types/api";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  completed: { label: "Completed", icon: CheckCircle, variant: "default" as const },
  canceled: { label: "Canceled", icon: XCircle, variant: "destructive" as const },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { data: order, isLoading, error, refetch } = useAdminOrder(orderId);
  const updateOrderStatus = useUpdateOrderStatus();

  const [newStatus, setNewStatus] = useState<string>("");
  const [note, setNote] = useState("");

  const handleStatusUpdate = async () => {
    if (!newStatus || !order) return;
    try {
      await updateOrderStatus.mutateAsync({
        orderId: order._id,
        data: { status: newStatus as StatusUpdateInput["status"], note },
      });
      toast({ title: "Order status updated successfully" });
      setNote("");
    } catch (err) {
      toast({
        title: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load order"
        message={error.message || "An error occurred while fetching the order."}
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <ErrorState
        title="Order not found"
        message="The order you're looking for doesn't exist."
      />
    );
  }

  const config = statusConfig[order.status];
  const Icon = config.icon;

  return (
    <div>
      <AdminHeader
        title={`Order #৳{order._id.slice(0, 8)}`}
        description={`Placed on ৳{formatDate(order.createdAt)}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">{item.name}</p>
                      <p className="text-sm text-muted">
                        Quantity: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium text-ink">
                      {formatCurrency(item.quantity * item.price)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <p className="text-muted">Subtotal</p>
                <p className="font-medium text-ink">{formatCurrency(order.subtotal)}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-semibold text-ink">Total</p>
                <p className="font-semibold text-ink">{formatCurrency(order.total)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory.map((entry, index) => {
                  const entryConfig = statusConfig[entry.status];
                  const EntryIcon = entryConfig.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <EntryIcon className="h-4 w-4 text-muted" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={entryConfig.variant} className="text-xs">
                            {entryConfig.label}
                          </Badge>
                          <span className="text-xs text-muted">
                            {formatDate(entry.changedAt)}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="mt-1 text-sm text-muted">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted">Email</p>
                <p className="text-ink">{order.customerEmail || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Shipping Address</p>
                <p className="text-ink">{order.shippingAddress}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm text-muted">Notes</p>
                  <p className="text-ink">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change order status and notify customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink mb-2">Current Status</p>
                <Badge variant={config.variant}>
                  <Icon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-2">New Status</p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium text-ink mb-2">Note (optional)</p>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                />
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={updateOrderStatus.isPending || !newStatus || newStatus === order.status}
                className="w-full"
              >
                {updateOrderStatus.isPending ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
