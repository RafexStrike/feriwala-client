# Feriwala Frontend Implementation Plan

## Overview
Implement complete customer-facing and admin-facing frontend for the Feriwala e-commerce system using the existing Next.js 15 + React 19 + Tailwind CSS + shadcn/ui foundation.

---

## 1. Design System & Foundation (Already Exists)

### Current Design Tokens (Preserve & Extend)
**Location**: `tailwind.config.ts`, `src/config/theme.ts`, `src/app/globals.css`, `src/app/layout.tsx`

| Category | Tokens |
|----------|--------|
| Colors | `canvas`, `surface`, `ink`, `muted`, `line`, `sky`, `clay`, `honey` |
| Fonts | `display` (Instrument Serif), `sans` (Satoshi) |
| Shadows | `soft`, `glow` |
| Radius | `xl2` (1.5rem), `xl3` (2rem) |
| Gradients | `grain`, `hero` |
| Layout | `maxWidth`, `sectionGap` |
| Motion | `fast` (0.45s), `medium` (0.8s), `slow` (1.2s) |

### Existing Components (Reuse)
- `ButtonLink` - Primary/secondary button links
- `ProductCard` - Product display card
- `Reveal` - Scroll reveal animation
- `SectionShell` - Section wrapper
- `SiteHeader` - Navigation header
- `RootProviders` - Lenis/GSAP/Framer Motion providers

---

## 2. New Dependencies to Install

```bash
# State management & data fetching
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand  # for client-side UI state (cart sidebar, modals)

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# Date formatting
npm install date-fns

# Icons
npm install lucide-react

# Toast notifications
npm install sonner

# shadcn/ui components (via CLI)
npx shadcn@latest add button input label textarea select checkbox radio-group
npx shadcn@latest add dialog sheet drawer dropdown-menu popover
npx shadcn@latest add table pagination tabs badge avatar
npx shadcn@latest add skeleton toast form alert separator
npx shadcn@latest add accordion tooltip hover-card
npx shadcn@latest add command breadcrumb navigation-menu
```

---

## 3. Project Structure (Target)

