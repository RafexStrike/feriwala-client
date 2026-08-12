"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminProduct } from "@/lib/hooks/useAdmin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { ErrorState } from "@/components/shared/ErrorState";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const { data: product, isLoading, error, refetch } = useAdminProduct(productId);

  if (error) {
    return (
      <ErrorState
        title="Failed to load product"
        message={error.message || "An error occurred while fetching the product."}
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

  if (!product) {
    return (
      <ErrorState
        title="Product not found"
        message="The product you're looking for doesn't exist."
        onRetry={() => router.push("/admin/products")}
      />
    );
  }

  return (
    <div>
      <AdminHeader
        title="Edit Product"
        description={`Editing ৳{product.name}`}
      />
      <div className="max-w-2xl">
        <ProductForm product={product} mode="edit" />
      </div>
    </div>
  );
}
