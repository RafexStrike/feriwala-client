"use client";

import { useAnalytics } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react";

function SimpleBarChart({
  data,
  dataKey,
  label,
  color = "bg-sky",
}: {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  label: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map((d) => Number(d[dataKey]) || 0));

  if (maxValue === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted">{label}</p>
      <div className="flex h-48 items-end gap-2">
        {data.slice(-12).map((item, i) => {
          const value = Number(item[dataKey]) || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-muted">{formatNumber(value)}</span>
              <div
                className={`w-full rounded-t-md ৳{color}`}
                style={{ height: `৳{Math.max(height, 4)}%` }}
              />
              <span className="text-xs text-muted truncate w-full text-center">
                {String(item.month || item.date || item.year || "").slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, error, refetch } = useAnalytics();

  if (error) {
    return (
      <ErrorState
        title="Failed to load analytics"
        message={error.message || "An error occurred while fetching analytics data."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Analytics"
        description="Detailed performance metrics and trends"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={isLoading ? "—" : formatCurrency(data?.totals?.revenue ?? 0)}
          icon={DollarSign}
          description="All time revenue"
        />
        <StatsCard
          title="Total Profit"
          value={isLoading ? "—" : formatCurrency(data?.totals?.profit ?? 0)}
          icon={TrendingUp}
          description="All time profit"
        />
        <StatsCard
          title="Total Sales"
          value={isLoading ? "—" : formatNumber(data?.totals?.sales ?? 0)}
          icon={ShoppingCart}
          description="All time sales"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.25rem] border border-line bg-surface p-6 shadow-soft">
          <SimpleBarChart
            data={data?.last30Days ?? []}
            dataKey="revenue"
            label="Revenue (Last 30 Days)"
            color="bg-sky"
          />
        </div>
        <div className="rounded-[1.25rem] border border-line bg-surface p-6 shadow-soft">
          <SimpleBarChart
            data={data?.monthly ?? []}
            dataKey="revenue"
            label="Monthly Revenue"
            color="bg-clay"
          />
        </div>
        <div className="rounded-[1.25rem] border border-line bg-surface p-6 shadow-soft">
          <SimpleBarChart
            data={data?.yearly ?? []}
            dataKey="revenue"
            label="Yearly Revenue"
            color="bg-honey"
          />
        </div>
        <div className="rounded-[1.25rem] border border-line bg-surface p-6 shadow-soft">
          <SimpleBarChart
            data={data?.monthly ?? []}
            dataKey="sales"
            label="Monthly Sales"
            color="bg-sky"
          />
        </div>
      </div>
    </div>
  );
}
