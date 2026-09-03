import { z } from "zod";

export const checkoutItemSchema = z.object({
  itemType: z.enum(["product", "course"]),
  variantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  quantity: z.number().int().min(1),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty"),
  guestEmail: z.string().trim().email().optional().or(z.literal("")),
  shipping: z.object({
    fullName: z.string().trim().min(1, "Name is required"),
    phone: z.string().trim().min(6, "A valid phone number is required"),
    line1: z.string().trim().min(1, "Address is required"),
    line2: z.string().trim().optional().or(z.literal("")),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().min(1, "State is required"),
    postalCode: z.string().trim().min(4, "Postal code is required"),
    country: z.string().trim().min(1).default("IN"),
  }),
});
