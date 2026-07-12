# Codebase Dump



---
## FILE: 01-system-overview.md

```md
# 01-System Overview

## Overview

The Feriwala Server is a robust e-commerce backend providing catalog management, shopping cart functionality, order processing, and an administrative dashboard.

### Technical Stack
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Better Auth
- **Storage**: Local Filesystem (for images)
- **Logging**: Pino

## API Versioning

### Base URLs
- **API Version 1**: `/api/v1`
- **Authentication**: `/api/auth`

### Route Grouping
Routes are grouped by resource:
- `/api/v1/users` - User profile and account management
- `/api/v1/products` - Product catalog and reviews
- `/api/v1/categories` - Product categories
- `/api/v1/tags` - Product tags
- `/api/v1/cart` - Shopping cart management
- `/api/v1/orders` - Order placement and history
- `/api/v1/admin` - Administrative tools and analytics

## Authentication

The system utilizes **Better Auth** for session-based authentication.

### Flow
1. **Registration/Login**: Handled via `/api/auth/*` endpoints.
2. **Session Lifecycle**: Better Auth manages sessions in MongoDB.
3. **Validation**: The `requireAuth` middleware validates the session using request headers.
4. **Verification**: Some endpoints require `emailVerified: true` via the `requireVerifiedUser` middleware.

### Cookie Behavior
- **Storage**: Sessions are stored in cookies.
- **Security**: Cookies are configured as `HttpOnly` and `Secure` (in production) to prevent XSS and MITM attacks.
- **SameSite**: Configured to prevent CSRF.

## Authorization

The system implements Role-Based Access Control (RBAC).

| Role | Permissions | Restricted Actions |
| :--- | :--- | :--- |
| `user` | View products, manage own cart, place orders, write reviews. | Cannot access `/api/v1/admin` or modify other users' data. |
| `admin` | Full access to all endpoints, including catalog and user management. | No restrictions. |

## Global Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "details": { ... }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

## Global Error Handling

The system uses a centralized error middleware (`errorHandler.ts`) and a custom `ApiError` class.

- **400 Bad Request**: Validation errors (Zod) or Multer upload errors.
- **401 Unauthorized**: Missing or invalid session.
- **403 Forbidden**: Insufficient permissions (e.g., non-admin accessing admin routes) or unverified email.
- **404 Not Found**: Resource not found or route does not exist.
- **409 Conflict**: Duplicate resource (MongoDB code 11000).
- **500 Internal Server Error**: Unexpected server failures.

## Upload System

- **Accepted MIME Types**: Images only (`image/*`).
- **File Size Limit**: 5 MB per file.
- **Upload Storage**:
    - Products: `/uploads/products`
    - Verifications: `/uploads/verifications`
- **Field Names**: Defined by the specific route (usually `images` or `file`).

## Data Models

### User
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | - | Full name of the user |
| `email` | String | Yes | - | Unique email address |
| `role` | String | Yes | `user` | `user` or `admin` |
| `emailVerified` | Boolean | Yes | `false` | Whether the email is verified |
| `lastLoginAt` | Date | No | `null` | Timestamp of last login |

### Product
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | - | Product name |
| `briefDescription` | String | Yes | - | Short summary |
| `detailedDescription` | String | Yes | - | Full product details |
| `price` | Number | Yes | - | Selling price |
| `costPrice` | Number | No | `0` | Cost to acquire |
| `stock` | Number | Yes | `0` | Current inventory count |
| `categories` | ObjectId[] | No | `[]` | References to Category model |
| `tags` | ObjectId[] | No | `[]` | References to Tag model |
| `images` | String[] | No | `[]` | URLs to image files |
| `isActive` | Boolean | No | `true` | Visibility status |
| `averageRating` | Number | No | `0` | Calculated average |
| `reviewCount` | Number | No | `0` | Total number of reviews |

### Category
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | - | Unique category name |
| `slug` | String | Yes | - | URL-friendly name |
| `description` | String | No | `''` | Category description |
| `isActive` | Boolean | No | `true` | Visibility status |

### Tag
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | - | Unique tag name |
| `slug` | String | Yes | - | URL-friendly name |
| `isActive` | Boolean | No | `true` | Visibility status |

### Cart
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | - | Reference to User |
| `items` | Array | No | `[]` | List of cart items (product, quantity, priceSnapshot) |

### Order
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | - | Reference to User |
| `items` | Array | No | `[]` | Order items (product, name, quantity, price, costPrice) |
| `status` | String | Yes | `pending` | `pending`, `completed`, `canceled` |
| `subtotal` | Number | Yes | - | Sum of item prices |
| `total` | Number | Yes | - | Final amount paid |
| `profit` | Number | Yes | - | total - (sum of costPrices) |
| `shippingAddress` | String | Yes | - | Delivery address |
| `customerEmail` | String | Yes | - | Notification email |
| `statusHistory` | Array | No | `[]` | History of status changes |
| `notes` | String | No | `''` | Additional order notes |

### Review
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | - | Reference to User |
| `product` | ObjectId | Yes | - | Reference to Product |
| `comment` | String | Yes | - | Review text |
| `rating` | Number | Yes | - | 1 to 5 stars |

### NotificationRecipient
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | Yes | - | Unique email address |
| `isActive` | Boolean | No | `true` | Notification status |
| `notificationTypes` | String[] | No | `['order-status']` | Types of alerts to send |
| `createdBy` | ObjectId | No | `null` | Admin who added recipient |

```


---
## FILE: 02-customer-frontend-spec.md

```md
# 02-Customer Frontend Specification

This document specifies the API requirements for the customer-facing application.

## API Endpoints

### Products

#### List Products
- **Endpoint**: `GET /api/v1/products`
- **Auth**: Public
- **Query Params**:
    - `page` (optional, default: 1): Page number.
    - `limit` (optional, default: 12): Items per page (max 100).
    - `search` (optional): Case-insensitive search in name or brief description.
    - `categoryId` (optional): Filter by category ID.
    - `tagId` (optional): Filter by tag ID.
    - `isActive` (optional, default: true): Filter by visibility.
- **Response**:
    - `success`: true
    - `data`: `Product[]`
    - `pagination`: `{ page, limit, total, pages }`
- **TypeScript Interface**:
```typescript
interface ProductBrief {
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
```

#### Get Product Details
- **Endpoint**: `GET /api/v1/products/:productId`
- **Auth**: Public
- **Path Params**: `productId`
- **Response**:
    - `success`: true
    - `data`: `{ ...Product, reviews: Review[] }`
- **TypeScript Interface**:
```typescript
interface ProductDetail extends ProductBrief {
  detailedDescription: string;
  costPrice: number;
  reviews: Review[];
}

interface Review {
  _id: string;
  user: { name: string };
  comment: string;
  rating: number;
  createdAt: string;
}
```

#### List Product Reviews
- **Endpoint**: `GET /api/v1/products/:productId/reviews`
- **Auth**: Public
- **Path Params**: `productId`
- **Response**:
    - `success`: true
    - `data`: `Review[]`

#### Create/Update Review
- **Endpoint**: `POST /api/v1/products/:productId/reviews`
- **Auth**: Verified User
- **Body**:
    - `rating`: number (1-5, required)
    - `comment`: string (2-2000 chars, required)
- **Response**:
    - `success`: true
    - `data`: `Review`

#### Delete Review
- **Endpoint**: `DELETE /api/v1/products/:productId/reviews`
- **Auth**: Verified User
- **Path Params**: `productId`
- **Response**:
    - `success`: true
    - `message`: "Review deleted successfully"

---

### Categories & Tags

#### List Categories
- **Endpoint**: `GET /api/v1/categories`
- **Auth**: Public
- **Response**:
    - `success`: true
    - `data`: `Category[]`
- **TypeScript Interface**:
```typescript
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}
```

#### List Tags
- **Endpoint**: `GET /api/v1/tags`
- **Auth**: Public
- **Response**:
    - `success`: true
    - `data`: `Tag[]`
- **TypeScript Interface**:
```typescript
interface Tag {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}
```

---

### User Account

#### Get Current User
- **Endpoint**: `GET /api/v1/users/me`
- **Auth**: Verified User
- **Response**:
    - `success`: true
    - `data`: `User`
- **TypeScript Interface**:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

### Shopping Cart

#### View Cart
- **Endpoint**: `GET /api/v1/cart`
- **Auth**: Verified User
- **Response**:
    - `success`: true
    - `data`: `Cart`
- **TypeScript Interface**:
```typescript
interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  product: ProductBrief;
  quantity: number;
  priceSnapshot: number;
}
```

#### Add to Cart
- **Endpoint**: `POST /api/v1/cart/items`
- **Auth**: Verified User
- **Body**:
    - `productId`: string (required)
    - `quantity`: number (positive integer, required)
- **Response**:
    - `success`: true
    - `data`: `Cart`

#### Update Cart Item Quantity
- **Endpoint**: `PATCH /api/v1/cart/items/:productId`
- **Auth**: Verified User
- **Path Params**: `productId`
- **Body**:
    - `quantity`: number (positive integer, required)
- **Response**:
    - `success`: true
    - `data`: `Cart`

#### Remove Item from Cart
- **Endpoint**: `DELETE /api/v1/cart/items/:productId`
- **Auth**: Verified User
- **Path Params**: `productId`
- **Response**:
    - `success`: true
    - `data`: `Cart`

#### Clear Cart
- **Endpoint**: `DELETE /api/v1/cart`
- **Auth**: Verified User
- **Response**:
    - `success`: true
    - `message`: "Cart cleared successfully"

---

### Orders

#### Place Order (Checkout)
- **Endpoint**: `POST /api/v1/orders`
- **Auth**: Verified User
- **Body**:
    - `shippingAddress`: string (10-500 chars, required)
    - `customerEmail`: string (email, optional)
    - `notes`: string (max 1000, optional)
- **Response**:
    - `success`: true
    - `data`: `Order`
- **TypeScript Interface**:
```typescript
interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'canceled';
  subtotal: number;
  total: number;
  profit: number;
  shippingAddress: string;
  customerEmail: string;
  statusHistory: OrderStatusHistory[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  costPrice: number;
}

interface OrderStatusHistory {
  status: 'pending' | 'completed' | 'canceled';
  note: string;
  changedBy: string | null;
  changedAt: string;
}
```

#### List My Orders
- **Endpoint**: `GET /api/v1/orders`
- **Auth**: Verified User
- **Response**:
    - `success`: true
    - `data`: `Order[]`

#### Get Order Details
- **Endpoint**: `GET /api/v1/orders/:orderId`
- **Auth**: Verified User
- **Path Params**: `orderId`
- **Response**:
    - `success`: true
    - `data`: `Order`

---

## End-to-End User Flows

### 1. Onboarding & Authentication
**UI Action** $\rightarrow$ **API Call** $\rightarrow$ **Backend Behavior** $\rightarrow$ **Response** $\rightarrow$ **Frontend Update**
- Register $\rightarrow$ `POST /api/auth/sign-up` $\rightarrow$ Creates user, sends verification email $\rightarrow$ `200 OK` $\rightarrow$ Show "Verify Email" screen.
- Verify Email $\rightarrow$ `GET /api/auth/verify-email?token=...` $\rightarrow$ Sets `emailVerified: true` $\rightarrow$ `200 OK` $\rightarrow$ Redirect to Home.
- Login $\rightarrow$ `POST /api/auth/sign-in/email` $\rightarrow$ Validates credentials, creates session cookie $\rightarrow$ `200 OK` $\rightarrow$ Store user state, redirect to Home.
- Logout $\rightarrow$ `POST /api/auth/sign-out` $\rightarrow$ Destroys session $\rightarrow$ `200 OK` $\rightarrow$ Clear user state, redirect to Login.

### 2. Product Discovery
- Browse $\rightarrow$ `GET /api/v1/products` $\rightarrow$ Fetches active products with pagination $\rightarrow$ `200 OK` $\rightarrow$ Render product grid.
- Search $\rightarrow$ `GET /api/v1/products?search=...` $\rightarrow$ Regex search on name/description $\rightarrow$ `200 OK` $\rightarrow$ Update product grid.
- Filter $\rightarrow$ `GET /api/v1/products?categoryId=...` $\rightarrow$ Filters by category ID $\rightarrow$ `200 OK` $\rightarrow$ Update product grid.
- View $\rightarrow$ `GET /api/v1/products/:id` $\rightarrow$ Fetches full details + reviews $\rightarrow$ `200 OK` $\rightarrow$ Render product page.

### 3. Purchase Process
- Add to Cart $\rightarrow$ `POST /api/v1/cart/items` $\rightarrow$ Checks stock, adds to Cart model $\rightarrow$ `201 Created` $\rightarrow$ Update cart badge, show toast.
- Manage Cart $\rightarrow$ `PATCH /api/v1/cart/items/:id` $\rightarrow$ Updates quantity, checks stock $\rightarrow$ `200 OK` $\rightarrow$ Update cart totals.
- Checkout $\rightarrow$ `POST /api/v1/orders` $\rightarrow$ Atomic transaction: deducts stock, creates Order, clears Cart $\rightarrow$ `201 Created` $\rightarrow$ Redirect to Success page.

### 4. Post-Purchase
- History $\rightarrow$ `GET /api/v1/orders` $\rightarrow$ Fetches orders for current user $\rightarrow$ `200 OK` $\rightarrow$ Render order list.
- Review $\rightarrow$ `POST /api/v1/products/:id/reviews` $\rightarrow$ Upserts review, recalculates product rating $\rightarrow$ `201 Created` $\rightarrow$ Update review section.

## Frontend Notes

### Caching & State
- **Catalog**: Products and Categories can be cached (e.g., TanStack Query) for 5-10 minutes.
- **Cart**: The cart should be treated as server-state. Fetch on mount and refresh after any mutation.
- **Auth**: Use a Global Context to store the `User` object from `/api/v1/users/me`.

### Loading & Empty States
- **Product Grid**: Show skeleton loaders during `GET /api/v1/products`.
- **Empty Cart**: When `Cart.items` is empty, show a "Your cart is empty" message with a "Continue Shopping" button.
- **No Results**: When search returns `data: []`, show "No products found matching your search".

### Error Handling
- **401 Unauthorized**: Redirect to `/login`.
- **403 Forbidden (Verification)**: Redirect to `/verify-email` with a prompt to resend.
- **400 Bad Request (Stock)**: Display the specific error message (e.g., "Not enough stock available") in a toast.

```


---
## FILE: dump-codebase.js

```js
const fs = require("fs");
const path = require("path");

const ROOT_DIR = "./"; // change if needed
const OUTPUT_FILE = "codebase_dump.md";

// folders to ignore
const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", ".next"];

// file extensions to include
const ALLOWED_EXT = [".js", ".ts", ".jsx", ".tsx", ".json", ".md", ".css", ".html"];

function shouldIgnore(filePath) {
  return IGNORE_DIRS.some(dir => filePath.includes(dir));
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);

    if (shouldIgnore(fullPath)) return;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else {
      const ext = path.extname(fullPath);
      if (ALLOWED_EXT.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  });

  return fileList;
}

function generateDump() {
  const files = walk(ROOT_DIR);

  let output = "# Codebase Dump\n\n";

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf-8");

    output += `\n\n---\n`;
    output += `## FILE: ${file}\n\n`;
    output += "```" + path.extname(file).slice(1) + "\n";
    output += content + "\n";
    output += "```\n";
  });

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`✅ Dump created: ${OUTPUT_FILE}`);
}

generateDump();

```


---
## FILE: next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```


---
## FILE: package-lock.json

```json
{
  "name": "feriwala",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "feriwala",
      "version": "0.1.0",
      "dependencies": {
        "@react-three/drei": "^10.7.7",
        "@react-three/fiber": "^9.6.1",
        "clsx": "^2.1.1",
        "framer-motion": "^11.18.0",
        "gsap": "^3.13.0",
        "lenis": "^1.3.9",
        "next": "^15.3.0",
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "tailwind-merge": "^3.3.1",
        "three": "^0.179.1"
      },
      "devDependencies": {
        "@types/node": "^22.15.0",
        "@types/react": "^19.0.12",
        "@types/react-dom": "^19.0.4",
        "autoprefixer": "^10.4.21",
        "postcss": "^8.5.6",
        "tailwindcss": "^3.4.17",
        "typescript": "^5.8.3"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.7.tgz",
      "integrity": "sha512-Nq8OhGWiZIZGV6hLHoyAKLLcJihP/xFeBMGJoUrxTX2psI8dCifzLhZISFb+VWS3wFMRDmCGw5R+dOySCqPLhw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@dimforge/rapier3d-compat": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/@dimforge/rapier3d-compat/-/rapier3d-compat-0.12.0.tgz",
      "integrity": "sha512-uekIGetywIgopfD97oDL5PfeezkFpNhwlzlaEYNOA0N6ghdsOvh/HYjSMek5Q2O1PYvRSDFcqFVJl4r4ZBwOow==",
      "license": "Apache-2.0"
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.5.tgz",
      "integrity": "sha512-imtQ3WMJXbMY4fxb/Ndp6HBTNVtWCUI0WdobyheGf5+ad6xX8VIDO8u2xE4qc/fr08CKG/7dDseFtn6M6g/r3w==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.5.tgz",
      "integrity": "sha512-YNEFAF/4KQ/PeW0N+r+aVVsoIY0/qxxikF2SWdp+NRkmMB7y9LBZAVqQ4yhGCm/H3H270OSykqmQMKLBhBJDEw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.2.4.tgz",
      "integrity": "sha512-zqjjo7RatFfFoP0MkQ51jfuFZBnVE2pRiaydKJ1G/rHZvnsrHAOcQALIi9sA5co5xenQdTugCvtb1cuf78Vf4g==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.2.4.tgz",
      "integrity": "sha512-1IOd5xfVhlGwX+zXv2N93k0yMONvUlANylbJw1eTah8K/Jtpi15KC+WSiaX/nBmbm2HxRM1gZ0nSdjSsrZbGKg==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.2.4.tgz",
      "integrity": "sha512-bFI7xcKFELdiNCVov8e44Ia4u2byA+l3XtsAj+Q8tfCwO6BQ8iDojYdvoPMqsKDkuoOo+X6HZA0s0q11ANMQ8A==",
      "cpu": [
        "arm"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.2.4.tgz",
      "integrity": "sha512-excjX8DfsIcJ10x1Kzr4RcWe1edC9PquDRRPx3YVCvQv+U5p7Yin2s32ftzikXojb1PIFc/9Mt28/y+iRklkrw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.2.4.tgz",
      "integrity": "sha512-FMuvGijLDYG6lW+b/UvyilUWu5Ayu+3r2d1S8notiGCIyYU/76eig1UfMmkZ7vwgOrzKzlQbFSuQfgm7GYUPpA==",
      "cpu": [
        "ppc64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.2.4.tgz",
      "integrity": "sha512-oVDbcR4zUC0ce82teubSm+x6ETixtKZBh/qbREIOcI3cULzDyb18Sr/Wcyx7NRQeQzOiHTNbZFF1UwPS2scyGA==",
      "cpu": [
        "riscv64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.2.4.tgz",
      "integrity": "sha512-qmp9VrzgPgMoGZyPvrQHqk02uyjA0/QrTO26Tqk6l4ZV0MPWIW6LTkqOIov+J1yEu7MbFQaDpwdwJKhbJvuRxQ==",
      "cpu": [
        "s390x"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.2.4.tgz",
      "integrity": "sha512-tJxiiLsmHc9Ax1bz3oaOYBURTXGIRDODBqhveVHonrHJ9/+k89qbLl0bcJns+e4t4rvaNBxaEZsFtSfAdquPrw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.2.4.tgz",
      "integrity": "sha512-FVQHuwx1IIuNow9QAbYUzJ+En8KcVm9Lk5+uGUQJHaZmMECZmOlix9HnH7n1TRkXMS0pGxIJokIVB9SuqZGGXw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.2.4.tgz",
      "integrity": "sha512-+LpyBk7L44ZIXwz/VYfglaX/okxezESc6UxDSoyo2Ks6Jxc4Y7sGjpgU9s4PMgqgjj1gZCylTieNamqA1MF7Dg==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.5.tgz",
      "integrity": "sha512-9dLqsvwtg1uuXBGZKsxem9595+ujv0sJ6Vi8wcTANSFpwV/GONat5eCkzQo/1O6zRIkh0m/8+5BjrRr7jDUSZw==",
      "cpu": [
        "arm"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.5.tgz",
      "integrity": "sha512-bKQzaJRY/bkPOXyKx5EVup7qkaojECG6NLYswgktOZjaXecSAeCWiZwwiFf3/Y+O1HrauiE3FVsGxFg8c24rZg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.34.5.tgz",
      "integrity": "sha512-7zznwNaqW6YtsfrGGDA6BRkISKAAE1Jo0QdpNYXNMHu2+0dTrPflTLNkpc8l7MUP5M16ZJcUvysVWWrMefZquA==",
      "cpu": [
        "ppc64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.34.5.tgz",
      "integrity": "sha512-51gJuLPTKa7piYPaVs8GmByo7/U7/7TZOq+cnXJIHZKavIRHAP77e3N2HEl3dgiqdD/w0yUfiJnII77PuDDFdw==",
      "cpu": [
        "riscv64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.5.tgz",
      "integrity": "sha512-nQtCk0PdKfho3eC5MrbQoigJ2gd1CgddUMkabUj+rBevs8tZ2cULOx46E7oyX+04WGfABgIwmMC0VqieTiR4jg==",
      "cpu": [
        "s390x"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.5.tgz",
      "integrity": "sha512-MEzd8HPKxVxVenwAa+JRPwEC7QFjoPWuS5NZnBt6B3pu7EG2Ge0id1oLHZpPJdn3OQK+BQDiw9zStiHBTJQQQQ==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.5.tgz",
      "integrity": "sha512-fprJR6GtRsMt6Kyfq44IsChVZeGN97gTD331weR1ex1c1rypDEABN6Tm2xa1wE6lYb5DdEnk03NZPqA7Id21yg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.5.tgz",
      "integrity": "sha512-Jg8wNT1MUzIvhBFxViqrEhWDGzqymo3sV7z7ZsaWbZNDLXRJZoRGrjulp60YYtV4wfY8VIKcWidjojlLcWrd8Q==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.5.tgz",
      "integrity": "sha512-OdWTEiVkY2PHwqkbBI8frFxQQFekHaSSkUIJkwzclWZe64O1X4UlUjqqqLaPbUpMOQk6FBu/HtlGXNblIs0huw==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.7.0"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.5.tgz",
      "integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.5.tgz",
      "integrity": "sha512-FV9m/7NmeCmSHDD5j4+4pNI8Cp3aW+JvLoXcTUo0IqyjSfAZJ8dIUmijx1qaJsIiU+Hosw6xM5KijAWRJCSgNg==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.5.tgz",
      "integrity": "sha512-+29YMsqY2/9eFEiW93eqWnuLcWcufowXewwSNIT6UwZdUUCrM3oFjMWH/Z6/TMmb4hlFenmfAVbpWeup2jryCw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@mediapipe/tasks-vision": {
      "version": "0.10.17",
      "resolved": "https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.17.tgz",
      "integrity": "sha512-CZWV/q6TTe8ta61cZXjfnnHsfWIdFhms03M9T7Cnd5y2mdpylJM0rF1qRq+wsQVRMLz1OYPVEBU9ph2Bx8cxrg==",
      "license": "Apache-2.0"
    },
    "node_modules/@monogrid/gainmap-js": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/@monogrid/gainmap-js/-/gainmap-js-3.4.0.tgz",
      "integrity": "sha512-2Z0FATFHaoYJ8b+Y4y4Hgfn3FRFwuU5zRrk+9dFWp4uGAdHGqVEdP7HP+gLA3X469KXHmfupJaUbKo1b/aDKIg==",
      "license": "MIT",
      "dependencies": {
        "promise-worker-transferable": "^1.0.4"
      },
      "peerDependencies": {
        "three": ">= 0.159.0"
      }
    },
    "node_modules/@next/env": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-15.5.19.tgz",
      "integrity": "sha512-sWWluFvcv5v3Fxznmf2ZfjyoVQt/64oCnYqS90inQWGzMPK1VjvekPiz3OPHKmFT30EnHrjlbyaHLt3M0vWabw==",
      "license": "MIT"
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-15.5.19.tgz",
      "integrity": "sha512-jx9wWlTKueHKPvVOndyr7WuaevWCkuYqsQ8gC0TMPKAVWG3MhcdMrjfo9tvIZNXd0QOUYXXvAcZ325y8Uq7uzg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-15.5.19.tgz",
      "integrity": "sha512-291KFcsIQ3OenRdiUDFOR6W3wezzH4auENXm1gbm1Bjd4ANMMRgxPrWTUztQN43BnVoVuMnHCrLeECIMwgFKbA==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-15.5.19.tgz",
      "integrity": "sha512-WeH+nelQyyMeE2f8FxBRZNrGipya5zHZV2vjzfCOAYyiI6am+NbnWAAldOBFQBB2w0DjJcsvrKqoFT2b7+5YoA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-15.5.19.tgz",
      "integrity": "sha512-5xTOE0lDlDCSSfp+BAif7j17VRRCjWp//ZPZy6NI0QpdrhxtQnsZguSx0xAAZ0c9XZLrLLwCe/XVe5YPrRilKw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-15.5.19.tgz",
      "integrity": "sha512-LTxRmMgqqMv05Had879W00Fm53quiJd3Zuz8h1JSNJ3nGSlbZ/7Tjs1tKyScgN3Au3t3MyPsjPlq60fMmSHLsg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-15.5.19.tgz",
      "integrity": "sha512-eoNQSpA5PQfB9wBO4RA47MTDXWz1fizy9Y3Z6e4DetYIF3dvjuu8sj7aIGn/bFCU6lnFzTK34NtCaffP4NsQ7Q==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-15.5.19.tgz",
      "integrity": "sha512-6UNt2dFuCHOe446sm/Kp69nUe8/wIhnh9bm6Xcqw4qEWCOppLMOvhTBVgvM7invVUNr4SPpP6NOQsACtn2IN9Q==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-15.5.19.tgz",
      "integrity": "sha512-PhmojAHyqMne56HBLGu9dhDnHPuFmEjrXSQMM/nW0J6j849lk3ESrVtqNJcCk8CKOV7brpTTbaYAjwKPzKM69w==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@react-three/drei": {
      "version": "10.7.7",
      "resolved": "https://registry.npmjs.org/@react-three/drei/-/drei-10.7.7.tgz",
      "integrity": "sha512-ff+J5iloR0k4tC++QtD/j9u3w5fzfgFAWDtAGQah9pF2B1YgOq/5JxqY0/aVoQG5r3xSZz0cv5tk2YuBob4xEQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.26.0",
        "@mediapipe/tasks-vision": "0.10.17",
        "@monogrid/gainmap-js": "^3.0.6",
        "@use-gesture/react": "^10.3.1",
        "camera-controls": "^3.1.0",
        "cross-env": "^7.0.3",
        "detect-gpu": "^5.0.56",
        "glsl-noise": "^0.0.0",
        "hls.js": "^1.5.17",
        "maath": "^0.10.8",
        "meshline": "^3.3.1",
        "stats-gl": "^2.2.8",
        "stats.js": "^0.17.0",
        "suspend-react": "^0.1.3",
        "three-mesh-bvh": "^0.8.3",
        "three-stdlib": "^2.35.6",
        "troika-three-text": "^0.52.4",
        "tunnel-rat": "^0.1.2",
        "use-sync-external-store": "^1.4.0",
        "utility-types": "^3.11.0",
        "zustand": "^5.0.1"
      },
      "peerDependencies": {
        "@react-three/fiber": "^9.0.0",
        "react": "^19",
        "react-dom": "^19",
        "three": ">=0.159"
      },
      "peerDependenciesMeta": {
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@react-three/fiber": {
      "version": "9.6.1",
      "resolved": "https://registry.npmjs.org/@react-three/fiber/-/fiber-9.6.1.tgz",
      "integrity": "sha512-zF0rsKcVYpcJwbFEnv2HkHX9cvOEgsfQo/X8lwmR2dn13S4qEQJXir9fxf5js2LQFoXqxOY7MDkOkYx2uZ4gSg==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.17.8",
        "@types/webxr": "*",
        "base64-js": "^1.5.1",
        "buffer": "^6.0.3",
        "its-fine": "^2.0.0",
        "react-use-measure": "^2.1.7",
        "scheduler": "^0.27.0",
        "suspend-react": "^0.1.3",
        "use-sync-external-store": "^1.4.0",
        "zustand": "^5.0.3"
      },
      "peerDependencies": {
        "expo": ">=43.0",
        "expo-asset": ">=8.4",
        "expo-file-system": ">=11.0",
        "expo-gl": ">=11.0",
        "react": ">=19 <19.3",
        "react-dom": ">=19 <19.3",
        "react-native": ">=0.78",
        "three": ">=0.156"
      },
      "peerDependenciesMeta": {
        "expo": {
          "optional": true
        },
        "expo-asset": {
          "optional": true
        },
        "expo-file-system": {
          "optional": true
        },
        "expo-gl": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        },
        "react-native": {
          "optional": true
        }
      }
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.15",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.15.tgz",
      "integrity": "sha512-JQ5TuMi45Owi4/BIMAJBoSQoOJu12oOk/gADqlcUL9JEdHB8vyjUSsxqeNXnmXHjYKMi2WcYtezGEEhqUI/E2g==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tweenjs/tween.js": {
      "version": "23.1.3",
      "resolved": "https://registry.npmjs.org/@tweenjs/tween.js/-/tween.js-23.1.3.tgz",
      "integrity": "sha512-vJmvvwFxYuGnF2axRtPYocag6Clbb5YS7kLL+SO/TeVFzHqDIWrNKYtcsPMibjDx9O+bu+psAy9NKfWklassUA==",
      "license": "MIT"
    },
    "node_modules/@types/draco3d": {
      "version": "1.4.10",
      "resolved": "https://registry.npmjs.org/@types/draco3d/-/draco3d-1.4.10.tgz",
      "integrity": "sha512-AX22jp8Y7wwaBgAixaSvkoG4M/+PlAcm3Qs4OW8yT9DM4xUpWKeFhLueTAyZF39pviAdcDdeJoACapiAceqNcw==",
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.19.19",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.19.19.tgz",
      "integrity": "sha512-dyh/xO2Fh5bYrfWaaqGrRQQGkNdmYw6AmaAUvYeUMNTWQtvb796ikLdmTchRmOlOiIJ1TDXfWgVx1QkUlQ6Hew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/offscreencanvas": {
      "version": "2019.7.3",
      "resolved": "https://registry.npmjs.org/@types/offscreencanvas/-/offscreencanvas-2019.7.3.tgz",
      "integrity": "sha512-ieXiYmgSRXUDeOntE1InxjWyvEelZGP63M+cGuquuRLuIKKT1osnkXjxev9B7d1nXSug5vpunx+gNlbVxMlC9A==",
      "license": "MIT"
    },
    "node_modules/@types/react": {
      "version": "19.2.16",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.16.tgz",
      "integrity": "sha512-esJiCAnl0kfpNdE69f3So4WJUXy95dLZydX0KwK46riIHDzHM7O9Vtf9xCHW0PXIqvgqNrswl522kA/5yx+F4w==",
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.2.3",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.3.tgz",
      "integrity": "sha512-jp2L/eY6fn+KgVVQAOqYItbF0VY/YApe5Mz2F0aykSO8gx31bYCZyvSeYxCHKvzHG5eZjc+zyaS5BrBWya2+kQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.2.0"
      }
    },
    "node_modules/@types/react-reconciler": {
      "version": "0.28.9",
      "resolved": "https://registry.npmjs.org/@types/react-reconciler/-/react-reconciler-0.28.9.tgz",
      "integrity": "sha512-HHM3nxyUZ3zAylX8ZEyrDNd2XZOnQ0D5XfunJF5FLQnZbHHYq4UWvW1QfelQNXv1ICNkwYhfxjwfnqivYB6bFg==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*"
      }
    },
    "node_modules/@types/stats.js": {
      "version": "0.17.4",
      "resolved": "https://registry.npmjs.org/@types/stats.js/-/stats.js-0.17.4.tgz",
      "integrity": "sha512-jIBvWWShCvlBqBNIZt0KAshWpvSjhkwkEu4ZUcASoAvhmrgAUI2t1dXrjSL4xXVLB4FznPrIsX3nKXFl/Dt4vA==",
      "license": "MIT"
    },
    "node_modules/@types/three": {
      "version": "0.184.1",
      "resolved": "https://registry.npmjs.org/@types/three/-/three-0.184.1.tgz",
      "integrity": "sha512-6q4VdiqVsrTRqmk62/BnlcAvIrnDM0zf2ZDVKI5kZiniWrSaOHaQzmbp+BNzoggc/8tgW412pL//wZIxu2PPTA==",
      "license": "MIT",
      "dependencies": {
        "@dimforge/rapier3d-compat": "~0.12.0",
        "@tweenjs/tween.js": "~23.1.3",
        "@types/stats.js": "*",
        "@types/webxr": ">=0.5.17",
        "fflate": "~0.8.2",
        "meshoptimizer": "~1.1.1"
      }
    },
    "node_modules/@types/webxr": {
      "version": "0.5.24",
      "resolved": "https://registry.npmjs.org/@types/webxr/-/webxr-0.5.24.tgz",
      "integrity": "sha512-h8fgEd/DpoS9CBrjEQXR+dIDraopAEfu4wYVNY2tEPwk60stPWhvZMf4Foo5FakuQ7HFZoa8WceaWFervK2Ovg==",
      "license": "MIT"
    },
    "node_modules/@use-gesture/core": {
      "version": "10.3.1",
      "resolved": "https://registry.npmjs.org/@use-gesture/core/-/core-10.3.1.tgz",
      "integrity": "sha512-WcINiDt8WjqBdUXye25anHiNxPc0VOrlT8F6LLkU6cycrOGUDyY/yyFmsg3k8i5OLvv25llc0QC45GhR/C8llw==",
      "license": "MIT"
    },
    "node_modules/@use-gesture/react": {
      "version": "10.3.1",
      "resolved": "https://registry.npmjs.org/@use-gesture/react/-/react-10.3.1.tgz",
      "integrity": "sha512-Yy19y6O2GJq8f7CHf7L0nxL8bf4PZCPaVOCgJrusOeFHY1LvHgYXnmnXg6N5iwAnbgbZCDjo60SiM6IPJi9C5g==",
      "license": "MIT",
      "dependencies": {
        "@use-gesture/core": "10.3.1"
      },
      "peerDependencies": {
        "react": ">= 16.8.0"
      }
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
      "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/autoprefixer": {
      "version": "10.5.0",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.5.0.tgz",
      "integrity": "sha512-FMhOoZV4+qR6aTUALKX2rEqGG+oyATvwBt9IIzVR5rMa2HRWPkxf+P+PAJLD1I/H5/II+HuZcBJYEFBpq39ong==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.2",
        "caniuse-lite": "^1.0.30001787",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.10.33",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.10.33.tgz",
      "integrity": "sha512-bA6+tcSLpz2tIEdDXZPpPTIuxBcC4+w6SieaYyfigIa4h8GlFxbA17v22Vx3JUtuZQj9SgOsnbK+aTBzyDyEuw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/bidi-js": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/bidi-js/-/bidi-js-1.0.3.tgz",
      "integrity": "sha512-RKshQI1R3YQ+n9YJz2QQ147P66ELpa1FQEg20Dk8oW9t2KgLbpDLLp9aGZ7y8WHSshDknG0bknqGw5/tyCs5tw==",
      "license": "MIT",
      "dependencies": {
        "require-from-string": "^2.0.2"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.2",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.2.tgz",
      "integrity": "sha512-48xSriZYYg+8qXna9kwqjIVzuQxi+KYWp2+5nCYnYKPTr0LvD89Jqk2Or5ogxz0NUMfIjhh2lIUX/LyX9B4oIg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.10.12",
        "caniuse-lite": "^1.0.30001782",
        "electron-to-chromium": "^1.5.328",
        "node-releases": "^2.0.36",
        "update-browserslist-db": "^1.2.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/buffer": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-6.0.3.tgz",
      "integrity": "sha512-FTiCpNxtwiZZHEZbcbTIcZjERVICn9yq/pDFkTl95/AxzD1naBctN7YO68riM/gLSDY7sdrMby8hofADYuuqOA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.2.1"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
      "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/camera-controls": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/camera-controls/-/camera-controls-3.1.2.tgz",
      "integrity": "sha512-xkxfpG2ECZ6Ww5/9+kf4mfg1VEYAoe9aDSY+IwF0UEs7qEzwy0aVRfs2grImIECs/PoBtWFrh7RXsQkwG922JA==",
      "license": "MIT",
      "engines": {
        "node": ">=22.0.0",
        "npm": ">=10.5.1"
      },
      "peerDependencies": {
        "three": ">=0.126.1"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001793",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001793.tgz",
      "integrity": "sha512-iwSsYWaCOoh26cV8NwNRViHlrfUvYsHDfRVcbtmw0Kg6PJIZZXwMkj1442FYLBGkeUf1juAsU3DTfxW579mrPA==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
      "integrity": "sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/cross-env": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/cross-env/-/cross-env-7.0.3.tgz",
      "integrity": "sha512-+/HKd6EgcQCJGh2PSjZuUitQBQynKor4wrFbRg4DtAgS1aWO+gU52xpH7M9ScGgXSYmAVS9bIJ8EzuaGw0oNAw==",
      "license": "MIT",
      "dependencies": {
        "cross-spawn": "^7.0.1"
      },
      "bin": {
        "cross-env": "src/bin/cross-env.js",
        "cross-env-shell": "src/bin/cross-env-shell.js"
      },
      "engines": {
        "node": ">=10.14",
        "npm": ">=6",
        "yarn": ">=1"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "license": "MIT"
    },
    "node_modules/detect-gpu": {
      "version": "5.0.70",
      "resolved": "https://registry.npmjs.org/detect-gpu/-/detect-gpu-5.0.70.tgz",
      "integrity": "sha512-bqerEP1Ese6nt3rFkwPnGbsUF9a4q+gMmpTVVOEzoCyeCc+y7/RvJnQZJx1JwhgQI5Ntg0Kgat8Uu7XpBqnz1w==",
      "license": "MIT",
      "dependencies": {
        "webgl-constants": "^1.1.1"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
      "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
      "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/draco3d": {
      "version": "1.5.7",
      "resolved": "https://registry.npmjs.org/draco3d/-/draco3d-1.5.7.tgz",
      "integrity": "sha512-m6WCKt/erDXcw+70IJXnG7M3awwQPAsZvJGX5zY7beBqpELw6RDGkYVU0W43AFxye4pDZ5i2Lbyc/NNGqwjUVQ==",
      "license": "Apache-2.0"
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.365",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.365.tgz",
      "integrity": "sha512-xfip4u1QF1s+URFqpA6N+OeFpDGpN7VJz1f3MO3bVL0QYBjpGiZ5/Of7kugvM+o8TTqmanUlviHN3c8M9vYWCw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fastq": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
      "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fflate": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
      "license": "MIT"
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/framer-motion": {
      "version": "11.18.2",
      "resolved": "https://registry.npmjs.org/framer-motion/-/framer-motion-11.18.2.tgz",
      "integrity": "sha512-5F5Och7wrvtLVElIpclDT0CBzMVg3dL22B64aZwHtsIY8RB4mXICLrkajK4G9R+ieSAGcgrLeae2SeUTg2pr6w==",
      "license": "MIT",
      "dependencies": {
        "motion-dom": "^11.18.1",
        "motion-utils": "^11.18.1",
        "tslib": "^2.4.0"
      },
      "peerDependencies": {
        "@emotion/is-prop-valid": "*",
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/is-prop-valid": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/glsl-noise": {
      "version": "0.0.0",
      "resolved": "https://registry.npmjs.org/glsl-noise/-/glsl-noise-0.0.0.tgz",
      "integrity": "sha512-b/ZCF6amfAUb7dJM/MxRs7AetQEahYzJ8PtgfrmEdtw6uyGOr+ZSGtgjFm6mfsBkxJ4d2W7kg+Nlqzqvn3Bc0w==",
      "license": "MIT"
    },
    "node_modules/gsap": {
      "version": "3.15.0",
      "resolved": "https://registry.npmjs.org/gsap/-/gsap-3.15.0.tgz",
      "integrity": "sha512-dMW4CWBTUK1AEEDeZc1g4xpPGIrSf9fJF960qbTZmN/QwZIWY5wgliS6JWl9/25fpTGJrMRtSjGtOmPnfjZB+A==",
      "license": "Standard 'no charge' license: https://gsap.com/standard-license."
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hls.js": {
      "version": "1.6.16",
      "resolved": "https://registry.npmjs.org/hls.js/-/hls.js-1.6.16.tgz",
      "integrity": "sha512-VSIRpLfRwlAAdGL4wiTucx2ScRipo0ed1FBatWkyt832jC4CReKstga6yIhYVwGu9LOBjuX9wzmRMeQdBJtzEA==",
      "license": "Apache-2.0"
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/immediate": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/immediate/-/immediate-3.0.6.tgz",
      "integrity": "sha512-XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==",
      "license": "MIT"
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-promise": {
      "version": "2.2.2",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-2.2.2.tgz",
      "integrity": "sha512-+lP4/6lKUBfQjZ2pdxThZvLUAafmZb8OAxFb8XXtiQmS35INgr85hdOGoEs124ez1FCnZJt6jau/T+alh58QFQ==",
      "license": "MIT"
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "license": "ISC"
    },
    "node_modules/its-fine": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/its-fine/-/its-fine-2.0.0.tgz",
      "integrity": "sha512-KLViCmWx94zOvpLwSlsx6yOCeMhZYaxrJV87Po5k/FoZzcPSahvK5qJ7fYhS61sZi5ikmh2S3Hz55A2l3U69ng==",
      "license": "MIT",
      "dependencies": {
        "@types/react-reconciler": "^0.28.9"
      },
      "peerDependencies": {
        "react": "^19.0.0"
      }
    },
    "node_modules/jiti": {
      "version": "1.21.7",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
      "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/lenis": {
      "version": "1.3.23",
      "resolved": "https://registry.npmjs.org/lenis/-/lenis-1.3.23.tgz",
      "integrity": "sha512-YxYq3TJqj9sJNv0V9SkyQHejt14xwyIwgDaaMK89Uf9SxQfIszu+gTQSSphh6BWlLTNVKvvXAGkg+Zf+oFIevg==",
      "license": "MIT",
      "workspaces": [
        "packages/*",
        "playground",
        "playground/*"
      ],
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/darkroomengineering"
      },
      "peerDependencies": {
        "@nuxt/kit": ">=3.0.0",
        "react": ">=17.0.0",
        "vue": ">=3.0.0"
      },
      "peerDependenciesMeta": {
        "@nuxt/kit": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "vue": {
          "optional": true
        }
      }
    },
    "node_modules/lie": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/lie/-/lie-3.3.0.tgz",
      "integrity": "sha512-UaiMJzeWRlEujzAuw5LokY1L5ecNQYZKfmyZ9L7wDHb/p5etKaxXhohBcrw0EYby+G/NA52vRSN4N39dxHAIwQ==",
      "license": "MIT",
      "dependencies": {
        "immediate": "~3.0.5"
      }
    },
    "node_modules/lilconfig": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/maath": {
      "version": "0.10.8",
      "resolved": "https://registry.npmjs.org/maath/-/maath-0.10.8.tgz",
      "integrity": "sha512-tRvbDF0Pgqz+9XUa4jjfgAQ8/aPKmQdWXilFu2tMy4GWj4NOsx99HlULO4IeREfbO3a0sA145DZYyvXPkybm0g==",
      "license": "MIT",
      "peerDependencies": {
        "@types/three": ">=0.134.0",
        "three": ">=0.134.0"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/meshline": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/meshline/-/meshline-3.3.1.tgz",
      "integrity": "sha512-/TQj+JdZkeSUOl5Mk2J7eLcYTLiQm2IDzmlSvYm7ov15anEcDJ92GHqqazxTSreeNgfnYu24kiEvvv0WlbCdFQ==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">=0.137"
      }
    },
    "node_modules/meshoptimizer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/meshoptimizer/-/meshoptimizer-1.1.1.tgz",
      "integrity": "sha512-oRFNWJRDA/WTrVj7NWvqa5HqE1t9MYDj2VaWirQCzCCrAd2GHrqR/sQezCxiWATPNlKTcRaPRHPJwIRoPBAp5g==",
      "license": "MIT"
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/motion-dom": {
      "version": "11.18.1",
      "resolved": "https://registry.npmjs.org/motion-dom/-/motion-dom-11.18.1.tgz",
      "integrity": "sha512-g76KvA001z+atjfxczdRtw/RXOM3OMSdd1f4DL77qCTF/+avrRJiawSG4yDibEQ215sr9kpinSlX2pCTJ9zbhw==",
      "license": "MIT",
      "dependencies": {
        "motion-utils": "^11.18.1"
      }
    },
    "node_modules/motion-utils": {
      "version": "11.18.1",
      "resolved": "https://registry.npmjs.org/motion-utils/-/motion-utils-11.18.1.tgz",
      "integrity": "sha512-49Kt+HKjtbJKLtgO/LKj9Ld+6vw9BjH5d9sc40R/kVyH8GLAXgT42M2NnuPcJNuA3s9ZfZBUcwIgpmZWGEE+hA==",
      "license": "MIT"
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
      "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.12",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.12.tgz",
      "integrity": "sha512-ZB9RH/39qpq5Vu6Y+NmUaFhQR6pp+M2Xt76XBnEwDaGcVAqhlvxrl3B2bKS5D3NH3QR76v3aSrKaF/Kiy7lEtQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/next": {
      "version": "15.5.19",
      "resolved": "https://registry.npmjs.org/next/-/next-15.5.19.tgz",
      "integrity": "sha512-xNOW6tYshGX1/Oi3F8uuk4gpDeWsSUE/1Z0G5uUMekIxaQ0xc03UXd9II0VQHYMWviMeA0OHpJFAKsHf8bTYVg==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "15.5.19",
        "@swc/helpers": "0.5.15",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.4.31",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": "^18.18.0 || ^19.8.0 || >= 20.0.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "15.5.19",
        "@next/swc-darwin-x64": "15.5.19",
        "@next/swc-linux-arm64-gnu": "15.5.19",
        "@next/swc-linux-arm64-musl": "15.5.19",
        "@next/swc-linux-x64-gnu": "15.5.19",
        "@next/swc-linux-x64-musl": "15.5.19",
        "@next/swc-win32-arm64-msvc": "15.5.19",
        "@next/swc-win32-x64-msvc": "15.5.19",
        "sharp": "^0.34.3"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.4.31",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.4.31.tgz",
      "integrity": "sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.6",
        "picocolors": "^1.0.0",
        "source-map-js": "^1.0.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.47",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.47.tgz",
      "integrity": "sha512-Uzmd6LXpouKo8EUK68IjH4+E01w/hXyV3R3g/geCJo+rXLNfh1xucB+LOzYEOQPSiUK3h/xZf0cQGcSsmyL2Og==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
      "integrity": "sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
      "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.15",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.15.tgz",
      "integrity": "sha512-FfR8sjd4em2T6fb3I2MwAJU7HWVMr9zba+enmQeeWFfCbm+UOC/0X4DS8XtpUTMwWMGbjKYP7xjfNekzyGmB3A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.12",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
      "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
      "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-6.0.1.tgz",
      "integrity": "sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.1.1"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "jiti": ">=1.21.0",
        "postcss": ">=8.0.9",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
      "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.2",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.2.tgz",
      "integrity": "sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/potpack": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/potpack/-/potpack-1.0.2.tgz",
      "integrity": "sha512-choctRBIV9EMT9WGAZHn3V7t0Z2pMQyl0EZE6pFc/6ml3ssw7Dlf/oAOvFwjm1HVsqfQN8GfeFyJ+d8tRzqueQ==",
      "license": "ISC"
    },
    "node_modules/promise-worker-transferable": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/promise-worker-transferable/-/promise-worker-transferable-1.0.4.tgz",
      "integrity": "sha512-bN+0ehEnrXfxV2ZQvU2PetO0n4gqBD4ulq3MI1WOPLgr7/Mg9yRQkX5+0v1vagr74ZTsl7XtzlaYDo2EuCeYJw==",
      "license": "Apache-2.0",
      "dependencies": {
        "is-promise": "^2.1.0",
        "lie": "^3.0.2"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "19.2.7",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.7.tgz",
      "integrity": "sha512-HNe9WslTbXmFK8o8cmwgAeJFSBvt1bPdHCVKtaaV+WlAN36mpT4hcRpwbf3fY56ar2oIXzsBpOAiIRHAdY0OlQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.7",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.7.tgz",
      "integrity": "sha512-t0BRVXvbiE/o20Hfw669rLbMCDWtYZLvmJigy2f0MxsXF+71pxhR3xOkspmsO8h3ZlNzyibAmtCa3l4lYKk6gQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.7"
      }
    },
    "node_modules/react-use-measure": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/react-use-measure/-/react-use-measure-2.1.7.tgz",
      "integrity": "sha512-KrvcAo13I/60HpwGO5jpW7E9DfusKyLPLvuHlUyP5zqnmAPhNc6qTRjUQrdTADl0lpPpDVU2/Gg51UlOGHXbdg==",
      "license": "MIT",
      "peerDependencies": {
        "react": ">=16.13",
        "react-dom": ">=16.13"
      },
      "peerDependenciesMeta": {
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz",
      "integrity": "sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pify": "^2.3.0"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.8.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.1.tgz",
      "integrity": "sha512-rkVq3IXh+4FDGch+KwzX3aV9W3kO54GyEgpvBzSyctDA6Xtd7RJQV1xmXbeQp5v7+VzLOfVqiutSE6GICgPFvg==",
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/sharp": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.34.5.tgz",
      "integrity": "sha512-Ou9I5Ft9WNcCbXrU9cMgPBcCK8LiwLqcbywW3t4oDV37n1pzpuNLsYiAV8eODnjbtQlSDwZ2cUEeQz4E54Hltg==",
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.0.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.7.3"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.34.5",
        "@img/sharp-darwin-x64": "0.34.5",
        "@img/sharp-libvips-darwin-arm64": "1.2.4",
        "@img/sharp-libvips-darwin-x64": "1.2.4",
        "@img/sharp-libvips-linux-arm": "1.2.4",
        "@img/sharp-libvips-linux-arm64": "1.2.4",
        "@img/sharp-libvips-linux-ppc64": "1.2.4",
        "@img/sharp-libvips-linux-riscv64": "1.2.4",
        "@img/sharp-libvips-linux-s390x": "1.2.4",
        "@img/sharp-libvips-linux-x64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
        "@img/sharp-linux-arm": "0.34.5",
        "@img/sharp-linux-arm64": "0.34.5",
        "@img/sharp-linux-ppc64": "0.34.5",
        "@img/sharp-linux-riscv64": "0.34.5",
        "@img/sharp-linux-s390x": "0.34.5",
        "@img/sharp-linux-x64": "0.34.5",
        "@img/sharp-linuxmusl-arm64": "0.34.5",
        "@img/sharp-linuxmusl-x64": "0.34.5",
        "@img/sharp-wasm32": "0.34.5",
        "@img/sharp-win32-arm64": "0.34.5",
        "@img/sharp-win32-ia32": "0.34.5",
        "@img/sharp-win32-x64": "0.34.5"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stats-gl": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/stats-gl/-/stats-gl-2.4.2.tgz",
      "integrity": "sha512-g5O9B0hm9CvnM36+v7SFl39T7hmAlv541tU81ME8YeSb3i1CIP5/QdDeSB3A0la0bKNHpxpwxOVRo2wFTYEosQ==",
      "license": "MIT",
      "dependencies": {
        "@types/three": "*",
        "three": "^0.170.0"
      },
      "peerDependencies": {
        "@types/three": "*",
        "three": "*"
      }
    },
    "node_modules/stats-gl/node_modules/three": {
      "version": "0.170.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.170.0.tgz",
      "integrity": "sha512-FQK+LEpYc0fBD+J8g6oSEyyNzjp+Q7Ks1C568WWaoMRLW+TkNNWmenWeGgJjV105Gd+p/2ql1ZcjYvNiPZBhuQ==",
      "license": "MIT"
    },
    "node_modules/stats.js": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/stats.js/-/stats.js-0.17.0.tgz",
      "integrity": "sha512-hNKz8phvYLPEcRkeG1rsGmV5ChMjKDAWU7/OJJdDErPBNChQXxCo3WZurGpnWc6gZhAzEPFad1aVgyOANH1sMw==",
      "license": "MIT"
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/sucrase": {
      "version": "3.35.1",
      "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "tinyglobby": "^0.2.11",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/suspend-react": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/suspend-react/-/suspend-react-0.1.3.tgz",
      "integrity": "sha512-aqldKgX9aZqpoDp3e8/BZ8Dm7x1pJl+qI3ZKxDN0i/IQTWUwBx/ManmlVJ3wowqbno6c2bmiIfs+Um6LbsjJyQ==",
      "license": "MIT",
      "peerDependencies": {
        "react": ">=17.0"
      }
    },
    "node_modules/tailwind-merge": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-3.6.0.tgz",
      "integrity": "sha512-uxL7qAVQriqRQPAyK3pj66VqskWqoZ37PW94jwOTwNfq/z9oyu1V+eqrZqtR2+fCiXdYOZe/Modt8GtvqNzu+w==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/dcastil"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.19",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.19.tgz",
      "integrity": "sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.6.0",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.2",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.21.7",
        "lilconfig": "^3.1.3",
        "micromatch": "^4.0.8",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.47",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.2 || ^5.0 || ^6.0",
        "postcss-nested": "^6.2.0",
        "postcss-selector-parser": "^6.1.2",
        "resolve": "^1.22.8",
        "sucrase": "^3.35.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
      "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
      "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/three": {
      "version": "0.179.1",
      "resolved": "https://registry.npmjs.org/three/-/three-0.179.1.tgz",
      "integrity": "sha512-5y/elSIQbrvKOISxpwXCR4sQqHtGiOI+MKLc3SsBdDXA2hz3Mdp3X59aUp8DyybMa34aeBwbFTpdoLJaUDEWSw==",
      "license": "MIT"
    },
    "node_modules/three-mesh-bvh": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/three-mesh-bvh/-/three-mesh-bvh-0.8.3.tgz",
      "integrity": "sha512-4G5lBaF+g2auKX3P0yqx+MJC6oVt6sB5k+CchS6Ob0qvH0YIhuUk1eYr7ktsIpY+albCqE80/FVQGV190PmiAg==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">= 0.159.0"
      }
    },
    "node_modules/three-stdlib": {
      "version": "2.36.1",
      "resolved": "https://registry.npmjs.org/three-stdlib/-/three-stdlib-2.36.1.tgz",
      "integrity": "sha512-XyGQrFmNQ5O/IoKm556ftwKsBg11TIb301MB5dWNicziQBEs2g3gtOYIf7pFiLa0zI2gUwhtCjv9fmjnxKZ1Cg==",
      "license": "MIT",
      "dependencies": {
        "@types/draco3d": "^1.4.0",
        "@types/offscreencanvas": "^2019.6.4",
        "@types/webxr": "^0.5.2",
        "draco3d": "^1.4.1",
        "fflate": "^0.6.9",
        "potpack": "^1.0.1"
      },
      "peerDependencies": {
        "three": ">=0.128.0"
      }
    },
    "node_modules/three-stdlib/node_modules/fflate": {
      "version": "0.6.10",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.6.10.tgz",
      "integrity": "sha512-IQrh3lEPM93wVCEczc9SaAOvkmcoQn/G8Bo1e8ZPlY3X3bnAxWaBdvTdvM1hP62iZp0BXWDy4vTAy4fF0+Dlpg==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
      "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/troika-three-text": {
      "version": "0.52.4",
      "resolved": "https://registry.npmjs.org/troika-three-text/-/troika-three-text-0.52.4.tgz",
      "integrity": "sha512-V50EwcYGruV5rUZ9F4aNsrytGdKcXKALjEtQXIOBfhVoZU9VAqZNIoGQ3TMiooVqFAbR1w15T+f+8gkzoFzawg==",
      "license": "MIT",
      "dependencies": {
        "bidi-js": "^1.0.2",
        "troika-three-utils": "^0.52.4",
        "troika-worker-utils": "^0.52.0",
        "webgl-sdf-generator": "1.1.1"
      },
      "peerDependencies": {
        "three": ">=0.125.0"
      }
    },
    "node_modules/troika-three-utils": {
      "version": "0.52.4",
      "resolved": "https://registry.npmjs.org/troika-three-utils/-/troika-three-utils-0.52.4.tgz",
      "integrity": "sha512-NORAStSVa/BDiG52Mfudk4j1FG4jC4ILutB3foPnfGbOeIs9+G5vZLa0pnmnaftZUGm4UwSoqEpWdqvC7zms3A==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">=0.125.0"
      }
    },
    "node_modules/troika-worker-utils": {
      "version": "0.52.0",
      "resolved": "https://registry.npmjs.org/troika-worker-utils/-/troika-worker-utils-0.52.0.tgz",
      "integrity": "sha512-W1CpvTHykaPH5brv5VHLfQo9D1OYuo0cSBEUQFFT/nBUzM8iD6Lq2/tgG/f1OelbAS1WtaTPQzE5uM49egnngw==",
      "license": "MIT"
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
      "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/tunnel-rat": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/tunnel-rat/-/tunnel-rat-0.1.2.tgz",
      "integrity": "sha512-lR5VHmkPhzdhrM092lI2nACsLO4QubF0/yoOhzX7c+wIpbN1GjHNzCc91QlpxBi+cnx8vVJ+Ur6vL5cEoQPFpQ==",
      "license": "MIT",
      "dependencies": {
        "zustand": "^4.3.2"
      }
    },
    "node_modules/tunnel-rat/node_modules/zustand": {
      "version": "4.5.7",
      "resolved": "https://registry.npmjs.org/zustand/-/zustand-4.5.7.tgz",
      "integrity": "sha512-CHOUy7mu3lbD6o6LJLfllpjkzhHXSBlX8B9+qPddUsIfeF5S/UZ5q0kmCsnRqT1UHFQZchNFDDzMbQsuesHWlw==",
      "license": "MIT",
      "dependencies": {
        "use-sync-external-store": "^1.2.2"
      },
      "engines": {
        "node": ">=12.7.0"
      },
      "peerDependencies": {
        "@types/react": ">=16.8",
        "immer": ">=9.0.6",
        "react": ">=16.8"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "immer": {
          "optional": true
        },
        "react": {
          "optional": true
        }
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/use-sync-external-store": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.6.0.tgz",
      "integrity": "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/utility-types": {
      "version": "3.11.0",
      "resolved": "https://registry.npmjs.org/utility-types/-/utility-types-3.11.0.tgz",
      "integrity": "sha512-6Z7Ma2aVEWisaL6TvBCy7P8rm2LQoPv6dJ7ecIaIixHcwfbJ0x7mWdbcwlIM5IGQxPZSFYeqRCqlOOeKoJYMkw==",
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/webgl-constants": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/webgl-constants/-/webgl-constants-1.1.1.tgz",
      "integrity": "sha512-LkBXKjU5r9vAW7Gcu3T5u+5cvSvh5WwINdr0C+9jpzVB41cjQAP5ePArDtk/WHYdVj0GefCgM73BA7FlIiNtdg=="
    },
    "node_modules/webgl-sdf-generator": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/webgl-sdf-generator/-/webgl-sdf-generator-1.1.1.tgz",
      "integrity": "sha512-9Z0JcMTFxeE+b2x1LJTdnaT8rT8aEp7MVxkNwoycNmJWwPdzoXzMh0BjJSh/AEFP+KPYZUli814h8bJZFIZ2jA==",
      "license": "MIT"
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/zustand": {
      "version": "5.0.14",
      "resolved": "https://registry.npmjs.org/zustand/-/zustand-5.0.14.tgz",
      "integrity": "sha512-/8tAspM5LMPr28b3fwLYrtdj77ECpfZviaP75CMTnwO8ISyaE4GDIG/9rDDYq/cH9D2Xw2A2RXglLInmVBQB/g==",
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      },
      "peerDependencies": {
        "@types/react": ">=18.0.0",
        "immer": ">=9.0.6",
        "react": ">=18.0.0",
        "use-sync-external-store": ">=1.2.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "immer": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "use-sync-external-store": {
          "optional": true
        }
      }
    }
  }
}

```


---
## FILE: package.json

```json
{
  "name": "feriwala",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "clsx": "^2.1.1",
    "framer-motion": "^11.18.0",
    "gsap": "^3.13.0",
    "lenis": "^1.3.9",
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.3.1",
    "three": "^0.179.1"
  },
  "devDependencies": {
    "@types/node": "^22.15.0",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3"
  }
}

```


---
## FILE: src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --background: #f4efe6;
  --foreground: #171410;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  text-rendering: geometricPrecision;
}

::selection {
  background: rgba(107, 152, 181, 0.24);
  color: #171410;
}

.font-display {
  font-family: var(--font-instrument-serif), Georgia, serif;
}

.grain {
  background-image: radial-gradient(circle at 1px 1px, rgba(23, 20, 16, 0.08) 1px, transparent 0);
  background-size: 18px 18px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

```


---
## FILE: src/app/layout.tsx

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ReactNode } from "react";

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  src: [
    { path: "../assets/fonts/satoshi/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-Black.woff2", weight: "900", style: "normal" },
  ],
});

const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  src: [{ path: "../assets/fonts/instrument-serif/InstrumentSerif-Regular-latin.woff2", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  title: "Feriwala",
  description: "A premium multi-vendor tech marketplace built for discovery and productivity.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${instrumentSerif.variable}`}>
      <body className="bg-canvas font-sans text-ink antialiased">
        <RootProviders>
          <div id="top" className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_42%)]">
            <SiteHeader />
            {children}
          </div>
        </RootProviders>
      </body>
    </html>
  );
}

```


---
## FILE: src/app/page.tsx

```tsx
import { ScrollEffects } from "@/components/home/ScrollEffects";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Featured } from "@/components/sections/Featured";
import { Trust } from "@/components/sections/Trust";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <ScrollEffects />
      <main>
        <Hero />
        <Categories />
        <BrandStatement />
        <Featured />
        <Trust />
        <CTA />
      </main>
    </>
  );
}

```


---
## FILE: src/app/products/[category]/page.tsx

```tsx
import { categories } from "@/config/categories";
import { productsByCategory } from "@/config/products";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const products = productsByCategory[category.slug] ?? [];

  return (
    <main className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
      <Link href="/products" className="text-sm text-muted underline decoration-line underline-offset-4">
        Back to products
      </Link>
      <p className="mt-6 text-xs uppercase tracking-[0.32em] text-muted">{category.count}</p>
      <h1 className="mt-4 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
        {category.name}
      </h1>
      <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{category.summary}</p>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.slug} className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft">
            <div className="aspect-[4/3] rounded-[1.35rem] border border-line bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(145deg, rgba(255,255,255,0.88), ${category.accent}25)` }} />
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-muted">{product.priceLabel}</p>
            <h2 className="mt-3 font-display text-3xl leading-none text-ink">{product.name}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{product.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs text-muted">
                  {chip}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

```


---
## FILE: src/app/products/page.tsx

```tsx
import { categories } from "@/config/categories";
import { productsByCategory } from "@/config/products";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="mx-auto w-[min(1180px,calc(100vw-2rem))] py-16">
      <p className="text-xs uppercase tracking-[0.32em] text-muted">Products</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
        The category pages will become the working shelf for the marketplace.
      </h1>
      <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">
        This placeholder route keeps navigation intact while the future product detail and collection flows are added.
      </p>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {categories.map((category) => (
          <section key={category.slug} className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">{category.count}</p>
                <h2 className="mt-3 font-display text-3xl leading-none text-ink">{category.name}</h2>
              </div>
              <Link href={`/products/${category.slug}`} className="rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:bg-ink/5">
                Show all
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">{category.summary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {(productsByCategory[category.slug] ?? []).slice(0, 3).map((product) => (
                <div key={product.slug} className="rounded-2xl border border-line bg-canvas p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{product.priceLabel}</p>
                  <p className="mt-3 font-display text-xl leading-none text-ink">{product.name}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

```


---
## FILE: src/components/home/ScrollEffects.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollEffects() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: animation.reveal.y },
          {
            autoAlpha: 1,
            y: 0,
            duration: animation.reveal.duration,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          y: -90,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}

```


---
## FILE: src/components/layout/RootProviders.tsx

```tsx
"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RootProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

```


---
## FILE: src/components/layout/SiteHeader.tsx

```tsx
import { homepageContent } from "@/content/homepage";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1180px,calc(100vw-2rem))] items-center justify-between py-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="font-display text-xl tracking-tight text-ink">{homepageContent.nav.logo}</span>
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sky via-clay to-honey transition-transform duration-300 group-hover:scale-110" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-muted">
          <Link
            href={homepageContent.nav.primary.href}
            className="rounded-full border border-line px-4 py-2 transition-colors hover:border-ink/20 hover:bg-ink/5 hover:text-ink"
          >
            {homepageContent.nav.primary.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}

```


---
## FILE: src/components/sections/BrandStatement.tsx

```tsx
import { homepageContent } from "@/content/homepage";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      {/* Decorative background elements */}
      <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-sky/5 to-transparent blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-honey/5 to-transparent blur-3xl" />

      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div data-reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.brandStatement.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
              {homepageContent.brandStatement.title}
            </h2>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">
              {homepageContent.brandStatement.description}
            </p>
          </div>

          <div data-reveal className="grid gap-4">
            {homepageContent.brandStatement.highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="group rounded-[1.45rem] border border-line/50 bg-gradient-to-br from-white/50 via-surface/30 to-canvas/20 p-6 transition-all duration-300 hover:border-sky/30 hover:bg-gradient-to-br hover:from-sky/5 hover:via-surface/40 hover:to-canvas/30"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-sky via-clay to-honey flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg leading-tight text-ink">{highlight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{highlight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

```


---
## FILE: src/components/sections/CTA.tsx

```tsx
import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)]">
      {/* Decorative elements */}
      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-gradient-to-r from-honey/8 to-transparent blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gradient-to-l from-sky/8 to-transparent blur-3xl" />

      <div
        data-reveal
        className="mx-auto w-[min(1180px,calc(100vw-2rem))] rounded-[2.25rem] border border-line/50 bg-gradient-to-br from-[#FCFBF9] via-[#F7F5F2] to-[#F3EDE4] p-8 sm:p-10 lg:p-14 backdrop-blur-sm"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.finalCta.eyebrow}</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.94] tracking-[-0.04em] text-ink">
          {homepageContent.finalCta.title}
        </h2>
        <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{homepageContent.finalCta.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/products">{homepageContent.finalCta.primaryCta}</ButtonLink>
          <Link
            href="#top"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/5"
          >
            {homepageContent.finalCta.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}


```


---
## FILE: src/components/sections/Categories.tsx

```tsx
import { homepageContent } from "@/content/homepage";
import Link from "next/link";
import Image from "next/image";

export function Categories() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-gradient-to-b from-white via-surface/30 to-canvas/20 py-[clamp(5rem,9vw,8rem)]">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gradient-to-r from-clay/5 to-transparent blur-3xl" />

      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.categories.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.categories.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.categories.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {homepageContent.categories.items.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group rounded-[1.45rem] border border-line bg-canvas p-4 transition-transform duration-300 hover:-translate-y-1 hover:border-ink/15"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.accent }} />
                    <h3 className="font-display text-2xl leading-none text-ink">{category.name}</h3>
                  </div>
                  <span className="text-xs uppercase tracking-[0.28em] text-muted">{category.count}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{category.summary}</p>
                <span className="mt-5 inline-flex text-sm text-ink/80 transition-transform duration-300 group-hover:translate-x-1">
                  Open category
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div data-reveal className="relative rounded-[2.5rem] overflow-hidden border border-line/30 bg-gradient-to-br from-surface/40 to-canvas/30 min-h-[26rem] lg:min-h-[42rem]">
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
            alt="Product categories showcase"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}

```


---
## FILE: src/components/sections/Featured.tsx

```tsx
import { homepageContent } from "@/content/homepage";
import { ProductCard } from "@/components/ui/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Featured() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className="max-w-3xl" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.featured.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.featured.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{homepageContent.featured.description}</p>
        </div>
        <div data-reveal className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {homepageContent.featured.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/products" variant="secondary">
            {homepageContent.featured.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

```


---
## FILE: src/components/sections/Hero.tsx

```tsx
import { homepageContent } from "@/content/homepage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F5F2] via-[#FCFBF9] to-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-[min(1180px,calc(100vw-2rem))] gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div data-reveal className="max-w-2xl">
          <p data-reveal className="text-xs uppercase tracking-[0.32em] text-muted">
            {homepageContent.hero.eyebrow}
          </p>
          <Reveal>
            <h1 className="mt-5 font-display text-[clamp(3.4rem,8vw,7.2rem)] leading-[0.92] tracking-[-0.05em] text-ink">
              {homepageContent.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[1.04rem] leading-8 text-muted">{homepageContent.hero.description}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products">{homepageContent.hero.primaryCta}</ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="relative" data-reveal>
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(107,152,181,0.15),transparent 32%)]" />
          <div className="relative min-h-[28rem] lg:min-h-[42rem] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-surface/30 to-canvas/20 border border-line/30">
            <Image
               src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
              alt="Premium desk setup"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

```


---
## FILE: src/components/sections/Trust.tsx

```tsx
import { homepageContent } from "@/content/homepage";

export function Trust() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]">
      {/* Decorative background */}
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-gradient-to-l from-sky/5 to-transparent blur-3xl" />

      <div className="mx-auto grid w-[min(1180px,calc(100vw-2rem))] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{homepageContent.trust.eyebrow}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {homepageContent.trust.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-8 text-muted">{homepageContent.trust.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {homepageContent.trust.proof.map((item) => (
            <div key={item} className="rounded-[1.45rem] border border-line/50 bg-gradient-to-br from-surface/50 via-white to-canvas/50 p-5 hover:border-line/80 transition-colors duration-300">
              <div className="h-2 w-2 rounded-full bg-gradient-to-br from-sky via-clay to-honey" />
              <p className="mt-4 text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

```


---
## FILE: src/components/three/AssemblyScene.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import { assemblyItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function AssemblyScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={assemblyItems}
      progress={reducedMotion ? animation.assembly.settleProgress : progress}
      animated={!reducedMotion}
      background="#F4EFE8"
      reducedMotion={reducedMotion}
    />
  );
}

```


---
## FILE: src/components/three/CategoryGalaxyScene.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import { categoryGalaxyItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function CategoryGalaxyScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={categoryGalaxyItems}
      progress={reducedMotion ? animation.scene.spreadEnd + 0.06 : progress}
      animated={!reducedMotion}
      background="#F4EFE8"
      reducedMotion={reducedMotion}
    />
  );
}

```


---
## FILE: src/components/three/FloatingUniverseScene.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import { floatingUniverseItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function FloatingUniverseScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={floatingUniverseItems}
      progress={reducedMotion ? animation.scene.spreadEnd + 0.1 : progress}
      animated={!reducedMotion}
      reducedMotion={reducedMotion}
    />
  );
}

```


---
## FILE: src/components/three/FormationScene.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import { formationItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function FormationScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={formationItems}
      progress={reducedMotion ? animation.formation.settleProgress : progress}
      animated={!reducedMotion}
      background="#F7F5F2"
      reducedMotion={reducedMotion}
    />
  );
}

```


---
## FILE: src/components/three/MarketplaceExplosionScene.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import { marketplaceExplosionItems } from "@/config/three";
import { UniverseCanvas } from "./shared";

export default function MarketplaceExplosionScene({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <UniverseCanvas
      items={marketplaceExplosionItems}
      progress={reducedMotion ? animation.scene.spreadEnd + 0.12 : progress}
      animated={!reducedMotion}
      background="#F3EBDD"
      reducedMotion={reducedMotion}
    />
  );
}

```


---
## FILE: src/components/three/SceneFrame.tsx

```tsx
"use client";

import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { animation } from "@/config/animations";
import { palette, sceneSurfaces } from "@/config/materials";
import { useEffect, useRef } from "react";

function CameraFraming({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov;
    
    const distance = (maxDim / 2) / Math.tan((fov * Math.PI) / 360) / 0.7;
    
    camera.position.lerp(new THREE.Vector3(center.x, center.y, distance), 0.1);
    camera.lookAt(center);
  });

  return <group ref={groupRef}>{children}</group>;
}

export function SceneFrame({
  children,
  progress,
  background = sceneSurfaces.canvas,
  reducedMotion,
  lowCost,
}: {
  children: React.ReactNode;
  progress: number;
  background?: string;
  reducedMotion: boolean;
  lowCost: boolean;
}) {
  const spreadRotation = THREE.MathUtils.lerp(0.12, 0.04, progress);

  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 38 }}
      dpr={lowCost ? [1, 1.15] : [1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={false}
    >
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 9, 18]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 6, 5]} intensity={2.4} color="#FFF1E4" />
      <directionalLight position={[-4, -2, 4]} intensity={0.82} color={palette.sky} />
      <directionalLight position={[0, 4, -3]} intensity={0.55} color={palette.clay} />
      <group position={[0, 0, 0]} rotation={[0.05, spreadRotation, 0]}>
        <CameraFraming>
          {children}
        </CameraFraming>
      </group>
      <ContactShadows opacity={0.22} scale={9} blur={2.5} far={5.5} resolution={lowCost ? 128 : 256} color={palette.shadow} />
      {lowCost || reducedMotion ? null : <Environment preset="studio" />}
      {lowCost || reducedMotion ? null : <Sparkles count={18} size={1.8} scale={6} speed={0.26} color={palette.honey} />}
    </Canvas>
  );
}

```


---
## FILE: src/components/three/SceneSlot.tsx

```tsx
"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { animation } from "@/config/animations";
import { cn } from "@/lib/cn";
import { SceneFallback } from "./shared";

type SceneId = "floating-universe" | "assembly" | "category-galaxy" | "marketplace-explosion" | "formation";

type SceneProps = {
  progress: number;
  reducedMotion: boolean;
};

const sceneImports: Record<SceneId, () => Promise<{ default: ComponentType<SceneProps> }>> = {
  "floating-universe": () => import("./FloatingUniverseScene"),
  assembly: () => import("./AssemblyScene"),
  "category-galaxy": () => import("./CategoryGalaxyScene"),
  "marketplace-explosion": () => import("./MarketplaceExplosionScene"),
  formation: () => import("./FormationScene"),
};

export function SceneSlot({
  scene,
  className,
  fallbackTitle,
  scrub = true,
}: {
  scene: SceneId;
  className?: string;
  fallbackTitle: string;
  scrub?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0.5);
  const [active, setActive] = useState(false);

  const SceneComponent = useMemo(
    () =>
      dynamic(sceneImports[scene], {
        ssr: false,
        loading: () => <SceneFallback title={fallbackTitle} />,
      }),
    [fallbackTitle, scene],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scrub || reducedMotion || typeof window === "undefined") return;
    if (!active) return;

    let cleanup: (() => void) | undefined;

    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      void import("gsap").then(({ default: gsap }) => {
        gsap.registerPlugin(ScrollTrigger);
        const trigger = ScrollTrigger.create({
          trigger: ref.current,
          start: animation.scene.scrubStart,
          end: animation.scene.scrubEnd,
          scrub: true,
          onUpdate: (self) => setProgress(self.progress),
        });

        cleanup = () => trigger.kill();
      });
    });

    return () => cleanup?.();
  }, [active, reducedMotion, scrub]);

  return (
    <div
      ref={ref}
      data-parallax
      className={cn("relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface shadow-soft", className)}
    >
      {active ? <SceneComponent progress={reducedMotion ? 0.5 : progress} reducedMotion={Boolean(reducedMotion)} /> : <SceneFallback title={fallbackTitle} />}
    </div>
  );
}

```


---
## FILE: src/components/three/primitives/Dock.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function DockComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentSky.color);
  const detail = usePrimitiveColor(detailColor, "#968779");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[2.48, 0.22, 0.96]} radius={0.16} smoothness={8}>
          <meshStandardMaterial color={shellColor} roughness={0.72} metalness={0.03} envMapIntensity={0.6} />
        </RoundedBox>
        <RoundedBox args={[1.58, 0.06, 0.44]} radius={0.04} smoothness={4} position={[0, 0.15, -0.02]}>
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.26, 0.12]} radius={0.03} smoothness={4} position={[-0.84, -0.15, 0.26]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.26, 0.12]} radius={0.03} smoothness={4} position={[0.84, -0.15, 0.26]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
        <mesh position={[0, -0.17, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.22, 16]} />
          <meshStandardMaterial color="#CFC3B6" roughness={0.5} metalness={0.02} />
        </mesh>
      </group>
    </PrimitiveRig>
  );
}