```
src/
├── app/
│   ├── (customer)/                    # Customer app route group
│   │   ├── layout.tsx                 # Customer layout with header
│   │   ├── page.tsx                   # Home (exists)
│   │   ├── products/
│   │   │   ├── page.tsx               # Product listing (exists, needs API)
│   │   │   ├── [category]/page.tsx    # Category page (exists, needs API)
│   │   │   └── [productId]/page.tsx   # Product detail (NEW)
│   │   ├── cart/page.tsx              # Cart page (NEW)
│   │   ├── checkout/page.tsx          # Checkout page (NEW)
│   │   ├── orders/
│   │   │   ├── page.tsx               # Order history (NEW)
│   │   │   └── [orderId]/page.tsx     # Order detail (NEW)
│   │   ├── account/
│   │   │   ├── page.tsx               # Account dashboard (NEW)
│   │   │   ├── profile/page.tsx       # Profile settings (NEW)
│   │   │   └── reviews/page.tsx       # My reviews (NEW)
│   │   ├── login/page.tsx             # Login (NEW)
│   │   ├── register/page.tsx          # Register (NEW)
│   │   ├── verify-email/page.tsx      # Email verification (NEW)
│   │   └── forgot-password/page.tsx   # Password reset (NEW)
│   │
│   ├── (admin)/                       # Admin app route group
│   │   ├── layout.tsx                 # Admin layout with sidebar
│   │   ├── page.tsx                   # Redirect to /admin/dashboard
│   │   ├── dashboard/page.tsx         # Admin dashboard (NEW)
│   │   ├── products/
│   │   │   ├── page.tsx               # Product list (NEW)
│   │   │   ├── create/page.tsx        # Create product (NEW)
│   │   │   └── [productId]/edit/page.tsx # Edit product (NEW)
│   │   ├── categories/page.tsx        # Category management (NEW)
│   │   ├── tags/page.tsx              # Tag management (NEW)
│   │   ├── users/page.tsx             # User management (NEW)
│   │   ├── orders/
│   │   │   ├── page.tsx               # Order list (NEW)
│   │   │   └── [orderId]/page.tsx     # Order detail + status update (NEW)
│   │   ├── analytics/page.tsx         # Analytics page (NEW)
│   │   └── notifications/page.tsx     # Notification emails (NEW)
│   │
│   ├── layout.tsx                     # Root layout (exists)
│   ├── globals.css                    # Global styles (exists)
│   └── not-found.tsx                  # 404 page (NEW)
│
├── components/
│   ├── ui/                            # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── pagination.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── sheet.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── popover.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── tooltip.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── command.tsx
│   │   ├── alert.tsx
│   │   ├── separator.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   │
│   ├── shared/                        # Shared business components
│   │   ├── ProductCard.tsx            # Exists
│   │   ├── ProductGrid.tsx            # NEW - Grid with skeletons/empty
│   │   ├── ProductSkeleton.tsx        # NEW
│   │   ├── CartSidebar.tsx            # NEW - Slide-out cart
│   │   ├── CartItem.tsx               # NEW
│   │   ├── ReviewList.tsx             # NEW
│   │   ├── ReviewForm.tsx             # NEW
│   │   ├── StarRating.tsx             # NEW
│   │   ├── OrderCard.tsx              # NEW
│   │   ├── OrderStatusBadge.tsx       # NEW
│   │   ├── Pagination.tsx             # NEW
│   │   ├── SearchFilters.tsx          # NEW
│   │   ├── EmptyState.tsx             # NEW
│   │   ├── ErrorState.tsx             # NEW
│   │   ├── LoadingState.tsx           # NEW
│   │   ├── PriceDisplay.tsx           # NEW
│   │   ├── ImageGallery.tsx           # NEW
│   │   ├── Breadcrumb.tsx             # NEW
│   │   └── PageHeader.tsx             # NEW
│   │
│   ├── customer/                      # Customer-specific components
│   │   ├── AuthForm.tsx               # NEW - Login/Register forms
│   │   ├── ProtectedRoute.tsx         # NEW - Route guards
│   │   ├── VerifiedRoute.tsx          # NEW - Verified user guard
│   │   ├── ProductFilters.tsx         # NEW
│   │   ├── CheckoutForm.tsx           # NEW
│   │   └── OrderTimeline.tsx          # NEW
│   │
│   ├── admin/                         # Admin-specific components
│   │   ├── AdminLayout.tsx            # NEW - Sidebar + header
│   │   ├── AdminSidebar.tsx           # NEW
│   │   ├── AdminHeader.tsx            # NEW
│   │   ├── DataTable.tsx              # NEW - Reusable table
│   │   ├── ProductForm.tsx            # NEW - Create/edit product
│   │   ├── CategoryForm.tsx           # NEW
│   │   ├── TagForm.tsx                # NEW
│   │   ├── UserTable.tsx              # NEW
│   │   ├── OrderStatusSelect.tsx      # NEW
│   │   ├── AnalyticsCharts.tsx        # NEW
│   │   ├── NotificationEmailForm.tsx  # NEW
│   │   ├── InventoryAlert.tsx         # NEW
│   │   └── StatsCard.tsx              # NEW
│   │
│   ├── layout/                        # Existing layout components
│   │   ├── RootProviders.tsx
│   │   └── SiteHeader.tsx
│   │
│   ├── home/                          # Existing home components
│   └── sections/                      # Existing section components
│
├── lib/
│   ├── api/
│   │   ├── client.ts                  # NEW - Typed fetch wrapper
│   │   ├── customer.ts                # NEW - Customer API methods
│   │   ├── admin.ts                   # NEW - Admin API methods
│   │   ├── auth.ts                    # NEW - Auth API methods
│   │   └── types.ts                   # NEW - Shared API types
│   │
│   ├── auth/
│   │   ├── AuthProvider.tsx           # NEW - Session context
│   │   ├── useAuth.ts                 # NEW - Auth hook
│   │   ├── useRequireAuth.ts          # NEW - Require auth hook
│   │   └── useRequireVerified.ts      # NEW - Require verified hook
│   │
│   ├── hooks/
│   │   ├── useCart.ts                 # NEW - Cart state + mutations
│   │   ├── useProducts.ts             # NEW - Product queries
│   │   ├── useCategories.ts           # NEW
│   │   ├── useTags.ts                 # NEW
│   │   ├── useOrders.ts               # NEW
│   │   ├── useReviews.ts              # NEW
│   │   ├── useAdmin.ts                # NEW - Admin queries
│   │   └── useToast.ts                # NEW - Toast wrapper
│   │
│   ├── utils/
│   │   ├── cn.ts                      # Exists
│   │   ├── format.ts                  # NEW - Currency, date formatting
│   │   ├── validation.ts              # NEW - Zod schemas
│   │   └── constants.ts               # NEW - App constants
│   │
│   └── queryClient.ts                 # NEW - TanStack Query provider
│
├── config/
│   ├── theme.ts                       # Exists
│   ├── categories.ts                  # Exists (will be replaced by API)
│   └── products.ts                    # Exists (will be replaced by API)
│
├── types/
│   ├── api.ts                         # NEW - API response types
│   ├── product.ts                     # NEW - Product types
│   ├── cart.ts                        # NEW - Cart types
│   ├── order.ts                       # NEW - Order types
│   ├── user.ts                        # NEW - User types
│   ├── review.ts                      # NEW - Review types
│   ├── category.ts                    # NEW - Category types
│   ├── tag.ts                         # NEW - Tag types
│   └── admin.ts                       # NEW - Admin types
│
└── providers/
    ├── QueryProvider.tsx              # NEW
    └── AuthProvider.tsx               # NEW
```

