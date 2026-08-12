"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/shared/ProductFilters";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useProducts, useCategories, useTags } from "@/lib/hooks/useProducts";
import type { ProductBrief, ProductQueryParams } from "@/lib/api/types";

const PRODUCTS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const tagId = searchParams.get("tagId") || "";
  const sort = searchParams.get("sort") || "newest";

  const params: ProductQueryParams = useMemo(
    () => ({
      page,
      limit: PRODUCTS_PER_PAGE,
      search: search || undefined,
      categoryId: categoryId || undefined,
      tagId: tagId || undefined,
      sort: sort as ProductQueryParams["sort"],
    }),
    [page, search, categoryId, tagId, sort]
  );

  const { data: productsResponse, isLoading, error } = useProducts(params);
  const categoriesQuery = useCategories();
  const tagsQuery = useTags();
  const categories = categoriesQuery.data;
  const tags = tagsQuery.data;

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const productsList = products || [];
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || 0;

  const updateParams = useCallback(
    (newParams: Partial<ProductQueryParams>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 when filters change (except when explicitly changing page)
      if (newParams.page === undefined) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleSearch = useCallback(
    (value: string) => {
      updateParams({ search: value || undefined });
    },
    [updateParams]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      updateParams({ categoryId: value || undefined });
    },
    [updateParams]
  );

  const handleTagChange = useCallback(
    (value: string) => {
      updateParams({ tagId: value || undefined });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (value: ProductQueryParams["sort"]) => {
      updateParams({ sort: value });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasActiveFilters = Boolean(search || categoryId || tagId || sort !== "newest");

  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
      <PageHeader
        title="Products"
        description="Discover keyboards, mice, audio gear, desk accessories, and productivity gadgets hand-picked for quality and intention."
      />

      <div className="mt-10 flex gap-8 lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="flex-shrink-0 w-64 lg:w-72">
          <ProductFilters
            categories={categories || []}
            tags={tags || []}
            selectedCategory={categoryId}
            selectedTag={tagId}
            searchQuery={search}
            sortValue={sort}
            onSearchChange={handleSearch}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
            onSortChange={handleSortChange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            isLoading={categoriesQuery.isLoading || tagsQuery.isLoading}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <p className="text-sm text-muted">
              {totalItems} product{totalItems !== 1 ? "s" : ""} found
            </p>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as ProductQueryParams["sort"])}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-sky focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            {isLoading ? (
              <ProductGridSkeleton />
            ) : error ? (
              <div className="py-16 text-center">
                <p className="text-muted mb-4">Failed to load products</p>
                <button
                  onClick={() => router.refresh()}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-ink/5"
                >
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted mb-4">
                  {search
                    ? `No products found matching "${search}"`
                    : "No products available in this category"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-ink/5"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <ProductGrid products={products} />
                {totalPages > 1 && (
                  <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-10 justify-center"
                  />
                )}
              </>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}