export const Dock = memo(forwardRef(DockComponent));

export type { PrimitiveProps as DockProps };

```


---
## FILE: src/components/three/primitives/Gadget.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function GadgetComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentSky.color);
  const detail = usePrimitiveColor(detailColor, "#B0A294");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[0.92, 0.92, 0.92]} radius={0.2} smoothness={6}>
          <meshStandardMaterial color={shellColor} roughness={0.58} metalness={0.03} envMapIntensity={0.55} />
        </RoundedBox>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.08, 14, 32]} />
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.03} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[0, 0.28, 0.28]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color="#F7E8DB" roughness={0.34} metalness={0.01} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[-0.34, -0.18, 0.1]} rotation={[0.12, 0, 0.78]}>
          <capsuleGeometry args={[0.06, 0.58, 8, 14]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
        <mesh position={[0.28, -0.26, -0.1]} rotation={[0, 0.22, -0.42]}>
          <capsuleGeometry args={[0.05, 0.42, 8, 14]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
        <RoundedBox args={[0.16, 0.16, 0.16]} radius={0.04} smoothness={4} position={[0.28, 0.05, -0.38]}>
          <meshStandardMaterial color={primitiveMaterials.glowClay.color} roughness={0.28} metalness={0.02} emissive={primitiveMaterials.glowClay.color} emissiveIntensity={0.16} />
        </RoundedBox>
      </group>
    </PrimitiveRig>
  );
}

export const Gadget = memo(forwardRef(GadgetComponent));

export type { PrimitiveProps as GadgetProps };

```


