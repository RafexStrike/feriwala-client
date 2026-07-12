import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(2, 'Comment must be at least 2 characters').max(2000, 'Comment cannot exceed 2000 characters'),
});

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address cannot exceed 500 characters'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name cannot exceed 200 characters'),
  briefDescription: z.string().min(1, 'Brief description is required').max(500, 'Brief description cannot exceed 500 characters'),
  detailedDescription: z.string().min(1, 'Detailed description is required'),
  price: z.number().positive('Price must be positive'),
  costPrice: z.number().min(0, 'Cost price cannot be negative').default(0),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  tagIds: z.array(z.string()).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  isActive: z.boolean().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  isActive: z.boolean().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'completed', 'canceled']),
  note: z.string().optional(),
});

export const notificationEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  isActive: z.boolean().optional(),
  notificationTypes: z.array(z.string()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
export type NotificationEmailInput = z.infer<typeof notificationEmailSchema>;