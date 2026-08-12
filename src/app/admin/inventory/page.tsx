"use client";

import { Package, AlertTriangle } from "lucide-react";
import { useInventory } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

export default function InventoryPage() {
  const { data, isLoading, error, refetch } = useInventory();

  if (error) {
    return (
      <ErrorState
        title="Failed to load inventory"
        message={error.message || "An error occurred while fetching inventory data."}
        onRetry={refetch}
      />
    );
  }

  const lowStockProducts = data?.lowStockProducts ?? [];

  return (
    <div>
      <AdminHeader
        title="Inventory"
        description="Monitor stock levels and low inventory alerts"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          title="Total Products"
          value={isLoading ? "—" : formatNumber(data?.totals?.totalProducts ?? 0)}
          icon={Package}
          description="Active products"
        />
        <StatsCard
          title="Total Inventory"
          value={isLoading ? "—" : formatNumber(data?.totals?.totalInventoryUnits ?? 0)}
          icon={Package}
          description="Total units in stock"
        />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl text-ink mb-4">Low Stock Products</h2>
        <DataTable
          data={lowStockProducts}
          columns={[
            {
              key: "name",
              header: "Product",
              render: (item) => (
                <span className="font-medium text-ink">{item.name}</span>
              ),
            },
            {
              key: "stock",
              header: "Stock",
              render: (item) => (
                <Badge
                  variant={item.stock === 0 ? "destructive" : "secondary"}
                >
                  {item.stock} units
                </Badge>
              ),
            },
            {
              key: "price",
              header: "Price",
              render: (item) => formatCurrency(item.price),
            },
            {
              key: "averageRating",
              header: "Rating",
              render: (item) => (
                <span className="text-muted">
                  {item.averageRating > 0 ? `৳{item.averageRating.toFixed(1)} (৳{item.reviewCount})` : "No reviews"}
                </span>
              ),
            },
          ]}
          isLoading={isLoading}
          emptyTitle="No low stock products"
          emptyDescription="All products have sufficient stock."
          emptyIcon={AlertTriangle}
          keyExtractor={(item) => item._id}
        />
      </div>
    </div>
  );
}