---
## FILE: src/components/three/primitives/Hub.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function HubComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentHoney.color);
  const detail = usePrimitiveColor(detailColor, "#968879");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[1.9, 0.42, 0.96]} radius={0.16} smoothness={8}>
          <meshStandardMaterial color={shellColor} roughness={0.68} metalness={0.03} envMapIntensity={0.56} />
        </RoundedBox>
        <RoundedBox args={[1.48, 0.08, 0.5]} radius={0.05} smoothness={4} position={[0, 0.12, -0.02]}>
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[-0.62, -0.03, 0.46]}>
          <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[-0.32, -0.03, 0.46]}>
          <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[-0.02, -0.03, 0.46]}>
          <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[0.28, -0.03, 0.46]}>
          <meshStandardMaterial color={detail} roughness={0.44} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.1, 0.1]} radius={0.03} smoothness={4} position={[0.62, 0.16, 0.05]}>
          <meshStandardMaterial color={primitiveMaterials.glowSky.color} roughness={0.3} metalness={0.02} emissive={primitiveMaterials.glowSky.color} emissiveIntensity={0.14} />
        </RoundedBox>
      </group>
    </PrimitiveRig>
  );
}

export const Hub = memo(forwardRef(HubComponent));

export type { PrimitiveProps as HubProps };