---

## 4. API Layer Implementation

### 4.1 Core Types (`src/lib/api/types.ts`)
```typescript
// Base response types matching backend
interface ApiResponse<T> {
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

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### 4.2 Fetch Client (`src/lib/api/client.ts`)
- Centralized fetch with `credentials: 'include'`
- Automatic JSON parsing
- Typed error throwing
- Request/response interceptors for auth
- Base URL from `NEXT_PUBLIC_API_URL` env

### 4.3 Customer API (`src/lib/api/customer.ts`)
```typescript
// Products
getProducts(params: ProductQueryParams): Promise<ApiResponse<ProductBrief[]>>
getProduct(id: string): Promise<ApiResponse<ProductDetail>>

// Categories & Tags
getCategories(): Promise<ApiResponse<Category[]>>
getTags(): Promise<ApiResponse<Tag[]>>

// Cart (requires verified user)
getCart(): Promise<ApiResponse<Cart>>
addToCart(productId: string, quantity: number): Promise<ApiResponse<Cart>>
updateCartItem(productId: string, quantity: number): Promise<ApiResponse<Cart>>
removeCartItem(productId: string): Promise<ApiResponse<Cart>>
clearCart(): Promise<ApiResponse<{ message: string }>>

// Orders (requires verified user)
createOrder(data: CheckoutData): Promise<ApiResponse<Order>>
getOrders(): Promise<ApiResponse<Order[]>>
getOrder(id: string): Promise<ApiResponse<Order>>

// Reviews (public read, verified write)
getReviews(productId: string): Promise<ApiResponse<Review[]>>
createReview(productId: string, data: ReviewInput): Promise<ApiResponse<Review>>
deleteReview(productId: string): Promise<ApiResponse<{ message: string }>>

// Auth
getMe(): Promise<ApiResponse<User>>
```

### 4.4 Admin API (`src/lib/api/admin.ts`)
```typescript
// Dashboard & Analytics
getDashboard(): Promise<ApiResponse<DashboardData>>
getAnalytics(): Promise<ApiResponse<AnalyticsSummary>>
getInventory(): Promise<ApiResponse<InventorySummary>>

// Product CRUD
createProduct(data: ProductCreateInput): Promise<ApiResponse<Product>>
updateProduct(id: string, data: ProductUpdateInput): Promise<ApiResponse<Product>>
updateInventory(id: string, stock: number): Promise<ApiResponse<Product>>
deleteProduct(id: string): Promise<ApiResponse<{ message: string }>>

