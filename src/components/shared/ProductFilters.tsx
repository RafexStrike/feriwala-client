"use client";

import { useEffect, useState } from "react";
import { Search, X, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface ProductFiltersProps {
  categories: Category[];
  tags: Tag[];
  selectedCategories: string[];
  selectedTags: string[];
  searchQuery: string;
  sortValue: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isLoading: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        aria-expanded={expanded}
        aria-controls={`${title.toLowerCase()}-content`}
      >
        <h3 className="font-medium text-ink">{title}</h3>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div id={`${title.toLowerCase()}-content`} className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductFilters({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  searchQuery,
  sortValue,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  isLoading,
  isMobile = false,
  isOpen = false,
  onOpenChange,
}: ProductFiltersProps) {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const nextTrimmed = searchValue.trim();
    if (nextTrimmed === searchQuery.trim()) return;

    const timeoutId = window.setTimeout(() => {
      onSearchChange(nextTrimmed);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue, searchQuery, onSearchChange]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearchChange(searchValue.trim());
  };

  const activeFilterCount =
    Number(Boolean(searchQuery.trim())) +
    selectedCategories.length +
    selectedTags.length +
    Number(sortValue !== "newest");

  const content = (
    <>
      <form onSubmit={handleSearchSubmit} className="relative" aria-label="Search products">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          aria-label="Search products"
          placeholder="Search products..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="pl-10"
          autoComplete="off"
        />
      </form>

      <Separator />

      <div className="space-y-5">
        <FilterSection title="Categories" expanded={categoriesExpanded} onToggle={() => setCategoriesExpanded((value) => !value)}>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted">No categories available.</p>
            ) : (
              categories.map((category) => (
                <label key={category._id} className="flex items-center gap-2 text-sm text-ink">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={() => onCategoryChange(category._id)}
                  />
                  <span className="truncate">{category.name}</span>
                </label>
              ))
            )}
          </div>
        </FilterSection>

        <Separator />

        <FilterSection title="Tags" expanded={tagsExpanded} onToggle={() => setTagsExpanded((value) => !value)}>
          <div className="space-y-2">
            {tags.length === 0 ? (
              <p className="text-sm text-muted">No tags available.</p>
            ) : (
              tags.map((tag) => (
                <label key={tag._id} className="flex items-center gap-2 text-sm text-ink">
                  <Checkbox
                    id={`tag-${tag._id}`}
                    checked={selectedTags.includes(tag._id)}
                    onCheckedChange={() => onTagChange(tag._id)}
                  />
                  <span className="truncate">{tag.name}</span>
                </label>
              ))
            )}
          </div>
        </FilterSection>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-ink">Sort</label>
        <select
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none"
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="top-rated">Top Rated</option>
        </select>
      </div>

      {hasActiveFilters && (
        <Button type="button" variant="outline" className="w-full gap-2" onClick={onClearFilters}>
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-full rounded-full border border-line bg-canvas" />
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 w-full rounded-full border border-line bg-canvas" />
          ))}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 justify-center gap-2"
            onClick={() => onOpenChange?.(true)}
            aria-label="Open product filters"
          >
            <Filter className="h-4 w-4" />
            <span>
              Filters{activeFilterCount > 0 ? ` • ${activeFilterCount}` : ""}
            </span>
          </Button>
          <div className="relative min-w-[120px] flex-1">
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="w-full appearance-none rounded-full border border-line bg-surface px-3 py-2 pr-8 text-sm text-ink focus:border-sky focus:outline-none"
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

        <SheetContent side="right" className="w-[92vw] max-w-sm p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-line px-6 pb-4 pt-6 text-left">
              <SheetTitle className="text-lg font-semibold text-ink">Filters</SheetTitle>
              <SheetDescription className="text-sm text-muted">
                Refine products by search, category, tags, and sort order.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {content}
            </div>

            <div className="border-t border-line px-6 py-4">
              <Button type="button" className="w-full" onClick={() => onOpenChange?.(false)}>
                Apply filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="sticky top-24 space-y-6">
      {content}
    </div>
  );
}