```


---
## FILE: src/components/three/primitives/Keyboard.tsx

```tsx
"use client";

import { memo, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { primitiveMaterials, PrimitiveRig, type PrimitiveProps, usePrimitiveColor } from "./shared";

type KeySpec = {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
};

function Key({ position, size, rotation = [0, 0, 0], color }: KeySpec & { color: string }) {
  return (
    <RoundedBox args={size} radius={0.05} smoothness={5} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.02} envMapIntensity={0.45} />
    </RoundedBox>
  );
}

function KeyboardComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const keyColor = usePrimitiveColor(detailColor, "#D9D1C7");
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentSky.color);

  const keys = useMemo<KeySpec[]>(
    () => [
      ...Array.from({ length: 12 }, (_, index) => ({
        position: [-0.82 + index * 0.15, 0.28, 0] as [number, number, number],
        size: [0.11, 0.05, 0.11 + (index % 3) * 0.008] as [number, number, number],
      })) as KeySpec[],
      ...Array.from({ length: 12 }, (_, index) => ({
        position: [-0.74 + index * 0.15, 0.08, 0] as [number, number, number],
        size: [0.11, 0.05, 0.108 + (index % 2) * 0.006] as [number, number, number],
      })) as KeySpec[],
      ...Array.from({ length: 11 }, (_, index) => ({
        position: [-0.66 + index * 0.15, -0.12, 0] as [number, number, number],
        size: [0.11, 0.05, 0.106 + (index % 4) * 0.005] as [number, number, number],
      })) as KeySpec[],
      { position: [-0.48, -0.33, 0], size: [0.24, 0.05, 0.11] as [number, number, number] },
      { position: [-0.16, -0.33, 0], size: [0.16, 0.05, 0.11] as [number, number, number] },
      { position: [0.09, -0.33, 0], size: [0.7, 0.05, 0.11] as [number, number, number] },
      { position: [0.58, -0.33, 0], size: [0.16, 0.05, 0.11] as [number, number, number] },
      { position: [0.81, -0.33, 0], size: [0.18, 0.05, 0.11] as [number, number, number] },
    ],
    [],
  );

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[2.55, 0.28, 1.02]} radius={0.18} smoothness={8}>
          <meshStandardMaterial color={shellColor} roughness={0.8} metalness={0.03} envMapIntensity={0.65} />
        </RoundedBox>
        <RoundedBox args={[2.38, 0.05, 0.88]} radius={0.08} smoothness={6} position={[0, 0.14, -0.02]}>
          <meshStandardMaterial color={accent} roughness={0.36} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </RoundedBox>
        <mesh position={[-1.03, 0.14, 0.34]}>
          <boxGeometry args={[0.14, 0.04, 0.11]} />
          <meshStandardMaterial color="#A89687" roughness={0.52} metalness={0.02} />
        </mesh>
        <mesh position={[-0.86, 0.14, 0.34]}>
          <boxGeometry args={[0.14, 0.04, 0.11]} />
          <meshStandardMaterial color="#A89687" roughness={0.52} metalness={0.02} />
        </mesh>
        <mesh position={[-0.69, 0.14, 0.34]}>
          <boxGeometry args={[0.14, 0.04, 0.11]} />
          <meshStandardMaterial color="#A89687" roughness={0.52} metalness={0.02} />
        </mesh>
        {keys.map((key, index) => (
          <Key key={index} {...key} color={keyColor} />
        ))}
      </group>
    </PrimitiveRig>
  );
}

