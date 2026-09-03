import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().uuid().optional(),
  line1: z.string().trim().min(1, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  phone: z.string().trim().optional(),
});
