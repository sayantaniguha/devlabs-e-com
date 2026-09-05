"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations/reviews";

// Insert relies on RLS ("course_reviews_insert_own_enrolled") to enforce
// the actual "verified purchase" rule — this check here is just for a fast,
// friendly error message before hitting the database.
export async function createReview(_prevState, formData) {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "You must be logged in to leave a review." };

  const parsed = reviewSchema.safeParse({
    courseId: formData.get("courseId"),
    courseSlug: formData.get("courseSlug"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("course_reviews").insert({
    course_id: parsed.data.courseId,
    user_id: profile.id,
    reviewer_name: profile.full_name || profile.email,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already reviewed this course." };
    }
    return {
      error:
        "Could not save your review — you may need to purchase this course first.",
    };
  }

  revalidatePath("/courses");
  revalidatePath(`/courses/${parsed.data.courseSlug}`);
  // getCourses/getCourseBySlug are wrapped in unstable_cache tagged
  // "courses" — revalidatePath alone doesn't invalidate that, so without
  // this a new review would never actually move the displayed rating.
  revalidateTag("courses");
  return { success: true };
}
