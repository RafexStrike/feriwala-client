"use client";

import { useAdminProducts, useUpdateFeaturedProduct } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

export default function FeaturedProductsPage() {
  const { data: products, isLoading, error, refetch } = useAdminProducts();
  const updateFeatured = useUpdateFeaturedProduct();

  const handleFeaturedChange = async (productId: string, isFeatured: boolean) => {
    try {
      await updateFeatured.mutateAsync({ productId, isFeatured });
      toast({ title: isFeatured ? "Product added to Featured" : "Product removed from Featured" });
    } catch (err) {
      toast({
        title: "Failed to update featured status",
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
        title="Featured Products"
        description="Choose which products appear in the Featured Products section on the homepage."
      />

      <DataTable
        data={products ?? []}
        columns={[
          {
            key: "isFeatured",
            header: "Featured",
            render: (item) => (
              <Checkbox
                checked={item.isFeatured}
                onCheckedChange={(checked) => handleFeaturedChange(item._id, checked === true)}
                aria-label="Toggle featured"
              />
            ),
          },
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
        ]}
        isLoading={isLoading}
        emptyTitle="No products"
        emptyDescription="Create your first product to manage featured products."
        emptyIcon={Package}
        keyExtractor={(item) => item._id}
      />
    </div>
  );
}
