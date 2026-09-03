import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, slug, price, compare_at_price, thumbnail_url")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Trusted server-side read: fetches every lesson (including video_url) via
// the admin client, but only ever hands the caller video_url for preview
// lessons — locked lessons are stripped down to title/position/is_preview
// before this ever reaches a page. That's what actually protects the
// content; the RLS policy on course_lessons is the second line of defense
// for anyone hitting the Supabase REST API directly.
export async function getCourseBySlug(slug) {
  const supabase = createAdminClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, description, price, compare_at_price, thumbnail_url, lessons:course_lessons(id, title, position, is_preview, video_url)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;

  const lessons = [...(course.lessons ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((l) => ({
      id: l.id,
      title: l.title,
      position: l.position,
      is_preview: l.is_preview,
      video_url: l.is_preview ? l.video_url : null,
    }));

  return { ...course, lessons };
}

export async function getMyEnrollment(courseId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function getMyEnrolledCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("enrolled_at, course:courses(id, title, slug, thumbnail_url)")
    .order("enrolled_at", { ascending: false });
  if (error) throw error;
  return data.filter((e) => e.course);
}

// RLS on course_lessons only returns rows the caller may see (previews for
// everyone, everything for an enrollment owner or admin) — so a non-
// enrolled visitor calling this simply gets back the preview subset, never
// a locked video_url.
export async function getCourseForLearning(slug) {
  const supabase = await createClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, lessons:course_lessons(id, title, position, is_preview, video_url)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;

  return {
    ...course,
    lessons: [...(course.lessons ?? [])].sort(
      (a, b) => a.position - b.position,
    ),
  };
}