export const Keyboard = memo(forwardRef(KeyboardComponent));

export type { PrimitiveProps as KeyboardProps };

```


---
## FILE: src/components/three/primitives/Lamp.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function LampComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.glowHoney.color);
  const detail = usePrimitiveColor(detailColor, "#9C8E80");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <mesh position={[0, -0.56, 0]}>
          <cylinderGeometry args={[0.54, 0.6, 0.18, 28]} />
          <meshStandardMaterial color={shellColor} roughness={0.68} metalness={0.02} envMapIntensity={0.48} />
        </mesh>
        <mesh position={[0.02, -0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.82, 16]} />
          <meshStandardMaterial color={detail} roughness={0.5} metalness={0.02} />
        </mesh>
        <mesh position={[0.24, 0.16, 0]} rotation={[0, 0, 0.34]}>
          <cylinderGeometry args={[0.045, 0.06, 0.58, 16]} />
          <meshStandardMaterial color={detail} roughness={0.5} metalness={0.02} />
        </mesh>
        <mesh position={[0.45, 0.42, 0]}>
          <cylinderGeometry args={[0.26, 0.31, 0.12, 28]} />
          <meshStandardMaterial color={accent} roughness={0.34} metalness={0.02} emissive={accent} emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0.45, 0.42, 0.03]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#F7E8DD" roughness={0.3} metalness={0.01} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
        <RoundedBox args={[0.18, 0.1, 0.18]} radius={0.03} smoothness={4} position={[0.13, 0.02, 0]}>
          <meshStandardMaterial color={detail} roughness={0.46} metalness={0.02} />
        </RoundedBox>
      </group>
    </PrimitiveRig>
  );
}

export const Lamp = memo(forwardRef(LampComponent));

export type { PrimitiveProps as LampProps };

```


