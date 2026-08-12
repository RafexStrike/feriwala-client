"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { useAdminProducts, useDeleteProduct } from "@/lib/hooks/useAdmin";
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
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const { data: products, isLoading, error, refetch } = useAdminProducts();
  const deleteProduct = useDeleteProduct();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast({ title: "Product deleted successfully" });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        message={error.message || "An error occurred while fetching products."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button asChild>
            <Link href="/admin/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        }
      />

      <DataTable
        data={products ?? []}
        columns={[
          {
            key: "name",
            header: "Product",
            render: (item) => (
              <div className="flex items-center gap-3">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas">
                    <Package className="h-5 w-5 text-muted" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-sm text-muted truncate max-w-[200px]">
                    {item.briefDescription}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "price",
            header: "Price",
            render: (item) => formatCurrency(item.price),
          },
          {
            key: "stock",
            header: "Stock",
            render: (item) => (
              <Badge variant={item.stock === 0 ? "destructive" : "secondary"}>
                {item.stock}
              </Badge>
            ),
          },
          {
            key: "isActive",
            header: "Status",
            render: (item) => (
              <Badge variant={item.isActive ? "default" : "secondary"}>
                {item.isActive ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (item) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/products/৳{item._id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(item._id)}
                >
                  <Trash2 className="h-4 w-4 text-clay" />
                </Button>
              </div>
            ),
          },
        ]}
        isLoading={isLoading}
        emptyTitle="No products"
        emptyDescription="Create your first product to get started."
        emptyIcon={Package}
        keyExtractor={(item) => item._id}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