// Category CRUD
getCategories(): Promise<ApiResponse<Category[]>>
createCategory(data: CategoryInput): Promise<ApiResponse<Category>>
updateCategory(id: string, data: Partial<CategoryInput>): Promise<ApiResponse<Category>>
deleteCategory(id: string): Promise<ApiResponse<{ message: string }>>

// Tag CRUD
getTags(): Promise<ApiResponse<Tag[]>>
createTag(data: TagInput): Promise<ApiResponse<Tag>>
updateTag(id: string, data: Partial<TagInput>): Promise<ApiResponse<Tag>>
deleteTag(id: string): Promise<ApiResponse<{ message: string }>}

// User Management
getUsers(): Promise<ApiResponse<User[]>>
getUser(id: string): Promise<ApiResponse<User>>
updateUser(id: string, data: UserUpdateInput): Promise<ApiResponse<User>>
deleteUser(id: string): Promise<ApiResponse<{ message: string }>>

// Order Moderation
getOrders(): Promise<ApiResponse<Order[]>>
getOrder(id: string): Promise<ApiResponse<Order>>
updateOrderStatus(id: string, data: StatusUpdateInput): Promise<ApiResponse<Order>>

// Notification Emails
getNotificationEmails(): Promise<ApiResponse<NotificationRecipient[]>>
createNotificationEmail(data: NotificationEmailInput): Promise<ApiResponse<NotificationRecipient>>
updateNotificationEmail(id: string, data: Partial<NotificationEmailInput>): Promise<ApiResponse<NotificationRecipient>>
deleteNotificationEmail(id: string): Promise<ApiResponse<{ message: string }>>
```

---

## 5. Authentication System

### 5.1 Auth Provider (`src/lib/auth/AuthProvider.tsx`)
- Fetches `/api/v1/users/me` on mount
- Manages user state in React Context
- Provides `user`, `isLoading`, `isAuthenticated`, `isVerified`, `isAdmin`
- Auto-refreshes on focus/reconnect

### 5.2 Route Guards
```typescript
// ProtectedRoute - Requires authentication
<ProtectedRoute>
  <CartPage />
</ProtectedRoute>

// VerifiedRoute - Requires verified email
<VerifiedRoute>
  <CheckoutPage />
</VerifiedRoute>

// AdminRoute - Requires admin role
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

### 5.3 Auth Pages
- **Login** (`/login`) - Email/password, redirect to intended page
- **Register** (`/register`) - Name, email, password, redirect to verify-email
- **Verify Email** (`/verify-email`) - Token from URL, call verify endpoint
- **Forgot Password** (`/forgot-password`) - Request reset email
- **Reset Password** (`/reset-password`) - Token from URL, new password

---

## 6. Customer Pages Implementation

### 6.1 Product Listing (`/products`)
- Server-side fetch for first page (SEO)
- Client-side pagination, search, filter
- Filters: Category (multi-select), Tag (multi-select), Search, Sort
- Skeleton loaders during fetch
- Empty state: "No products found"
- URL sync for shareable filtered views

### 6.2 Category Page (`/products/[category]`)
- Filter products by category ID
- Category header with name, description, count
- Same grid/pagination as main listing

