import { z } from "zod";

export const reviewSchema = z.object({
  courseId: z.string().uuid(),
  courseSlug: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
});
