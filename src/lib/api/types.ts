export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  details?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ProductBrief {
  _id: string;
  name: string;
  briefDescription: string;
  price: number;
  stock: number;
  categories: { _id: string; name: string; slug: string }[];
  tags: { _id: string; name: string; slug: string }[];
  images: string[];
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends ProductBrief {
  detailedDescription: string;
  costPrice: number;
  reviews: Review[];
}

export interface Review {
  _id: string;
  user: { name: string };
  comment: string;
  rating: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CartItem {
  product: ProductBrief;
  quantity: number;
  priceSnapshot: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  costPrice: number;
}

export interface OrderStatusHistory {
  status: 'pending' | 'completed' | 'canceled';
  note: string;
  changedBy: string | null;
  changedAt: string;
}

export interface Order {
  _id: string;
  user: string | null;
  source: OrderSource;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'canceled';
  subtotal: number;
  total: number;
  profit: number;
  shippingAddress: string;
  customerEmail: string;
  whatsappNumber: string;
  facebookProfileLink?: string;
  externalCustomerName?: string;
  externalCustomerPhone?: string;
  externalCustomerFacebookProfileLink?: string;
  statusHistory: OrderStatusHistory[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  _id: string;
  email: string;
  isActive: boolean;
  notificationTypes: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// Admin types
export interface DashboardData {
  users: number;
  products: number;
  orders: number;
  analytics: AnalyticsSummary;
}

export interface AnalyticsSummary {
  totals: { revenue: number; profit: number; sales: number };
  last30Days: Array<{ date: string; revenue: number; profit: number; sales: number }>;
  monthly: Array<{ month: string; revenue: number; profit: number; sales: number }>;
  yearly: Array<{ year: string; revenue: number; profit: number; sales: number }>;
}

export interface InventorySummary {
  lowStockProducts: ProductBrief[];
  totals: { totalProducts: number; totalInventoryUnits: number };
}

// Input types
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tagId?: string;
  isActive?: boolean;
  sort?: string;
}

export interface ProductCreateInput {
  name: string;
  briefDescription: string;
  detailedDescription: string;
  price: number;
  costPrice: number;
  stock: number;
  categoryIds: string[];
  tagIds: string[];
  images: string[];
}

export interface ProductUpdateInput {
  name?: string;
  briefDescription?: string;
  detailedDescription?: string;
  price?: number;
  costPrice?: number;
  stock?: number;
  categoryIds?: string[];
  tagIds?: string[];
  images?: string[];
  isActive?: boolean;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface TagInput {
  name: string;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartInput {
  quantity: number;
}

export interface CheckoutData {
  shippingAddress: string;
  customerEmail?: string;
  notes?: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

export interface StatusUpdateInput {
  status: 'pending' | 'completed' | 'canceled';
  note?: string;
}

export interface NotificationEmailInput {
  email: string;
  isActive?: boolean;
  notificationTypes?: string[];
}

export type OrderSource = 'website' | 'facebook' | 'phone' | 'physical_store' | 'in_person' | 'whatsapp' | 'telegram' | 'other';

export interface ManualOrderItemInput {
  productId: string;
  quantity: number;
}

export interface ManualOrderInput {
  source?: OrderSource;
  status?: 'pending' | 'completed' | 'canceled';
  shippingAddress?: string;
  customerEmail?: string;
  whatsappNumber?: string;
  facebookProfileLink?: string;
  externalCustomerName?: string;
  externalCustomerPhone?: string;
  externalCustomerFacebookProfileLink?: string;
  notes?: string;
  items: ManualOrderItemInput[];
}