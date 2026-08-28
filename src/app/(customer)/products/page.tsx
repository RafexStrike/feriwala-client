"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/shared/ProductFilters";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { CustomPagination } from "@/components/shared/CustomPagination";
import { useProducts, useCategories, useTags } from "@/lib/hooks/useProducts";
import type { ProductQueryParams } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const PRODUCTS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const categoryIds = searchParams.getAll("categoryId");
  const tagIds = searchParams.getAll("tagId");
  const sort = searchParams.get("sort") || "newest";

  const params: ProductQueryParams = useMemo(
    () => ({
      page,
      limit: PRODUCTS_PER_PAGE,
      search: search || undefined,
      categoryId: categoryIds.length ? categoryIds : undefined,
      tagId: tagIds.length ? tagIds : undefined,
      sort: sort as ProductQueryParams["sort"],
    }),
    [page, search, categoryIds, tagIds, sort]
  );

  const { data: productsResponse, isLoading, error } = useProducts(params);
  const categoriesQuery = useCategories();
  const tagsQuery = useTags();
  const categories = categoriesQuery.data || [];
  const tags = tagsQuery.data || [];

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || 0;

  const updateParams = useCallback(
    (newParams: Partial<ProductQueryParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
          return;
        }

        if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((item) => {
            if (item !== undefined && item !== null && item !== "") {
              params.append(key, String(item));
            }
          });
          return;
        }

        params.set(key, String(value));
      });

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
      const nextCategoryIds = categoryIds.includes(value)
        ? categoryIds.filter((categoryId) => categoryId !== value)
        : [...categoryIds, value];

      updateParams({ categoryId: nextCategoryIds.length ? nextCategoryIds : undefined });
    },
    [categoryIds, updateParams]
  );

  const handleTagChange = useCallback(
    (value: string) => {
      const nextTagIds = tagIds.includes(value)
        ? tagIds.filter((tagId) => tagId !== value)
        : [...tagIds, value];

      updateParams({ tagId: nextTagIds.length ? nextTagIds : undefined });
    },
    [tagIds, updateParams]
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
    setIsMobileFiltersOpen(false);
  }, [router, pathname]);

  const hasActiveFilters = Boolean(search || categoryIds.length || tagIds.length || sort !== "newest");
  const activeFilterCount =
    Number(Boolean(search)) + categoryIds.length + tagIds.length + Number(sort !== "newest");

  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-1.25rem))] py-16">
      <PageHeader
        title="Products"
        description="Discover keyboards, mice, audio gear, desk accessories, and productivity gadgets hand-picked for quality and intention."
      />

      <div className="mt-6 flex items-center justify-end gap-3 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            className="pl-10"
            autoComplete="off"
          />
        </div>
      </div>

      <div className={cn("mt-10 grid gap-6", isSidebarCollapsed ? "lg:grid-cols-[0_minmax(0,1fr)]" : "lg:grid-cols-[260px_minmax(0,1fr)]")}>
        <aside className={cn("min-w-0 transition-all duration-200", isSidebarCollapsed && "hidden lg:block lg:w-0 lg:overflow-hidden")}>
          {!isSidebarCollapsed && (
            <ProductFilters
              categories={categories}
              tags={tags}
              selectedCategories={categoryIds}
              selectedTags={tagIds}
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
          )}
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn("hidden lg:inline-flex", !isSidebarCollapsed && "border-sky text-sky")}
                onClick={() => setIsSidebarCollapsed((value) => !value)}
                aria-label={isSidebarCollapsed ? "Open product filters" : "Close product filters"}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {isSidebarCollapsed ? "Open filters" : "Hide filters"}
              </Button>
              <p className="text-sm text-muted">
                {totalItems} product{totalItems !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) => handleSortChange(event.target.value as ProductQueryParams["sort"])}
                  className="appearance-none rounded-full border border-line bg-surface px-4 py-2 pr-9 text-sm text-ink focus:border-sky focus:outline-none"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="top-rated">Top Rated</option>
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <ProductFilters
              categories={categories}
              tags={tags}
              selectedCategories={categoryIds}
              selectedTags={tagIds}
              searchQuery={search}
              sortValue={sort}
              onSearchChange={handleSearch}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onSortChange={handleSortChange}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              isLoading={categoriesQuery.isLoading || tagsQuery.isLoading}
              isMobile
              isOpen={isMobileFiltersOpen}
              onOpenChange={setIsMobileFiltersOpen}
              showSearchInput={false}
            />
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
      {[...Array(6)].map((_, index) => (
        <ProductSkeleton key={index} />
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