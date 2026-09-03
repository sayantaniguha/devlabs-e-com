import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  size: z.string().trim().max(20).optional().nullable(),
  sku: z.string().trim().max(60).optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().optional().nullable(),
  category_id: z.string().uuid("Select a category"),
  base_price: z.coerce.number().positive("Price must be greater than 0"),
  compare_at_price: z.coerce.number().positive().optional().nullable(),
  status: z.enum(["active", "draft"]),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
});

export const lessonSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Lesson title is required"),
  video_url: z.string().trim().url().optional().or(z.literal("")),
  is_preview: z.coerce.boolean().default(false),
});

export const courseSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Course title is required"),
  description: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  level: z
    .enum(["Beginner", "Intermediate", "Advanced", "Beginner–Advanced"])
    .optional()
    .nullable(),
  duration_hours: z.coerce.number().positive().optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compare_at_price: z.coerce.number().positive().optional().nullable(),
  thumbnail_url: z.string().trim().url().optional().nullable(),
  status: z.enum(["active", "draft"]),
  lessons: z.array(lessonSchema),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Category name is required"),
});

export const orderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
});