---
## FILE: src/components/three/primitives/Mouse.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function MouseComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shellDeep.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentClay.color);
  const detail = usePrimitiveColor(detailColor, "#9F9183");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <capsuleGeometry args={[0.39, 1.02, 10, 18]} />
          <meshStandardMaterial color={shellColor} roughness={0.54} metalness={0.03} envMapIntensity={0.55} />
        </mesh>
        <RoundedBox args={[0.86, 0.04, 0.06]} radius={0.02} smoothness={4} position={[0.02, 0.19, 0]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
        <mesh position={[0.12, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.16, 18]} />
          <meshStandardMaterial color={accent} roughness={0.36} metalness={0.03} emissive={accent} emissiveIntensity={0.04} />
        </mesh>
        <mesh position={[0.12, 0.22, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 12]} />
          <meshStandardMaterial color="#F3E6DA" roughness={0.42} metalness={0.01} />
        </mesh>
      </group>
    </PrimitiveRig>
  );
}

export const Mouse = memo(forwardRef(MouseComponent));

export type { PrimitiveProps as MouseProps };

```


---
## FILE: src/components/three/primitives/Speaker.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function SpeakerComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentHoney.color);
  const detail = usePrimitiveColor(detailColor, "#A79A8B");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <mesh>
          <cylinderGeometry args={[0.56, 0.58, 1.56, 28]} />
          <meshStandardMaterial color={shellColor} roughness={0.52} metalness={0.04} envMapIntensity={0.62} />
        </mesh>
        <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.04, 12, 28]} />
          <meshStandardMaterial color={detail} roughness={0.42} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.72, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.03, 10, 24]} />
          <meshStandardMaterial color={accent} roughness={0.32} metalness={0.03} emissive={accent} emissiveIntensity={0.05} />
        </mesh>
        <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.03, 10, 24]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.23, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.31, 0.03, 10, 24]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.42, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.026, 10, 24]} />
          <meshStandardMaterial color={shellColor} roughness={0.56} metalness={0.03} />
        </mesh>
        <RoundedBox args={[0.24, 0.12, 0.14]} radius={0.03} smoothness={4} position={[0, -0.82, 0]}>
          <meshStandardMaterial color={detail} roughness={0.45} metalness={0.02} />
        </RoundedBox>
      </group>
    </PrimitiveRig>
  );
}

export const Speaker = memo(forwardRef(SpeakerComponent));

export type { PrimitiveProps as SpeakerProps };

```


---
## FILE: src/components/three/primitives/ToolKit.tsx

```tsx
"use client";

import { memo } from "react";
import { RoundedBox } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";
import { PrimitiveRig, primitiveMaterials, type PrimitiveProps, usePrimitiveColor } from "./shared";

function ToolKitComponent({ scale, position, rotation, bodyColor, accentColor, detailColor, animation }: PrimitiveProps, ref: React.ForwardedRef<THREE.Group>) {
  const shellColor = usePrimitiveColor(bodyColor, primitiveMaterials.shell.color);
  const accent = usePrimitiveColor(accentColor, primitiveMaterials.accentClay.color);
  const detail = usePrimitiveColor(detailColor, "#9D8E81");

  return (
    <PrimitiveRig ref={ref} scale={scale} position={position} rotation={rotation} animation={animation}>
      <group>
        <RoundedBox args={[1.58, 0.16, 0.98]} radius={0.1} smoothness={6} position={[0, -0.48, 0]}>
          <meshStandardMaterial color={shellColor} roughness={0.76} metalness={0.02} />
        </RoundedBox>
        <mesh position={[-0.35, 0.08, 0]} rotation={[0, 0, -0.12]}>
          <capsuleGeometry args={[0.12, 0.64, 8, 14]} />
          <meshStandardMaterial color={accent} roughness={0.46} metalness={0.02} />
        </mesh>
        <mesh position={[-0.35, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.22, 18]} />
          <meshStandardMaterial color="#F1E4D7" roughness={0.38} metalness={0.02} />
        </mesh>
        <RoundedBox args={[0.56, 1.02, 0.42]} radius={0.14} smoothness={6} position={[0.45, 0.04, 0]}>
          <meshStandardMaterial color={shellColor} roughness={0.72} metalness={0.02} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.2, 0.28]} radius={0.06} smoothness={4} position={[0.45, 0.56, 0]}>
          <meshStandardMaterial color={accent} roughness={0.38} metalness={0.02} emissive={accent} emissiveIntensity={0.05} />
        </RoundedBox>
        <mesh position={[0.87, -0.14, 0.08]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.04, 0.05, 0.72, 12]} />
          <meshStandardMaterial color={detail} roughness={0.55} metalness={0.02} />
        </mesh>
        <mesh position={[0.87, -0.54, 0.08]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.18, 0.08, 0.18]} />
          <meshStandardMaterial color={detail} roughness={0.48} metalness={0.02} />
        </mesh>
      </group>
    </PrimitiveRig>
  );
}

export const ToolKit = memo(forwardRef(ToolKitComponent));

export type { PrimitiveProps as ToolKitProps };

```


