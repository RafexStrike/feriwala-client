"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, ShoppingCart, Clock, CheckCircle, XCircle, Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useAdminOrders, useAdminProducts, useCreateManualOrder, useUpdateOrderStatus } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { ManualOrderItemInput, Order, OrderSource, StatusUpdateInput } from "@/types/api";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  completed: { label: "Completed", icon: CheckCircle, variant: "default" as const },
  canceled: { label: "Canceled", icon: XCircle, variant: "destructive" as const },
};

const sourceOptions: Array<{ label: string; value: OrderSource }> = [
  { label: "Website", value: "website" },
  { label: "Facebook", value: "facebook" },
  { label: "Phone", value: "phone" },
  { label: "Physical Store", value: "physical_store" },
  { label: "In Person", value: "in_person" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Telegram", value: "telegram" },
  { label: "Other", value: "other" },
];

export default function OrdersPage() {
  const { data: orders, isLoading, error, refetch } = useAdminOrders();
  const { data: products = [] } = useAdminProducts();
  const createManualOrder = useCreateManualOrder();
  const updateOrderStatus = useUpdateOrderStatus();

  const [statusDialog, setStatusDialog] = useState<{
    orderId: string;
    currentStatus: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [note, setNote] = useState("");

  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [manualSource, setManualSource] = useState<OrderSource>("website");
  const [manualStatus, setManualStatus] = useState<StatusUpdateInput["status"]>("pending");
  const [manualOrderItems, setManualOrderItems] = useState<ManualOrderItemInput[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductQty, setSelectedProductQty] = useState(1);
  const [manualForm, setManualForm] = useState({
    shippingAddress: "",
    customerEmail: "",
    whatsappNumber: "",
    facebookProfileLink: "",
    externalCustomerName: "",
    externalCustomerPhone: "",
    externalCustomerFacebookProfileLink: "",
    notes: "",
  });

  const productLookup = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [productSearch, products]);

  const orderSummary = useMemo(() => {
    return manualOrderItems.reduce(
      (summary, item) => {
        const product = productLookup.get(item.productId);
        if (!product) return summary;

        const lineTotal = product.price * item.quantity;
        const lineProfit = (product.price - (product as any).costPrice) * item.quantity;
        summary.subtotal += lineTotal;
        summary.profit += lineProfit;
        return summary;
      },
      { subtotal: 0, profit: 0 }
    );
  }, [manualOrderItems, productLookup]);

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

  const handleAddManualProduct = () => {
    if (!selectedProductId) {
      toast({ title: "Select a product first", variant: "destructive" });
      return;
    }

    const product = productLookup.get(selectedProductId);
    if (!product) {
      toast({ title: "Selected product could not be found", variant: "destructive" });
      return;
    }

    setManualOrderItems((current) => {
      const existingIndex = current.findIndex((entry) => entry.productId === selectedProductId);
      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + selectedProductQty,
        };
        return next;
      }

      return [...current, { productId: selectedProductId, quantity: selectedProductQty }];
    });

    setSelectedProductId("");
    setSelectedProductQty(1);
  };

  const handleRemoveManualItem = (productId: string) => {
    setManualOrderItems((current) => current.filter((entry) => entry.productId !== productId));
  };

  const resetManualOrderForm = () => {
    setManualDialogOpen(false);
    setManualSource("website");
    setManualStatus("pending");
    setManualOrderItems([]);
    setProductSearch("");
    setSelectedProductId("");
    setSelectedProductQty(1);
    setManualForm({
      shippingAddress: "",
      customerEmail: "",
      whatsappNumber: "",
      facebookProfileLink: "",
      externalCustomerName: "",
      externalCustomerPhone: "",
      externalCustomerFacebookProfileLink: "",
      notes: "",
    });
  };

  const handleCreateManualOrder = async () => {
    if (!manualOrderItems.length) {
      toast({ title: "Add at least one product", variant: "destructive" });
      return;
    }

    try {
      await createManualOrder.mutateAsync({
        source: manualSource,
        status: manualStatus,
        items: manualOrderItems,
        shippingAddress: manualForm.shippingAddress,
        customerEmail: manualForm.customerEmail,
        whatsappNumber: manualForm.whatsappNumber,
        facebookProfileLink: manualForm.facebookProfileLink,
        externalCustomerName: manualForm.externalCustomerName,
        externalCustomerPhone: manualForm.externalCustomerPhone,
        externalCustomerFacebookProfileLink: manualForm.externalCustomerFacebookProfileLink,
        notes: manualForm.notes,
      });

      toast({ title: "Manual order created successfully" });
      resetManualOrderForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create manual order.";
      toast({ title: message, variant: "destructive" });
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

      <div className="mb-4 flex justify-end">
        <Button onClick={() => setManualDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Order
        </Button>
      </div>

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
              <span className="text-ink">{item.externalCustomerName || item.customerEmail || "N/A"}</span>
            ),
          },
          {
            key: "whatsappNumber",
            header: "WhatsApp",
            render: (item) => (
              <div className="flex items-center gap-2">
                <span className="text-ink">{item.whatsappNumber || item.externalCustomerPhone || "N/A"}</span>
                {(item.whatsappNumber || item.externalCustomerPhone) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      const value = item.whatsappNumber || item.externalCustomerPhone;
                      if (value) navigator.clipboard.writeText(value);
                      toast({ title: "Contact copied!" });
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
                {(item.facebookProfileLink || item.externalCustomerFacebookProfileLink) ? (
                  <>
                    <a
                      href={item.facebookProfileLink || item.externalCustomerFacebookProfileLink}
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
                        const value = item.facebookProfileLink || item.externalCustomerFacebookProfileLink;
                        if (value) navigator.clipboard.writeText(value);
                        toast({ title: "Facebook link copied!" });
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

      <Dialog open={manualDialogOpen} onOpenChange={(open) => {
        if (!open) resetManualOrderForm();
        else setManualDialogOpen(true);
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Manual Order</DialogTitle>
            <DialogDescription>
              Record a sale from a non-website source without creating a fake customer account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Order source</Label>
                <Select value={manualSource} onValueChange={(value) => setManualSource(value as OrderSource)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={manualStatus} onValueChange={(value) => setManualStatus(value as StatusUpdateInput["status"])}>
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
            </div>

            <div className="space-y-4 rounded-md border p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_120px_120px]">
                <div>
                  <Label>Search product</Label>
                  <Input
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Type to filter products"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={selectedProductQty}
                    onChange={(event) => setSelectedProductQty(Math.max(1, Number(event.target.value) || 1))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-transparent">Add</Label>
                  <Button onClick={handleAddManualProduct} className="mt-1 w-full" disabled={!selectedProductId && !filteredProducts.length}>
                    Add Item
                  </Button>
                </div>
              </div>

              <div>
                <Label>Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name} — {formatCurrency(product.price)} (stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {manualOrderItems.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Order items</div>
                  {manualOrderItems.map((item) => {
                    const product = productLookup.get(item.productId);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="flex items-center justify-between gap-3 rounded-md border p-2">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted">
                            {item.quantity} × {formatCurrency(product.price)} = {formatCurrency(product.price * item.quantity)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveManualItem(item.productId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>External customer name</Label>
                <Input
                  value={manualForm.externalCustomerName}
                  onChange={(event) => setManualForm((current) => ({ ...current, externalCustomerName: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>External customer phone</Label>
                <Input
                  value={manualForm.externalCustomerPhone}
                  onChange={(event) => setManualForm((current) => ({ ...current, externalCustomerPhone: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>External customer email</Label>
                <Input
                  value={manualForm.customerEmail}
                  onChange={(event) => setManualForm((current) => ({ ...current, customerEmail: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>WhatsApp / contact number</Label>
                <Input
                  value={manualForm.whatsappNumber}
                  onChange={(event) => setManualForm((current) => ({ ...current, whatsappNumber: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2">
                <Label>External customer Facebook profile link</Label>
                <Input
                  value={manualForm.externalCustomerFacebookProfileLink}
                  onChange={(event) => setManualForm((current) => ({ ...current, externalCustomerFacebookProfileLink: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Delivery / shipping address</Label>
                <Input
                  value={manualForm.shippingAddress}
                  onChange={(event) => setManualForm((current) => ({ ...current, shippingAddress: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Facebook profile link</Label>
                <Input
                  value={manualForm.facebookProfileLink}
                  onChange={(event) => setManualForm((current) => ({ ...current, facebookProfileLink: event.target.value }))}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Order notes</Label>
                <Textarea
                  value={manualForm.notes}
                  onChange={(event) => setManualForm((current) => ({ ...current, notes: event.target.value }))}
                  className="mt-1"
                  placeholder="Add any order notes..."
                />
              </div>
            </div>

            <div className="rounded-md border bg-muted/30 p-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(orderSummary.subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>Profit</span>
                <span>{formatCurrency(orderSummary.profit)}</span>
              </div>
              <div className="mt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(orderSummary.subtotal)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => resetManualOrderForm()}>
              Cancel
            </Button>
            <Button onClick={handleCreateManualOrder} disabled={createManualOrder.isPending || !manualOrderItems.length}>
              {createManualOrder.isPending ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
