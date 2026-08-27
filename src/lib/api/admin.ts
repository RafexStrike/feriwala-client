import { apiClient } from './client';
import type {
  ProductBrief,
  ProductDetail,
  Category,
  Tag,
  Order,
  User,
  NotificationRecipient,
  DashboardData,
  AnalyticsSummary,
  InventorySummary,
  ProductCreateInput,
  ProductUpdateInput,
  CategoryInput,
  TagInput,
  UserUpdateInput,
  StatusUpdateInput,
  NotificationEmailInput,
  ManualOrderInput,
} from '@/types/api';

// Dashboard & Analytics
export async function getDashboard() {
  return apiClient.get<DashboardData>(`/admin/dashboard`);
}

export async function getAnalytics() {
  return apiClient.get<AnalyticsSummary>(`/admin/analytics`);
}

export async function getInventory() {
  return apiClient.get<InventorySummary>(`/admin/inventory`);
}

// Products
export async function getAdminProducts() {
  return apiClient.get<ProductBrief[]>(`/products`);
}

export async function getAdminProduct(productId: string) {
  return apiClient.get<ProductDetail>(`/products/${productId}`);
}

export async function createProduct(data: ProductCreateInput) {
  return apiClient.post<ProductDetail>(`/products`, data);
}

export async function updateProduct(productId: string, data: ProductUpdateInput) {
  return apiClient.patch<ProductDetail>(`/products/${productId}`, data);
}

export async function updateProductInventory(productId: string, stock: number) {
  return apiClient.patch<ProductDetail>(`/products/${productId}/inventory`, { stock });
}

export async function deleteProduct(productId: string) {
  return apiClient.delete<{ message: string }>(`/products/${productId}`);
}

// Categories
export async function getAdminCategories() {
  return apiClient.get<Category[]>(`/categories`);
}

export async function createCategory(data: CategoryInput) {
  return apiClient.post<Category>(`/categories`, data);
}

export async function updateCategory(categoryId: string, data: Partial<CategoryInput>) {
  return apiClient.patch<Category>(`/categories/${categoryId}`, data);
}

export async function deleteCategory(categoryId: string) {
  return apiClient.delete<{ message: string }>(`/categories/${categoryId}`);
}

// Tags
export async function getAdminTags() {
  return apiClient.get<Tag[]>(`/tags`);
}

export async function createTag(data: TagInput) {
  return apiClient.post<Tag>(`/tags`, data);
}

export async function updateTag(tagId: string, data: Partial<TagInput>) {
  return apiClient.patch<Tag>(`/tags/${tagId}`, data);
}

export async function deleteTag(tagId: string) {
  return apiClient.delete<{ message: string }>(`/tags/${tagId}`);
}

// Users
export async function getUsers() {
  return apiClient.get<User[]>(`/users`);
}

export async function getUser(userId: string) {
  return apiClient.get<User>(`/users/${userId}`);
}

export async function updateUser(userId: string, data: UserUpdateInput) {
  return apiClient.patch<User>(`/users/${userId}`, data);
}

export async function deleteUser(userId: string) {
  return apiClient.delete<{ message: string }>(`/users/${userId}`);
}

// Orders
export async function getAdminOrders() {
  return apiClient.get<Order[]>(`/orders`);
}

export async function getAdminOrder(orderId: string) {
  return apiClient.get<Order>(`/orders/${orderId}`);
}

export async function createManualOrder(data: ManualOrderInput) {
  return apiClient.post<Order>(`/admin/orders`, data);
}

export async function updateOrderStatus(orderId: string, data: StatusUpdateInput) {
  return apiClient.patch<Order>(`/orders/${orderId}/status`, data);
}

// Notification Emails
export async function getNotificationEmails() {
  return apiClient.get<NotificationRecipient[]>(`/admin/notification-emails`);
}

export async function createNotificationEmail(data: NotificationEmailInput) {
  return apiClient.post<NotificationRecipient>(`/admin/notification-emails`, data);
}

export async function updateNotificationEmail(recipientId: string, data: Partial<NotificationEmailInput>) {
  return apiClient.patch<NotificationRecipient>(`/admin/notification-emails/${recipientId}`, data);
}

export async function deleteNotificationEmail(recipientId: string) {
  return apiClient.delete<{ message: string }>(`/admin/notification-emails/${recipientId}`);
}