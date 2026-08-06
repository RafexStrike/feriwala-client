"use client";

import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useAdmin";
import { StatsCard } from "@/components/admin/StatsCard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message={error.message || "An error occurred while fetching dashboard data."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={isLoading ? "—" : formatNumber(data?.users ?? 0)}
          icon={Users}
          description="Registered customers"
        />
        <StatsCard
          title="Total Products"
          value={isLoading ? "—" : formatNumber(data?.products ?? 0)}
          icon={Package}
          description="Active listings"
        />
        <StatsCard
          title="Total Orders"
          value={isLoading ? "—" : formatNumber(data?.orders ?? 0)}
          icon={ShoppingCart}
          description="All time orders"
        />
        <StatsCard
          title="Total Revenue"
          value={isLoading ? "—" : formatCurrency(data?.analytics?.totals?.revenue ?? 0)}
          icon={DollarSign}
          description="All time revenue"
        />
      </div>

      {data?.analytics && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Revenue (30d)"
            value={formatCurrency(
              data.analytics.last30Days?.reduce((sum, d) => sum + d.revenue, 0) ?? 0
            )}
            icon={DollarSign}
            description="Last 30 days"
          />
          <StatsCard
            title="Profit (30d)"
            value={formatCurrency(
              data.analytics.last30Days?.reduce((sum, d) => sum + d.profit, 0) ?? 0
            )}
            icon={DollarSign}
            description="Last 30 days"
          />
          <StatsCard
            title="Sales (30d)"
            value={formatNumber(
              data.analytics.last30Days?.reduce((sum, d) => sum + d.sales, 0) ?? 0
            )}
            icon={ShoppingCart}
            description="Last 30 days"
          />
        </div>
      )}
    </div>
  );
}