### 6.3 Product Detail (`/products/[productId]`)
- Image gallery (thumbnails + main)
- Name, price, stock status
- Brief + detailed description
- Category/tags as badges
- Average rating + review count
- Add to cart button (with quantity selector)
- Reviews section (paginated)
- Review form (if verified user, hasn't reviewed)

### 6.4 Cart (`/cart`)
- Slide-out sidebar (desktop) or full page (mobile)
- Cart items: image, name, price, quantity selector, line total
- Stock validation on quantity change
- Order summary: subtotal, shipping (calculated), total
- "Continue Shopping" + "Proceed to Checkout" CTAs
- Empty state with "Browse Products" button

### 6.5 Checkout (`/checkout`)
- Requires verified user
- Shipping address form (required)
- Email confirmation field (optional, pre-filled)
- Order notes (optional)
- Order summary sidebar (sticky on desktop)
- Place Order button → creates order, clears cart, redirects to success

### 6.6 Orders
- **History** (`/orders`) - List with status badges, date, total, "View Details"
- **Detail** (`/orders/[orderId]`) - Full items, status timeline, shipping address, notes

### 6.7 Account
- **Dashboard** - Recent orders, review stats, quick actions
- **Profile** - Name, email, password change, delete account
- **My Reviews** - List with edit/delete actions

---

## 7. Admin Pages Implementation

### 7.1 Admin Layout
- Collapsible sidebar navigation
- Top header: user avatar, logout, notification bell
- Responsive: drawer on mobile, sidebar on desktop
- Active route highlighting

### 7.2 Dashboard (`/admin/dashboard`)
- Stats cards: Total Users, Products, Orders, Revenue
- Recent orders table (5 latest)
- Low stock alerts (5 items)
- Quick actions: Create Product, View Orders

### 7.3 Products (`/admin/products`)
- DataTable with: Image, Name, Categories, Price, Stock, Status, Actions
- Server-side pagination, sorting, filtering
- Search by name
- Filter by category, status (active/inactive)
- Actions: Edit, Toggle Status, Delete
- "Create Product" button → `/admin/products/create`

### 7.4 Create/Edit Product
- Form with: Name, Brief Description, Detailed Description, Price, Cost Price, Stock, Categories (multi-select), Tags (multi-select), Images (URLs), Status
- Validation: required fields, positive numbers, valid URLs
- Image preview
- Submit → API → redirect to list with toast

### 7.5 Categories (`/admin/categories`)
- Table: Name, Slug, Description, Status, Product Count, Actions
- Create/Edit modal: Name, Description, Status
- Slug auto-generated from name

### 7.6 Tags (`/admin/tags`)
- Table: Name, Slug, Status, Product Count, Actions
- Create/Edit modal: Name, Status
- Slug auto-generated from name

### 7.7 Users (`/admin/users`)
- Table: Name, Email, Role, Verified, Last Login, Created, Actions
- Filter by role, verified status
- Actions: Edit role, Toggle active, Delete
- Cannot delete self

### 7.8 Orders (`/admin/orders`)
- Table: Order ID, Customer, Status, Total, Date, Actions
- Filter by status, date range
- Actions: View Detail, Update Status
- **Detail Page**: Full order info, status history, status update dropdown + note field

### 7.9 Analytics (`/admin/analytics`)
- Revenue/Profit/Sales charts (Last 30 Days, Monthly, Yearly)
- Chart library: Recharts or simple CSS-based bars
- Date range picker
- Export CSV button (future)

### 7.10 Notification Emails (`/admin/notifications`)
- Table: Email, Status, Types, Created By, Actions
- Create/Edit modal: Email, Active toggle, Notification Types (checkboxes: order-status, low-stock, new-user, etc.)

---

## 8. Shared UI Components

### 8.1 Data Display
- **ProductGrid** - Responsive grid with skeleton loading
- **ProductSkeleton** - Card-shaped placeholder
- **DataTable** - Sortable, paginated, selectable rows
- **Pagination** - Page numbers, prev/next, page size selector
- **StarRating** - Read-only and interactive versions
- **OrderStatusBadge** - Colored badges for pending/completed/canceled
- **PriceDisplay** - Formatted currency with optional original price

### 8.2 Form Components
- **SearchFilters** - Collapsible filter panel
- **CheckoutForm** - Address, email, notes with validation
- **ProductForm** - Full product CRUD form
- **CategoryForm/TagForm** - Simple modals

### 8.3 Feedback
- **Toast** - Sonner integration (success, error, info, loading)
- **EmptyState** - Illustration, message, action button
- **ErrorState** - Message, retry button, optional details
- **LoadingState** - Spinner or skeleton

### 8.4 Navigation
- **Breadcrumb** - Auto-generated from route
- **PageHeader** - Title, description, actions
- **AdminSidebar** - Collapsible navigation

---

## 9. State Management Strategy

### Server State (TanStack Query)
- Products, Categories, Tags, Cart, Orders, Reviews, Users, Analytics
- 5-10 minute cache for catalog data
- Immediate invalidation on mutations
- Optimistic updates for cart, reviews

### Client State (Zustand)
- Cart sidebar open/close
- Mobile menu open/close
- Admin sidebar collapse
- Active filters (URL-synced via nuqs or searchParams)
- Modal/dialog states

### Auth State (React Context)
- User object, loading, error
- Derived: isAuthenticated, isVerified, isAdmin

---

## 10. Error Handling

### API Errors
- 401 → Redirect to `/login?redirect=...`
- 403 (unverified) → Redirect to `/verify-email`
- 403 (non-admin) → Redirect to `/unauthorized`
- 400 (validation) → Show field errors in form
- 400 (stock) → Toast "Not enough stock available"
- 404 → Show not-found page
- 500 → Toast "Something went wrong"

### Form Validation
- Zod schemas matching backend validation
- Client-side validation on blur/submit
- Server errors mapped to field errors

---

## 11. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Install dependencies
- [ ] Install shadcn/ui components
- [ ] Set up API client, types, TanStack Query provider
- [ ] Implement AuthProvider and route guards
- [ ] Create auth pages (login, register, verify-email)
- [ ] Update SiteHeader with auth state (login/user menu)

### Phase 2: Customer Catalog (Week 1-2)
- [ ] Product listing with API integration
- [ ] Category filtering, search, pagination
- [ ] Product detail page with reviews
- [ ] Review display and creation (verified users)
- [ ] Shared components: ProductGrid, ProductSkeleton, StarRating, ReviewList

### Phase 3: Cart & Checkout (Week 2)
- [ ] Cart page with slide-out sidebar
- [ ] Add/update/remove cart items
- [ ] Checkout form with validation
- [ ] Order creation and success page
- [ ] Order history and detail pages

### Phase 4: Account & Reviews (Week 2-3)
- [ ] Account dashboard, profile, my reviews
- [ ] Review edit/delete
- [ ] Password change, account deletion

### Phase 5: Admin Foundation (Week 3)
- [ ] Admin layout with sidebar
- [ ] Admin route guard
- [ ] Dashboard with stats cards
- [ ] DataTable component

### Phase 6: Admin Catalog Management (Week 3-4)
- [ ] Products CRUD with DataTable
- [ ] Categories CRUD
- [ ] Tags CRUD
- [ ] Product form with validation

### Phase 7: Admin Users & Orders (Week 4)
- [ ] Users management table
- [ ] Orders management with status updates
- [ ] Order detail with timeline

### Phase 8: Admin Analytics & Notifications (Week 4)
- [ ] Analytics charts
- [ ] Notification email management
- [ ] Inventory alerts

### Phase 9: Polish & Testing (Week 5)
- [ ] End-to-end testing of all flows
- [ ] Responsive design verification
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Error boundary implementation
- [ ] Loading/empty/error states everywhere

---

## 12. Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://feriwala-server.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 13. Testing Checklist

### Customer Flows
- [ ] Browse products → filter → search → paginate
- [ ] View product detail → read reviews
- [ ] Register → verify email → login
- [ ] Add to cart → update quantity → remove
- [ ] Checkout → place order → view confirmation
- [ ] View order history → view order detail
- [ ] Write review → edit review → delete review
- [ ] Update profile → change password

### Admin Flows
- [ ] Login as admin → access dashboard
- [ ] Create/edit/delete product
- [ ] Create/edit/delete category
- [ ] Create/edit/delete tag
- [ ] View users → update role/status
- [ ] View orders → update status → notification sent
- [ ] View analytics charts
- [ ] Manage notification emails

### Edge Cases
- [ ] Unverified user tries cart/checkout → redirect to verify
- [ ] Non-admin tries admin routes → 403 page
- [ ] Out of stock product → disabled add to cart
- [ ] Network error → toast + retry
- [ ] Empty cart → empty state
- [ ] No search results → empty state
- [ ] Session expired → auto redirect to login

---

## 14. Code Quality Standards

- **TypeScript**: Strict mode, no `any`, proper inference
- **Components**: Single responsibility, composition over inheritance
- **API**: Centralized, typed, consistent error handling
- **Styles**: Only design tokens, no arbitrary values
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Lazy load admin pages, optimize images, cache queries