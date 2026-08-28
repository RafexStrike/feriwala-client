import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDashboard,
  getAnalytics,
  getInventory,
  getAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  updateProductInventory,
  updateFeaturedProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminTags,
  createTag,
  updateTag,
  deleteTag,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAdminOrders,
  getAdminOrder,
  createManualOrder,
  updateOrderStatus,
  getNotificationEmails,
  createNotificationEmail,
  updateNotificationEmail,
  deleteNotificationEmail,
} from "@/lib/api/admin";
import type {
  ProductCreateInput,
  ProductUpdateInput,
  CategoryInput,
  TagInput,
  UserUpdateInput,
  StatusUpdateInput,
  NotificationEmailInput,
  ManualOrderInput,
} from "@/types/api";

// Dashboard & Analytics
export function useDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getDashboard,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: getAnalytics,
  });
}

export function useInventory() {
  return useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: getInventory,
  });
}

// Products
export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAdminProducts,
  });
}

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => getAdminProduct(productId),
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductCreateInput) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductUpdateInput }) =>
      updateProduct(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    },
  });
}

export function useUpdateProductInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      updateProductInventory(productId, stock),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateFeaturedProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isFeatured }: { productId: string; isFeatured: boolean }) =>
      updateFeaturedProduct(productId, isFeatured),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products", "featured"] });
    },
  });
}

// Categories
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAdminCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryInput) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: Partial<CategoryInput> }) =>
      updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

// Tags
export function useAdminTags() {
  return useQuery({
    queryKey: ["admin", "tags"],
    queryFn: getAdminTags,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TagInput) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tags"] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: Partial<TagInput> }) =>
      updateTag(tagId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tags"] });
    },
  });
}

// Users
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
  });
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserUpdateInput }) =>
      updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// Orders
export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getAdminOrders,
  });
}

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => getAdminOrder(orderId),
    enabled: !!orderId,
  });
}

export function useCreateManualOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManualOrderInput) => createManualOrder(data),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      if (order?._id) {
        queryClient.invalidateQueries({ queryKey: ["admin", "order", order._id] });
      }
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: StatusUpdateInput }) =>
      updateOrderStatus(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "order", orderId] });
    },
  });
}

// Notification Emails
export function useNotificationEmails() {
  return useQuery({
    queryKey: ["admin", "notification-emails"],
    queryFn: getNotificationEmails,
  });
}

export function useCreateNotificationEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NotificationEmailInput) => createNotificationEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notification-emails"] });
    },
  });
}

export function useUpdateNotificationEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipientId, data }: { recipientId: string; data: Partial<NotificationEmailInput> }) =>
      updateNotificationEmail(recipientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notification-emails"] });
    },
  });
}

export function useDeleteNotificationEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipientId: string) => deleteNotificationEmail(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notification-emails"] });
    },
  });
}