---
## FILE: src/components/three/primitives/index.ts

```ts
export { Dock } from "./Dock";
export { Gadget } from "./Gadget";
export { Hub } from "./Hub";
export { Keyboard } from "./Keyboard";
export { Lamp } from "./Lamp";
export { Mouse } from "./Mouse";
export { Speaker } from "./Speaker";
export { ToolKit } from "./ToolKit";
export type { PrimitiveAnimation, PrimitiveColors, PrimitiveProps, PrimitiveScale, PrimitiveVector3 } from "./shared";

```


---
## FILE: src/components/three/primitives/shared.tsx

```tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { memo, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { animation } from "@/config/animations";
import { materials, palette } from "@/config/materials";

export type PrimitiveScale = number | [number, number, number];
export type PrimitiveVector3 = [number, number, number];

export type PrimitiveAnimation = {
  floatAmplitude?: number;
  floatSpeed?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
  wobbleAmplitude?: number;
  wobbleSpeed?: number;
  phase?: number;
};

export type PrimitiveColors = {
  bodyColor?: string;
  accentColor?: string;
  detailColor?: string;
};

export type PrimitiveProps = PrimitiveColors & {
  scale?: PrimitiveScale;
  position?: PrimitiveVector3;
  rotation?: PrimitiveVector3;
  animation?: PrimitiveAnimation;
};

type PrimitiveRigProps = Pick<PrimitiveProps, "scale" | "position" | "rotation" | "animation"> & {
  children: ReactNode;
};

export function usePrimitiveColor(baseColor: string | undefined, fallbackColor: string) {
  return useMemo(() => baseColor ?? fallbackColor, [baseColor, fallbackColor]);
}

import { forwardRef } from "react";

export const PrimitiveRig = memo(forwardRef<THREE.Group, PrimitiveRigProps>(function PrimitiveRig({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animation: motionOverrides,
  children,
}, ref) {
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const basePosition = useRef<PrimitiveVector3>(position);
  const baseRotation = useRef<PrimitiveVector3>(rotation);

  useEffect(() => {
    basePosition.current = position;
  }, [position]);

  useEffect(() => {
    baseRotation.current = rotation;
  }, [rotation]);

  const motion = useMemo(
    () => ({
      floatAmplitude: motionOverrides?.floatAmplitude ?? animation.primitives.floatAmplitude.desktop,
      floatSpeed: motionOverrides?.floatSpeed ?? animation.primitives.floatSpeed,
      orbitSpeed: motionOverrides?.orbitSpeed ?? animation.primitives.orbitSpeed,
      rotationSpeed: motionOverrides?.rotationSpeed ?? animation.primitives.rotationSpeed,
      wobbleAmplitude: motionOverrides?.wobbleAmplitude ?? animation.primitives.wobbleAmplitude,
      wobbleSpeed: motionOverrides?.wobbleSpeed ?? animation.primitives.wobbleSpeed,
      phase: motionOverrides?.phase ?? 0,
    }),
    [motionOverrides],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;

    const time = clock.elapsedTime + motion.phase;
    const motionScale = reducedMotion ? animation.primitives.reducedMotionMultiplier : 1;

    group.current.position.set(
      basePosition.current[0] + Math.sin(time * motion.floatSpeed) * motion.floatAmplitude * motionScale,
      basePosition.current[1] + Math.cos(time * motion.floatSpeed * 0.86) * motion.floatAmplitude * 0.72 * motionScale,
      basePosition.current[2] + Math.sin(time * motion.floatSpeed * 0.62) * motion.floatAmplitude * 0.25 * motionScale,
    );

    group.current.rotation.set(
      baseRotation.current[0] + Math.sin(time * motion.rotationSpeed) * motion.wobbleAmplitude * 0.42 * motionScale,
      baseRotation.current[1] + time * motion.orbitSpeed * motionScale,
      baseRotation.current[2] + Math.cos(time * motion.wobbleSpeed) * motion.wobbleAmplitude * 0.28 * motionScale,
    );
  });

    return (
      <group
        ref={(node) => {
          group.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {children}
      </group>
    );
}));

export const primitiveMaterials = {
  shell: materials.shell,
  shellDeep: materials.shellDeep,
  accentSky: materials.accentSky,
  accentClay: materials.accentClay,
  accentHoney: materials.accentHoney,
  detail: materials.detail,
  indicator: materials.indicator,
  glowSky: materials.glowSky,
  glowClay: materials.glowClay,
  glowHoney: materials.glowHoney,
} as const;

export const scenePalette = palette;

```


---
## FILE: src/components/three/shared.tsx

```tsx
"use client";

import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { animation } from "@/config/animations";
import { DEBUG_3D, FALLBACK_TEST } from "@/config/debug";
import { PRIMITIVE_NORMALIZATION } from "@/config/objectSizing";
import { palette, sceneSurfaces } from "@/config/materials";
import type { SceneItem } from "@/config/three";
import { Dock, Gadget, Hub, Keyboard, Lamp, Mouse, Speaker, ToolKit } from "./primitives";

const primitiveMap = {
  keyboard: Keyboard,
  mouse: Mouse,
  speaker: Speaker,
  dock: Dock,
  tool: ToolKit,
  lamp: Lamp,
  gadget: Gadget,
  hub: Hub,
} as const;

function useCompactScreen() {
  const [compactScreen, setCompactScreen] = useState(false);

  useEffect(() => {
    const updateCompactScreen = () => {
      setCompactScreen(window.innerWidth < 768);
    };

    updateCompactScreen();
    window.addEventListener("resize", updateCompactScreen, { passive: true });

    return () => window.removeEventListener("resize", updateCompactScreen);
  }, []);

  return compactScreen;
}

function DebugInfo() {
  useFrame(({ camera }) => {
    if (DEBUG_3D) {
      console.log(`Camera Position: ${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}`);
    }
  });
  return null;
}

function DebugBox({ objectRef }: { objectRef: React.RefObject<THREE.Group | null> }) {
  const helperRef = useRef<THREE.BoxHelper>(null);

  useEffect(() => {
    if (!DEBUG_3D || !objectRef.current) return;
    const helper = new THREE.BoxHelper(objectRef.current, 0xffff00);
    helperRef.current = helper;
    return () => {
      helperRef.current?.dispose();
    };
  }, [objectRef]);

  useFrame(() => {
    if (helperRef.current) {
      helperRef.current.update();
    }
  });

  return <primitive object={helperRef.current || {}} />;
}

function SceneObject({
  item,
  index,
  animated,
  lowCost,
  sceneSpread,
}: {
  item: SceneItem;
  index: number;
  animated: boolean;
  lowCost: boolean;
  sceneSpread: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const Primitive = primitiveMap[item.kind];
  const position = useMemo<[number, number, number]>(
    () => item.position.map((value) => value * sceneSpread) as [number, number, number],
    [item.position, sceneSpread],
  );

  const animationProps = useMemo(
    () => ({
      floatAmplitude: lowCost ? animation.primitives.floatAmplitude.mobile : animation.primitives.floatAmplitude.desktop,
      floatSpeed: animation.primitives.floatSpeed + index * 0.025,
      orbitSpeed: animated ? animation.primitives.orbitSpeed + index * 0.008 : 0,
      rotationSpeed: animation.primitives.rotationSpeed,
      wobbleAmplitude: animation.primitives.wobbleAmplitude * (0.92 + (index % 3) * 0.04),
      wobbleSpeed: animation.primitives.wobbleSpeed + (index % 2) * 0.08,
      phase: index * animation.primitives.phaseStep,
    }),
    [animated, index, lowCost],
  );

  return (
    <>
      {FALLBACK_TEST ? (
        <mesh ref={ref} position={position}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      ) : (
        <Primitive
          ref={ref}
          scale={item.scale * (PRIMITIVE_NORMALIZATION[item.kind] ?? 1)}
          position={position}
          rotation={item.rotation}
          bodyColor={sceneSurfaces.canvas}
          accentColor={item.color}
          detailColor={palette.shadow}
          animation={animationProps}
        />
      )}
      {DEBUG_3D && <DebugBox objectRef={ref} />}
    </>
  );
}

import { SceneFrame } from "./SceneFrame";

export function SceneFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[28rem] items-end overflow-hidden rounded-[2rem] border border-line bg-[radial-gradient(circle_at_18%_20%,rgba(107,152,181,0.16),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(200,133,123,0.14),transparent_22%),linear-gradient(145deg,#f7f5f2,#f0e6db)] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-muted">Loading scene</p>
        <p className="mt-3 max-w-xs font-display text-4xl leading-none text-ink">{title}</p>
      </div>
    </div>
  );
}

export function UniverseCanvas({
  items,
  progress,
  animated = true,
  background = sceneSurfaces.canvas,
  reducedMotion = false,
}: {
  items: SceneItem[];
  progress: number;
  animated?: boolean;
  background?: string;
  reducedMotion?: boolean;
}) {
  const compactScreen = useCompactScreen();
  const lowCost = reducedMotion || compactScreen;
  const sceneSpread = animated
    ? THREE.MathUtils.lerp(animation.scene.spreadStart, animation.scene.spreadEnd, progress)
    : animation.scene.spreadStart;

  return (
    <SceneFrame progress={progress} background={background} reducedMotion={reducedMotion} lowCost={lowCost}>
      {items.map((item, index) => (
        <SceneObject
          key={item.id}
          item={item}
          index={index}
          animated={animated}
          lowCost={lowCost}
          sceneSpread={sceneSpread}
        />
      ))}
    </SceneFrame>
  );
}

```


---
## FILE: src/components/ui/ButtonLink.tsx

```tsx
import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas shadow-soft hover:-translate-y-0.5 hover:bg-ink/95"
      : "border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/5";

  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}

```


---
## FILE: src/components/ui/ProductCard.tsx

```tsx
import { cn } from "@/lib/cn";
import type { ProductCard as ProductCardType } from "@/config/products";
import Link from "next/link";

type ProductCardProps = {
  product: ProductCardType;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.categorySlug}`}
      className={cn(
        "group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:border-ink/15",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-line px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted">
          {product.categoryName}
        </span>
        <span className="text-sm text-ink/70">{product.priceLabel}</span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <div
          className="mb-6 aspect-[4/3] rounded-[1.35rem] border border-line/70 bg-gradient-to-br"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 28%, ${product.accent}33, transparent 38%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.7), transparent 26%), linear-gradient(145deg, rgba(255,255,255,0.88), ${product.accent}18)`,
          }}
        />
        <h3 className="font-display text-2xl leading-none tracking-[-0.02em] text-ink">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{product.summary}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {product.chips.map((chip) => (
          <span key={chip} className="rounded-full border border-line bg-canvas px-3 py-1 text-xs text-muted">
            {chip}
          </span>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center text-sm text-ink/80 transition-transform duration-300 group-hover:translate-x-1">
        Explore category
      </span>
    </Link>
  );
}

```


---
## FILE: src/components/ui/Reveal.tsx

```tsx
"use client";

import { animation } from "@/config/animations";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: animation.reveal.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: animation.reveal.duration, delay }}
    >
      {children}
    </motion.div>
  );
}

```


---
## FILE: src/components/ui/SectionShell.tsx

```tsx
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "left",
}: SectionShellProps) {
  return (
    <section id={id} className={cn("relative overflow-hidden py-[clamp(5rem,9vw,8rem)]", className)}>
      <div className="mx-auto w-[min(1180px,calc(100vw-2rem))]">
        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">{eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-muted">{description}</p>
        </div>
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </section>
  );
}

```


---
## FILE: src/config/animations.ts

```ts
export const animation = {
  reveal: {
    y: 28,
    duration: 0.9,
    stagger: 0.08,
  },
  scene: {
    scrubStart: "top bottom",
    scrubEnd: "bottom top",
    spreadStart: 1,
    spreadEnd: 0.38,
    drift: 0.035,
  },
  primitives: {
    floatAmplitude: {
      desktop: 0.12,
      mobile: 0.06,
    },
    floatSpeed: 0.72,
    orbitSpeed: 0.18,
    rotationSpeed: 0.14,
    wobbleAmplitude: 0.16,
    wobbleSpeed: 0.9,
    phaseStep: 0.38,
    reducedMotionMultiplier: 0.18,
  },
  assembly: {
    settleProgress: 0.64,
    driftScale: 0.22,
    lift: 0.08,
  },
  formation: {
    settleProgress: 0.72,
    bloomScale: 0.18,
    driftScale: 0.26,
  },
  easing: {
    soft: [0.22, 1, 0.36, 1] as const,
    cinematic: [0.16, 1, 0.3, 1] as const,
  },
};

```


---
## FILE: src/config/categories.ts

```ts
export type Category = {
  slug: string;
  name: string;
  summary: string;
  accent: string;
  count: string;
};

export const categories: Category[] = [
  {
    slug: "keyboards",
    name: "Keyboards",
    summary: "Typing hardware with tactile stories, soft lighting, and a clean desk presence.",
    accent: "#6b98b5",
    count: "18 builds",
  },
  {
    slug: "mice",
    name: "Mice",
    summary: "Precision controls and compact forms tuned for work, play, and travel.",
    accent: "#c8857b",
    count: "12 shapes",
  },
  {
    slug: "audio",
    name: "Audio",
    summary: "Desk speakers, headsets, and compact listening tools with calm industrial lines.",
    accent: "#d2926f",
    count: "21 items",
  },
  {
    slug: "cleaning-tools",
    name: "Cleaning Tools",
    summary: "Soft kits, air tools, and maintenance gear that keep the setup looking intentional.",
    accent: "#8e9b8c",
    count: "9 kits",
  },
  {
    slug: "desk-accessories",
    name: "Desk Accessories",
    summary: "Trays, stands, lamps, risers, and the small pieces that finish the ritual.",
    accent: "#7f8f9b",
    count: "27 pieces",
  },
  {
    slug: "hubs",
    name: "Hubs",
    summary: "Docking, power, and expansion tools that make the desk feel unblocked.",
    accent: "#b69a6b",
    count: "14 hubs",
  },
  {
    slug: "gadgets",
    name: "Gadgets",
    summary: "Pocket companions and utility pieces for discovery-minded tech users.",
    accent: "#9a7fb6",
    count: "24 gadgets",
  },
];

export const categorySlugs = categories.map((category) => category.slug);

```


---
## FILE: src/config/debug.ts

```ts
export const DEBUG_3D = true
export const FALLBACK_TEST = false

```


---
## FILE: src/config/materials.ts

