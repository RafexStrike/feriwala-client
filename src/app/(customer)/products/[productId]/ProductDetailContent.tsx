"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Star, ChevronRight, Share2, Heart, MessageSquare, Truck, Shield, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StarRating } from "@/components/shared/StarRating";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { CartSidebar } from "@/components/shared/CartSidebar";
import { useProduct, useCreateReview, useDeleteReview } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRequireVerified } from "@/lib/auth/hooks";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { toast } from "sonner";
import type { ProductDetail, Review } from "@/types/api";

interface ProductDetailContentProps {
  initialProduct: ProductDetail;
  productId: string;
}

export function ProductDetailContent({ initialProduct, productId }: ProductDetailContentProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { data: product, isLoading, error } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");

  const createReviewMutation = useCreateReview();
  const deleteReviewMutation = useDeleteReview();

  const productData = product || initialProduct;
  const reviews = productData.reviews || [];
  const userReview = isAuthenticated && user ? reviews.find((r) => r.user?._id === user.id) : null;

  const avgRating = productData.averageRating || 0;
  const reviewCount = productData.reviewCount || 0;
  const maxQuantity = productData.stock || 0;
  const inStock = maxQuantity > 0;

  const handleAddToCart = async () => {
    if (!inStock) return;
    await addItem({ productId, quantity });
    setQuantity(1);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    if (!isAuthenticated) {
      setShowReviewDialog(false);
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        data: { rating: reviewForm.rating, comment: reviewForm.comment },
      });
      setShowReviewDialog(false);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReviewMutation.mutateAsync(productId);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment });
    setShowReviewDialog(true);
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { star, count, percentage };
  });

  if (isLoading && !initialProduct) {
    return <ProductDetailSkeleton />;
  }

  if (error || !productData) {
    return <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16 text-center">Product not found</div>;
  }

  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-10">
      <nav className="flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <a href="/products" className="hover:text-ink">Products</a>
        <ChevronRight className="h-4 w-4" />
        <a href={`/products/${productData.categories[0]?.slug}`} className="hover:text-ink">
          {productData.categories[0]?.name}
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink truncate max-w-[200px]">{productData.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-canvas">
            {productData.images[0] ? (
              <Image
                src={productData.images[selectedImage]}
                alt={productData.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                No image available
              </div>
            )}
          </div>
          {productData.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                    index === selectedImage ? "border-sky" : "border-transparent hover:border-line"
                  )}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === selectedImage}
                >
                  <Image src={image} alt={`${productData.name} - view ${index + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {productData.categories.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-3 py-1 text-xs font-medium text-sky">
                  {productData.categories[0].name}
                </span>
              )}
              <h1 className="mt-3 font-display text-3xl lg:text-4xl font-bold tracking-tight text-ink">
                {productData.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
{/* শেয়ার আর এড টু ফেভরেট বাটন  */}
              {/* <Button variant="ghost" size="icon" className="rounded-full" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Save">
                <Heart className="h-5 w-5" />
              </Button> */}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StarRating rating={avgRating} size="lg" />
            <span className="text-sm text-muted">
              {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
            </span>
          </div>

          <PriceDisplay price={productData.price} className="text-3xl font-bold text-ink" />

          {productData.stock <= 10 && productData.stock > 0 && (
            <p className="flex items-center gap-1 text-sm text-clay">
              <Truck className="h-4 w-4" />
              Only {productData.stock} left in stock
            </p>
          )}

          <p className="text-muted">{productData.briefDescription}</p>

          <div className="flex flex-wrap gap-2">
            {productData.tags.slice(0, 5).map((tag) => (
              <span key={tag._id} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs text-muted">
                {tag.name}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-line">
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={!inStock || createReviewMutation.isPending}
              >
                <Truck className="h-5 w-5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <MessageSquare className="h-5 w-5" />
                Write a Review
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted">
              {productData.stock} in stock
            </p>
          </div>

{/* ওভারল পুরা এপ্লিকেশন এর ফিচার  */}
          {/* <div className="grid gap-4 text-sm text-muted">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky/10 text-sky">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-ink">Free Shipping</p>
                <p>On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-clay/10 text-clay">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-ink">Easy Returns</p>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-honey/10 text-honey">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-ink">Secure Payment</p>
                <p>SSL encrypted checkout</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="mt-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 prose max-w-none">
            <div className="whitespace-pre-wrap text-muted">{productData.detailedDescription}</div>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <SpecRow label="Price" value={formatCurrency(productData.price)} />
              <SpecRow label="Stock" value={productData.stock.toString()} />
              <SpecRow
                label="Categories"
                value={productData.categories.map((c) => c.name).join(", ")}
              />
              <SpecRow
                label="Tags"
                value={productData.tags.map((t) => t.name).join(", ") || "None"}
              />
              <SpecRow label="Average Rating" value={avgRating.toFixed(1)} />
              <SpecRow label="Total Reviews" value={reviewCount.toString()} />
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-line bg-surface p-6 text-center">
                  <p className="font-display text-5xl font-bold text-ink">{avgRating.toFixed(1)}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <StarRating rating={avgRating} size="md" />
                    <span className="text-sm text-muted">out of 5</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
                </div>

                <div className="space-y-3">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-8 text-right text-sm text-muted">{star}★</span>
                      <div className="flex-1 h-2 rounded-full bg-canvas overflow-hidden">
                        <div
                          className="h-full bg-sky transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-muted">{count}</span>
                    </div>
                  ))}
                </div>

                {isAuthenticated && !userReview && (
                  <Button className="w-full" onClick={() => setShowReviewDialog(true)}>
                    Write a Review
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-line bg-surface p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted/50" />
                    <h3 className="font-medium text-ink">No reviews yet</h3>
                    <p className="mt-1 text-sm text-muted">Be the first to review this product</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      isOwn={!!user && review.user?._id === user.id}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        onSubmit={handleReviewSubmit}
        form={reviewForm}
        setForm={setReviewForm}
        error={reviewError}
        isSubmitting={createReviewMutation.isPending}
        editing={!!editingReview}
      />

      <CartSidebar />
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-line bg-canvas p-4">
      <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted">{label}</dt>
      <dd className="flex-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

function ReviewCard({
  review,
  isOwn,
  onEdit,
  onDelete,
}: {
  review: Review;
  isOwn: boolean;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky/10 text-sky font-medium">
            {review.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-ink">{review.user?.name || "Anonymous"}</p>
            <p className="text-sm text-muted">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {isOwn && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(review)} aria-label="Edit review">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(review._id)} aria-label="Delete review">
              <Trash2 className="h-4 w-4 text-clay" />
            </Button>
          </div>
        )}
      </div>
      <StarRating rating={review.rating} className="mt-3" />
      <p className="mt-3 text-muted">{review.comment}</p>
    </article>
  );
}

function ReviewDialog({
  open,
  onOpenChange,
  onSubmit,
  form,
  setForm,
  error,
  isSubmitting,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  form: { rating: number; comment: string };
  setForm: React.Dispatch<React.SetStateAction<{ rating: number; comment: string }>>;
  error: string;
  isSubmitting: boolean;
  editing: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Review" : "Write a Review"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update your review for this product" : "Share your experience with this product"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2">Your Rating</Label>
            <StarRating
              rating={form.rating}
              interactive
              onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
              size="lg"
            />
          </div>
          <div>
            <Label htmlFor="comment" className="block text-sm font-medium mb-2">
              Your Comment
            </Label>
            <Textarea
              id="comment"
              value={form.comment}
              onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
              rows={4}
              placeholder="Describe your experience..."
              minLength={2}
              maxLength={2000}
              required
            />
            <p className="mt-1 text-xs text-muted">
              {form.comment.length}/2000 characters
            </p>
          </div>
          {error && <p className="text-sm text-clay">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : editing ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-10 animate-pulse">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square rounded-[1.5rem] bg-canvas" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 rounded-lg bg-canvas" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-6 w-3/4 bg-canvas rounded" />
          <div className="h-10 w-1/2 bg-canvas rounded" />
          <div className="h-4 w-full bg-canvas rounded" />
          <div className="h-4 w-2/3 bg-canvas rounded" />
          <div className="h-4 w-1/3 bg-canvas rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-6 w-20 bg-canvas rounded-full" />)}
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-full bg-canvas rounded-full" />
            <div className="h-12 w-32 bg-canvas rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-16 h-64 bg-canvas rounded-[1.5rem]" />
    </div>
  );
}