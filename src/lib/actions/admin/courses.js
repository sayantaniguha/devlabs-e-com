"use server";

import { revalidatePath } from "next/cache";
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
    if (lessonsError) return { error: "Could not save lessons." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
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
    await supabase.from("course_lessons").delete().in("id", toDelete);
  }

  for (const [i, l] of parsed.data.lessons.entries()) {
    if (l.id) {
      await supabase
        .from("course_lessons")
        .update({
          title: l.title,
          video_url: l.video_url || null,
          is_preview: l.is_preview,
          position: i,
        })
        .eq("id", l.id);
    } else {
      await supabase.from("course_lessons").insert({
        course_id: parsed.data.id,
        title: l.title,
        video_url: l.video_url || null,
        is_preview: l.is_preview,
        position: i,
      });
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
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
  return { success: true };
}
