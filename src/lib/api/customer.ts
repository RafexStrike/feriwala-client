import { apiClient, buildProductQuery, fetchWithAuth } from './client';
import {
  ProductBrief,
  ProductDetail,
  ProductCreateInput,
  ProductUpdateInput,
  Category,
  Tag,
  CategoryInput,
  TagInput,
  Cart,
  CartItem,
  Order,
  Review,
  User,
  CheckoutData,
  ReviewInput,
  AddToCartInput,
  UpdateCartInput,
} from "@/types/api";
import type { ProductQueryParams } from "./types";

export type {
  ProductQueryParams,
  ProductBrief,
  ProductDetail,
  ProductCreateInput,
  ProductUpdateInput,
  Category,
  Tag,
  CategoryInput,
  TagInput,
  Cart,
  CartItem,
  Order,
  Review,
  User,
  CheckoutData,
  ReviewInput,
  AddToCartInput,
  UpdateCartInput,
};

// Products
// Products
export async function getProducts(params: ProductQueryParams = {}) {
  const query = buildProductQuery(params);
  const response = await apiClient.get<any>(`/products?${query}`);
  
  // Handle the response structure from the backend
  // Backend returns: { success: true, data: [...products...], pagination: {...} }
  if (response && typeof response === 'object' && 'data' in response) {
    return {
      data: response.data || [],
      pagination: response.pagination || { page: 1, limit: 12, total: 0, pages: 0 }
    };
  }
  
  if (Array.isArray(response)) {
    return {
      data: response,
      pagination: { page: 1, limit: 12, total: response.length, pages: 1 }
    };
  }
  
  return {
    data: [],
    pagination: { page: 1, limit: 12, total: 0, pages: 0 }
  };
}

export async function getProduct(productId: string) {
  return apiClient.get<ProductDetail>(`/products/${productId}`);
}

export async function getFeaturedProducts(): Promise<ProductBrief[]> {
  const response = await apiClient.get<any>(`/products/featured`);
  if (Array.isArray(response)) {
    return response;
  }
  if (response && typeof response === 'object' && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}

export async function getProductReviews(productId: string) {
  return apiClient.get<Review[]>(`/products/${productId}/reviews`);
}

export async function createReview(productId: string, data: ReviewInput) {
  return apiClient.post<Review>(`/products/${productId}/reviews`, data);
}

export async function deleteReview(productId: string) {
  return apiClient.delete<{ message: string }>(`/products/${productId}/reviews`);
}

// Categories & Tags
export async function getCategories() {
  return apiClient.get<Category[]>(`/categories`);
}

export async function getTags() {
  return apiClient.get<Tag[]>(`/tags`);
}

// Cart
export async function getCart() {
  return apiClient.get<Cart>(`/cart`);
}

export async function addToCart(data: AddToCartInput) {
  return apiClient.post<Cart>(`/cart/items`, data);
}

export async function updateCartItem(productId: string, data: UpdateCartInput) {
  return apiClient.patch<Cart>(`/cart/items/${productId}`, data);
}

export async function removeCartItem(productId: string) {
  return apiClient.delete<Cart>(`/cart/items/${productId}`);
}

export async function clearCart() {
  return apiClient.delete<{ message: string }>(`/cart`);
}

// Orders
export async function createOrder(data: CheckoutData) {
  return apiClient.post<Order>(`/orders`, data);
}

export async function getOrders() {
  return apiClient.get<Order[]>(`/orders`);
}

export async function getOrder(orderId: string) {
  return apiClient.get<Order>(`/orders/${orderId}`);
}

// Auth / User
export async function getMe() {
  return apiClient.get<User>(`/users/me`);
}