```ts
import type { MeshStandardMaterialParameters } from "three";

export const palette = {
  background: "#F7F5F2",
  surface: "#F2ECE4",
  surfaceSoft: "#E9E1D7",
  ink: "#211D18",
  muted: "#6F655D",
  line: "rgba(61, 48, 38, 0.12)",
  shadow: "#B9A996",
  sky: "#6B98B5",
  clay: "#C8857B",
  honey: "#D2926F",
} as const;

export const materials = {
  shell: {
    color: palette.surface,
    roughness: 0.78,
    metalness: 0.03,
    envMapIntensity: 0.7,
  },
  shellDeep: {
    color: palette.surfaceSoft,
    roughness: 0.82,
    metalness: 0.02,
    envMapIntensity: 0.55,
  },
  accentSky: {
    color: palette.sky,
    roughness: 0.48,
    metalness: 0.04,
    envMapIntensity: 0.52,
  },
  accentClay: {
    color: palette.clay,
    roughness: 0.5,
    metalness: 0.04,
    envMapIntensity: 0.52,
  },
  accentHoney: {
    color: palette.honey,
    roughness: 0.46,
    metalness: 0.04,
    envMapIntensity: 0.52,
  },
  detail: {
    color: "#B4A79B",
    roughness: 0.68,
    metalness: 0.02,
    envMapIntensity: 0.48,
  },
  indicator: {
    color: "#F8E6D6",
    roughness: 0.35,
    metalness: 0.03,
    emissive: "#E7B88E",
    emissiveIntensity: 0.1,
  },
  glowSky: {
    color: palette.sky,
    roughness: 0.3,
    metalness: 0.02,
    emissive: palette.sky,
    emissiveIntensity: 0.16,
  },
  glowClay: {
    color: palette.clay,
    roughness: 0.3,
    metalness: 0.02,
    emissive: palette.clay,
    emissiveIntensity: 0.16,
  },
  glowHoney: {
    color: palette.honey,
    roughness: 0.3,
    metalness: 0.02,
    emissive: palette.honey,
    emissiveIntensity: 0.16,
  },
} satisfies Record<string, MeshStandardMaterialParameters>;

export const sceneSurfaces = {
  canvas: palette.background,
  warm: "#F4EFE8",
  sand: "#F3EBDD",
  rose: "#F5E8E2",
} as const;

```


---
## FILE: src/config/objectSizing.ts

```ts
export const OBJECT_TARGET_SIZE = 2.5

export const PRIMITIVE_NORMALIZATION = {
  keyboard: 2.5 / 2.55,
  mouse: 2.5 / 1.02,
  speaker: 2.5 / 1.56,
  dock: 2.5 / 2.48,
  lamp: 2.5 / 1.1,
  gadget: 2.5 / 0.92,
  hub: 2.5 / 1.9,
  tool: 2.5 / 1.58,
} as const;
```


---
## FILE: src/config/products.ts

```ts
import { categories } from "@/config/categories";

export type ProductCard = {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  priceLabel: string;
  summary: string;
  accent: string;
  chips: string[];
};

export const featuredProducts: ProductCard[] = [
  {
    slug: "orbit-75",
    name: "Orbit 75 Keyboard",
    categorySlug: "keyboards",
    categoryName: "Keyboards",
    priceLabel: "From $179",
    summary: "A compact, tactile board with a sculpted profile and quiet premium glow.",
    accent: "#6b98b5",
    chips: ["Hot-swappable", "75% layout", "PBT keycaps"],
  },
  {
    slug: "vector-one",
    name: "Vector One Mouse",
    categorySlug: "mice",
    categoryName: "Mice",
    priceLabel: "From $89",
    summary: "Light, precise, and calm in the hand with a shape that disappears into focus.",
    accent: "#c8857b",
    chips: ["54g", "Hybrid grip", "Silent click"],
  },
  {
    slug: "halo-dock",
    name: "Halo Dock Audio",
    categorySlug: "audio",
    categoryName: "Audio",
    priceLabel: "From $149",
    summary: "A desk speaker with warm tones, a minimal bezel, and layered output control.",
    accent: "#d2926f",
    chips: ["Bluetooth 5.4", "Stereo pair", "Desk mode"],
  },
  {
    slug: "clean-loop",
    name: "Clean Loop Kit",
    categorySlug: "cleaning-tools",
    categoryName: "Cleaning Tools",
    priceLabel: "From $34",
    summary: "A soft maintenance kit for screens, switches, surfaces, and weekly resets.",
    accent: "#8e9b8c",
    chips: ["Microfiber", "Brush set", "Travel pouch"],
  },
  {
    slug: "edge-riser",
    name: "Edge Riser",
    categorySlug: "desk-accessories",
    categoryName: "Desk Accessories",
    priceLabel: "From $69",
    summary: "A low-profile elevation piece that clears space and keeps lines crisp.",
    accent: "#7f8f9b",
    chips: ["Aluminum", "Cable pass", "Anti-slip"],
  },
  {
    slug: "flow-hub",
    name: "Flow Hub 7",
    categorySlug: "hubs",
    categoryName: "Hubs",
    priceLabel: "From $129",
    summary: "A compact expansion hub with power delivery, display routing, and quiet utility.",
    accent: "#b69a6b",
    chips: ["7 ports", "4K ready", "PD 100W"],
  },
  {
    slug: "micro-glow",
    name: "Micro Glow Gadget",
    categorySlug: "gadgets",
    categoryName: "Gadgets",
    priceLabel: "From $49",
    summary: "A pocket-sized tool for tiny tasks, subtle indicators, and desk-side delight.",
    accent: "#9a7fb6",
    chips: ["USB-C", "Haptic cue", "Portable"],
  },
  {
    slug: "tone-arc",
    name: "Tone Arc Headset",
    categorySlug: "audio",
    categoryName: "Audio",
    priceLabel: "From $219",
    summary: "A soft-contact headset built for long sessions, clean calls, and clear playlists.",
    accent: "#d2926f",
    chips: ["ANC", "48h battery", "Soft pads"],
  },
];

export const productsByCategory = categories.reduce<Record<string, ProductCard[]>>((collection, category) => {
  collection[category.slug] = featuredProducts.filter((product) => product.categorySlug === category.slug);
  return collection;
}, {});

```


---
## FILE: src/config/theme.ts

```ts
export const theme = {
  colors: {
    canvas: "#f4efe6",
    surface: "#fbf7f1",
    ink: "#171410",
    muted: "#6d655d",
    sky: "#6b98b5",
    clay: "#c8857b",
    honey: "#d2926f",
  },
  layout: {
    maxWidth: "min(1180px, calc(100vw - 2rem))",
    sectionGap: "clamp(5rem, 9vw, 8rem)",
  },
  motion: {
    fast: 0.45,
    medium: 0.8,
    slow: 1.2,
  },
};

```


---
## FILE: src/config/three.ts

```ts
import { categories } from "@/config/categories";
import { featuredProducts } from "@/config/products";

export type SceneItem = {
  id: string;
  label: string;
  kind: "keyboard" | "mouse" | "speaker" | "dock" | "tool" | "lamp" | "gadget" | "hub";
  color: string;
  accent: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export const floatingUniverseItems: SceneItem[] = featuredProducts.slice(0, 6).map((product, index) => ({
  id: product.slug,
  label: product.name,
  kind: index === 0 ? "keyboard" : index === 1 ? "mouse" : index === 2 ? "speaker" : index === 3 ? "tool" : index === 4 ? "dock" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [
    [-2.6, 0.6, -0.5],
    [2.1, -0.4, 0.2],
    [0.8, 1.4, -0.7],
    [-1.4, -1.3, 0.6],
    [2.8, 1.3, -0.2],
    [0.1, -0.9, 0.9],
  ][index] as [number, number, number],
  rotation: [
    [0.2, -0.4, -0.1],
    [-0.1, 0.5, 0.2],
    [0.6, 0.3, -0.3],
    [-0.5, -0.2, 0.1],
    [0.3, 0.7, 0.2],
    [0.15, -0.6, 0.25],
  ][index] as [number, number, number],
  scale: [1.15, 0.85, 0.9, 0.72, 0.7, 0.62][index],
}));

export const assemblyItems: SceneItem[] = featuredProducts.slice(0, 5).map((product, index) => ({
  id: `assembly-${product.slug}`,
  label: product.name,
  kind: index === 0 ? "keyboard" : index === 1 ? "dock" : index === 2 ? "lamp" : index === 3 ? "mouse" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [
    [-3.2 + index * 1.55, 0.6 - index * 0.14, -0.2 + index * 0.08],
    [-2.2 + index * 1.2, -0.3 + index * 0.06, 0.1 - index * 0.05],
    [-1.1 + index * 0.8, 0.9 - index * 0.2, -0.15],
    [0, 0, 0],
    [1.4, -0.5, 0.2],
  ][index] as [number, number, number],
  rotation: [
    [0.25, -0.3, -0.15],
    [0.1, 0.2, 0.1],
    [-0.2, 0.45, -0.1],
    [0.35, -0.15, 0.1],
    [-0.15, 0.3, 0.2],
  ][index] as [number, number, number],
  scale: [1, 0.85, 0.74, 0.66, 0.56][index],
}));

export const categoryGalaxyItems: SceneItem[] = categories.map((category, index) => ({
  id: category.slug,
  label: category.name,
  kind: index % 4 === 0 ? "keyboard" : index % 4 === 1 ? "mouse" : index % 4 === 2 ? "dock" : "gadget",
  color: category.accent,
  accent: category.accent,
  position: [
    Math.cos((index / categories.length) * Math.PI * 2) * 2.7,
    Math.sin((index / categories.length) * Math.PI * 2) * 1.7,
    index % 2 === 0 ? -0.4 : 0.3,
  ] as [number, number, number],
  rotation: [0.2 * index, -0.3 + index * 0.04, 0.12 * index] as [number, number, number],
  scale: 0.58 + (index % 3) * 0.1,
}));

export const marketplaceExplosionItems: SceneItem[] = featuredProducts.map((product, index) => ({
  id: `market-${product.slug}`,
  label: product.name,
  kind: index % 3 === 0 ? "hub" : index % 3 === 1 ? "tool" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [
    [0, 0, 0],
    [1.8, 0.7, -0.2],
    [-1.6, -0.8, 0.5],
    [0.6, -1.8, -0.1],
    [-2.1, 1.4, 0.2],
    [2.4, -1.2, 0.3],
    [-0.4, 2.1, -0.25],
    [1.1, -0.2, 1.1],
  ][index] as [number, number, number],
  rotation: [
    [0.15, 0.12, 0],
    [0.25, -0.2, 0.1],
    [-0.3, 0.35, -0.05],
    [0.05, -0.24, 0.14],
    [0.2, 0.5, 0.12],
    [-0.1, -0.35, 0.1],
    [0.4, 0.14, -0.18],
    [0.3, -0.2, 0.25],
  ][index] as [number, number, number],
  scale: [1.1, 0.92, 0.84, 0.66, 0.6, 0.64, 0.56, 0.5][index],
}));

export const formationItems: SceneItem[] = featuredProducts.slice(0, 6).map((product, index) => ({
  id: `formation-${product.slug}`,
  label: product.name,
  kind: index === 0 ? "keyboard" : index === 1 ? "mouse" : index === 2 ? "speaker" : index === 3 ? "hub" : index === 4 ? "tool" : "gadget",
  color: product.accent,
  accent: product.accent,
  position: [[-2.2, 0.8, -0.6], [1.8, 0.2, 0.3], [0.3, 1.4, -0.2], [-1.4, -1.1, 0.4], [2.4, -0.8, -0.1], [0.7, -1.6, 0.7]][index] as [number, number, number],
  rotation: [[0.1, -0.25, -0.12], [0.18, 0.35, 0.08], [-0.2, 0.45, -0.14], [0.35, -0.1, 0.1], [-0.12, 0.26, 0.16], [0.24, -0.38, 0.2]][index] as [number, number, number],
  scale: [0.96, 0.88, 0.72, 0.66, 0.62, 0.54][index],
}));

```


---
## FILE: src/content/homepage.ts

```ts
import { categories } from "@/config/categories";
import { featuredProducts } from "@/config/products";

export const homepageContent = {
  nav: {
    logo: "Feriwala",
    primary: { label: "Products", href: "/products" },
  },
  hero: {
    eyebrow: "Curated marketplace for your setup",
    title: "Products for people who care.",
    description:
      "Discover keyboards, mice, audio gear, desk accessories, and productivity gadgets hand-picked for quality and intention.",
    primaryCta: "Explore Products",
    image: "https://images.unsplash.com/photo-1587829191301-d55a63c75d4e?w=1200&q=80",
  },
  categories: {
    eyebrow: "Browse by category",
    title: "Find what you're looking for.",
    description: "Explore our curated collection organized by product type.",
    items: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      summary: category.summary,
      accent: category.accent,
      count: category.count,
    })),
  },
  brandStatement: {
    eyebrow: "Why Feriwala",
    title: "A curated marketplace, not a catalog.",
    description:
      "We believe great tools make work feel better. Every product on Feriwala is chosen for its quality, design, and purpose. No algorithm. No endless scrolling. Just the best.",
    highlights: [
      {
        title: "Carefully Curated",
        description: "Every product is hand-selected for quality and intention.",
      },
      {
        title: "Multi-Vendor",
        description: "Discover products from makers and brands worldwide.",
      },
      {
        title: "Productivity-Focused",
        description: "Tools designed to make your setup feel better.",
      },
    ],
  },
  featured: {
    eyebrow: "Featured products",
    title: "Start exploring.",
    description: "A selection of our most popular and highest-rated items.",
    cta: "Browse all products",
    products: featuredProducts.slice(0, 6),
  },
  trust: {
    eyebrow: "Why trust us",
    title: "Built for people who care about their setup.",
    description:
      "We're obsessed with quality, discovery, and making your workspace feel intentional.",
    proof: [
      "Vendor-verified products",
      "Premium curation process",
      "Community-driven reviews",
    ],
  },
  finalCta: {
    eyebrow: "Ready to explore",
    title: "Find your next favorite product.",
    description: "Browse our full collection and discover tools that fit your style.",
    primaryCta: "Explore Products",
    secondaryCta: "Learn more",
  },
} as const;

```


---
## FILE: src/lib/cn.ts

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```


---
## FILE: tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4efe6",
        surface: "#fbf7f1",
        ink: "#171410",
        muted: "#6d655d",
        line: "rgba(23, 20, 16, 0.12)",
        sky: "#6b98b5",
        clay: "#c8857b",
        honey: "#d2926f",
      },
      fontFamily: {
        display: ['var(--font-instrument-serif)', "Georgia", "serif"],
        sans: ['var(--font-satoshi)', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 20, 16, 0.08)",
        glow: "0 0 0 1px rgba(23, 20, 16, 0.08), 0 24px 80px rgba(107, 152, 181, 0.12)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(23,20,16,0.08) 1px, transparent 0)",
        hero: "radial-gradient(circle at 20% 20%, rgba(107,152,181,0.16), transparent 32%), radial-gradient(circle at 80% 10%, rgba(200,133,123,0.18), transparent 28%), radial-gradient(circle at 50% 90%, rgba(210,146,111,0.14), transparent 26%)",
      },
    },
  },
  plugins: [],
};

export default config;

```


---
## FILE: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```
