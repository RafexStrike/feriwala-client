"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { productCreateSchema } from "@/lib/utils/validation";
import { useAdminCategories, useAdminTags, useCreateProduct, useUpdateProduct } from "@/lib/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { ProductDetail, ProductCreateInput, ProductUpdateInput } from "@/types/api";

interface ProductFormProps {
  product?: ProductDetail;
  mode: "create" | "edit";
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { data: categories } = useAdminCategories();
  const { data: tags } = useAdminTags();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const form = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          briefDescription: product.briefDescription,
          detailedDescription: product.detailedDescription,
          price: product.price,
          costPrice: product.costPrice,
          stock: product.stock,
          categoryIds: product.categories.map((c) => c._id),
          tagIds: product.tags.map((t) => t._id),
          images: product.images,
        }
      : {
          name: "",
          briefDescription: "",
          detailedDescription: "",
          price: 0,
          costPrice: 0,
          stock: 0,
          categoryIds: [],
          tagIds: [],
          images: [],
        },
  });

  const onSubmit = async (data: ProductCreateInput) => {
    try {
      if (mode === "create") {
        await createProduct.mutateAsync(data);
        toast({ title: "Product created successfully" });
        router.push("/admin/products");
      } else if (product) {
        await updateProduct.mutateAsync({ productId: product._id, data });
        toast({ title: "Product updated successfully" });
        router.push("/admin/products");
      }
    } catch (err) {
      toast({
        title: mode === "create" ? "Failed to create product" : "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="briefDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Description</FormLabel>
              <FormControl>
                <Input placeholder="Short description for product cards" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailedDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full product description"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Select
                  value={field.value[0] || ""}
                  onValueChange={(value) => {
                    if (value && !field.value.includes(value)) {
                      field.onChange([...field.value, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((id) => {
                    const category = categories?.find((c) => c._id === id);
                    return category ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-3 py-1 text-sm text-sky"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(field.value.filter((v) => v !== id));
                          }}
                          className="ml-1 hover:text-clay"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !field.value?.includes(value)) {
                      field.onChange([...(field.value || []), value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags?.map((tag) => (
                      <SelectItem key={tag._id} value={tag._id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((id) => {
                    const tag = tags?.find((t) => t._id === id);
                    return tag ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 rounded-full bg-honey/10 px-3 py-1 text-sm text-honey"
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(field.value.filter((v) => v !== id));
                          }}
                          className="ml-1 hover:text-clay"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter image URLs (one per line)"
                  className="min-h-[100px]"
                  value={field.value?.join("\n") || ""}
                  onChange={(e) => {
                    const urls = e.target.value
                      .split("\n")
                      .map((url) => url.trim())
                      .filter((url) => url.length > 0);
                    field.onChange(urls);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : mode === "create"
              ? "Create Product"
              : "Update Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
