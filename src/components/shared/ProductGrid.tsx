"use client";

import { cn } from "@/lib/cn";
import { ProductCardFromAPI } from "@/components/shared/ProductCardFromAPI";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Package } from "lucide-react";
import type { ProductBrief } from "@/lib/api/types";

interface ProductGridProps {
  products: ProductBrief[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading,
  error,
  onRetry,
  emptyMessage = "No products found",
  emptyDescription = "Try adjusting your search or filters to find what you're looking for.",
  className,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (error) {
    return (
      <ErrorState
        icon={Package}
        title="Failed to load products"
        message={error.message || "An error occurred while fetching products."}
        onRetry={onRetry}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-3", className)}>
      {products.map((product) => (
        <ProductCardFromAPI key={product._id} product={product} />
      ))}
    </div>
  );
}