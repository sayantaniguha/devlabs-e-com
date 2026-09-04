"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/slugify";
import { courseSchema } from "@/lib/validations/admin";

async function uniqueSlug(supabase, title, excludeId) {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  for (;;) {
    let query = supabase.from("courses").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${suffix++}`;
  }
}

function courseFields(data) {
  return {
    title: data.title,
    description: data.description || null,
    category: data.category || null,
    level: data.level || null,
    duration_hours: data.duration_hours || null,
    price: data.price,
    compare_at_price: data.compare_at_price || null,
    thumbnail_url: data.thumbnail_url || null,
    status: data.status,
  };
}

export async function createCourse(input) {
  await requireAdmin();
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const slug = await uniqueSlug(supabase, parsed.data.title);

  const { data: course, error } = await supabase
    .from("courses")
    .insert({ ...courseFields(parsed.data), slug })
    .select("id, slug")
    .single();
  if (error) return { error: "Could not create course." };

  if (parsed.data.lessons.length) {
    const { error: lessonsError } = await supabase
      .from("course_lessons")
      .insert(
        parsed.data.lessons.map((l, i) => ({
          course_id: course.id,
          title: l.title,
          video_url: l.video_url || null,
          is_preview: l.is_preview,
          position: i,
        })),
      );
    if (lessonsError) {
      // Don't leave a lesson-less course behind — createCourse is all-or-
      // nothing from the caller's perspective.
      await supabase.from("courses").delete().eq("id", course.id);
      return { error: "Could not save lessons." };
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidateTag("courses");
  revalidateTag("course-categories");
  return { id: course.id };
}

export async function updateCourse(input) {
  await requireAdmin();
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!parsed.data.id) return { error: "Missing course id." };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("courses")
    .update(courseFields(parsed.data))
    .eq("id", parsed.data.id);
  if (error) return { error: "Could not update course." };

  const { data: existingLessons } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("course_id", parsed.data.id);
  const existingIds = new Set((existingLessons ?? []).map((l) => l.id));
  const submittedIds = new Set(
    parsed.data.lessons.filter((l) => l.id).map((l) => l.id),
  );

  const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));
  if (toDelete.length) {
    const { error: deleteError } = await supabase
      .from("course_lessons")
      .delete()
      .in("id", toDelete);
    if (deleteError) {
      return {
        error:
          "Could not remove one or more lessons — they may be referenced elsewhere.",
      };
    }
  }

  const lessonResults = await Promise.all(
    parsed.data.lessons.map((l, i) =>
      l.id
        ? supabase
            .from("course_lessons")
            .update({
              title: l.title,
              video_url: l.video_url || null,
              is_preview: l.is_preview,
              position: i,
            })
            .eq("id", l.id)
        : supabase.from("course_lessons").insert({
            course_id: parsed.data.id,
            title: l.title,
            video_url: l.video_url || null,
            is_preview: l.is_preview,
            position: i,
          }),
    ),
  );
  if (lessonResults.some((r) => r.error)) {
    return { error: "Could not save one or more lessons." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidateTag("courses");
  revalidateTag("course-categories");
  return { id: parsed.data.id };
}

export async function deleteCourse(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: course } = await supabase
    .from("courses")
    .select("thumbnail_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      return {
        error:
          "Could not delete this course — it has already been purchased. Mark it as Draft instead to hide it from the storefront.",
      };
    }
    return { error: "Could not delete course." };
  }

  const path = course?.thumbnail_url?.split("/course-thumbnails/")[1];
  if (path) await supabase.storage.from("course-thumbnails").remove([path]);

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidateTag("courses");
  revalidateTag("course-categories");
  return { success: true };
}
