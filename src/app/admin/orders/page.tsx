"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingCart, Clock, CheckCircle, XCircle, Copy, ExternalLink } from "lucide-react";
import { useAdminOrders, useUpdateOrderStatus } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Order, StatusUpdateInput } from "@/types/api";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  completed: { label: "Completed", icon: CheckCircle, variant: "default" as const },
  canceled: { label: "Canceled", icon: XCircle, variant: "destructive" as const },
};

export default function OrdersPage() {
  const { data: orders, isLoading, error, refetch } = useAdminOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const [statusDialog, setStatusDialog] = useState<{
    orderId: string;
    currentStatus: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [note, setNote] = useState("");

  const openStatusDialog = (order: Order) => {
    setStatusDialog({ orderId: order._id, currentStatus: order.status });
    setNewStatus(order.status);
    setNote("");
  };

  const handleStatusUpdate = async () => {
    if (!statusDialog || !newStatus) return;
    try {
      await updateOrderStatus.mutateAsync({
        orderId: statusDialog.orderId,
        data: { status: newStatus as StatusUpdateInput["status"], note },
      });
      toast({ title: "Order status updated successfully" });
      setStatusDialog(null);
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
        title="Failed to load orders"
        message={error.message || "An error occurred while fetching orders."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Orders"
        description="Manage customer orders and fulfillment"
      />

      <DataTable
        data={orders ?? []}
        columns={[
          {
            key: "_id",
            header: "Order ID",
            render: (item) => (
              <span className="font-mono text-sm text-muted">
                {item._id.slice(0, 8)}...
              </span>
            ),
          },
          {
            key: "customerEmail",
            header: "Customer",
            render: (item) => (
              <span className="text-ink">{item.customerEmail || "N/A"}</span>
            ),
          },
          {
            key: "whatsappNumber",
            header: "WhatsApp",
            render: (item) => (
              <div className="flex items-center gap-2">
                <span className="text-ink">{item.whatsappNumber || "N/A"}</span>
                {item.whatsappNumber && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(item.whatsappNumber);
                      toast({ title: "WhatsApp number copied!" });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ),
          },
          {
            key: "facebookProfileLink",
            header: "Facebook",
            render: (item) => (
              <div className="flex items-center gap-2">
                {item.facebookProfileLink ? (
                  <>
                    <a
                      href={item.facebookProfileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky hover:underline flex items-center gap-1 max-w-[150px] truncate"
                    >
                      Profile <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        if (item.facebookProfileLink) {
                          navigator.clipboard.writeText(item.facebookProfileLink);
                          toast({ title: "Facebook link copied!" });
                        }
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </div>
            ),
          },
          {
            key: "items",
            header: "Items",
            render: (item) => (
              <span className="text-muted">{item.items.length} item(s)</span>
            ),
          },
          {
            key: "total",
            header: "Total",
            render: (item) => (
              <span className="font-medium text-ink">{formatCurrency(item.total)}</span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (item) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;
              return (
                <Badge variant={config.variant}>
                  <Icon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              );
            },
          },
          {
            key: "createdAt",
            header: "Date",
            render: (item) => formatDate(item.createdAt),
          },
          {
            key: "actions",
            header: "Actions",
            render: (item) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/orders/${item._id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openStatusDialog(item)}>
                  Update Status
                </Button>
              </div>
            ),
          },
        ]}
        isLoading={isLoading}
        emptyTitle="No orders"
        emptyDescription="Orders will appear here when customers make purchases."
        emptyIcon={ShoppingCart}
        keyExtractor={(item) => item._id}
      />

      <Dialog open={!!statusDialog} onOpenChange={() => setStatusDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this order. The customer will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Note (optional)</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this status change..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updateOrderStatus.isPending || newStatus === statusDialog?.currentStatus}
            >
              {updateOrderStatus.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
