export type OrderSource = 'website' | 'facebook' | 'phone' | 'physical_store' | 'in_person' | 'whatsapp' | 'telegram' | 'other';

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

export interface ProductBrief {
  _id: string;
  name: string;
  briefDescription: string;
  price: number;
  stock: number;
  categories: Category[];
  tags: Tag[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string };
  comment: string;
  rating: number;
  createdAt: string;
}

export interface ProductDetail extends ProductBrief {
  detailedDescription: string;
  costPrice: number;
  reviews: Review[];
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
  image?: string;
}

export interface CheckoutData {
  shippingAddress: string;
  customerEmail?: string;
  notes?: string;
  whatsappNumber: string;
  facebookProfileLink?: string;
}

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

export interface ReviewInput {
  rating: number;
  comment: string;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartInput {
  quantity: number;
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

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface TagInput {
  name: string;
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

export interface NotificationRecipient {
  _id: string;
  email: string;
  isActive: boolean;
  notificationTypes: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totals: {
    revenue: number;
    profit: number;
    sales: number;
  };
  last30Days: Array<{
    date: string;
    revenue: number;
    profit: number;
    sales: number;
  }>;
  monthly: Array<{
    month: string;
    revenue: number;
    profit: number;
    sales: number;
  }>;
  yearly: Array<{
    year: string;
    revenue: number;
    profit: number;
    sales: number;
  }>;
}

export interface DashboardData {
  users: number;
  products: number;
  orders: number;
  analytics: AnalyticsSummary;
}

export interface InventorySummary {
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stock: number;
    price: number;
    averageRating: number;
    reviewCount: number;
  }>;
  totals: {
    totalProducts: number;
    totalInventoryUnits: number;
  };
}