"use client";

import { useState } from "react";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

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
  selectedCategory: string;
  selectedTag: string;
  searchQuery: string;
  sortValue: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isLoading: boolean;
}

export function ProductFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  searchQuery,
  sortValue,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  isLoading,
}: ProductFiltersProps) {
  const [searchExpanded, setSearchExpanded] = useState(true);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-full rounded-full border border-line bg-canvas" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-full rounded-full border border-line bg-canvas" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 space-y-6 border-r border-line/60 pr-6 lg:pr-0">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          autoComplete="off"
        />
      </form>

      <Separator />

      <details className="group" open={searchExpanded}>
        <summary
          className="flex items-center justify-between cursor-pointer list-none"
          onClick={() => setSearchExpanded(!searchExpanded)}
        >
          <h3 className="font-medium text-ink">Categories</h3>
          <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", searchExpanded && "rotate-180")} />
        </summary>
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id={`category-${category._id}`}
                checked={selectedCategory === category._id}
                onCheckedChange={(checked) => onCategoryChange(checked ? category._id : "")}
              />
              <span className="text-sm text-ink">{category.name}</span>
            </label>
          ))}
        </div>
      </details>

      <Separator />

      <details className="group" open={categoriesExpanded}>
        <summary
          className="flex items-center justify-between cursor-pointer list-none"
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
        >
          <h3 className="font-medium text-ink">Tags</h3>
          <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", categoriesExpanded && "rotate-180")} />
        </summary>
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {tags.map((tag) => (
            <label key={tag._id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id={`tag-${tag._id}`}
                checked={selectedTag === tag._id}
                onCheckedChange={(checked) => onTagChange(checked ? tag._id : "")}
              />
              <span className="text-sm text-ink">{tag.name}</span>
            </label>
          ))}
        </div>
      </details>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}