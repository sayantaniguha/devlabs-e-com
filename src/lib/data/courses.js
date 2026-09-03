import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function ratingSummary(reviews) {
  const list = reviews ?? [];
  const count = list.length;
  const average = count
    ? list.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => r.rating === star).length,
  }));
  return { average, count, breakdown };
}

export async function getCourseCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("category")
    .eq("status", "active")
    .not("category", "is", null);
  if (error) throw error;
  return [...new Set(data.map((c) => c.category))].sort();
}

export async function getCourses({
  category,
  search,
  maxPrice,
  minRating,
  sort = "newest",
} = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("courses")
    .select(
      "id, title, slug, price, compare_at_price, thumbnail_url, category, level, duration_hours, created_at, reviews:course_reviews(rating)",
    )
    .eq("status", "active");

  if (search) query = query.ilike("title", `%${search}%`);
  if (maxPrice != null) query = query.lte("price", maxPrice);

  if (sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  query = query.order("id", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;

  let courses = data.map((c) => ({ ...c, rating: ratingSummary(c.reviews) }));

  if (category?.length) {
    const categories = Array.isArray(category) ? category : [category];
    courses = courses.filter((c) => categories.includes(c.category));
  }
  if (minRating) {
    courses = courses.filter((c) => c.rating.average >= minRating);
  }
  if (sort === "rating-desc") {
    courses = [...courses].sort((a, b) => b.rating.average - a.rating.average);
  }

  return courses;
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
      "id, title, slug, description, price, compare_at_price, thumbnail_url, category, level, duration_hours, lessons:course_lessons(id, title, position, is_preview, video_url), reviews:course_reviews(id, reviewer_name, rating, comment, created_at)",
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

  const reviews = [...(course.reviews ?? [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return {
    ...course,
    lessons,
    reviews,
    rating: ratingSummary(course.reviews),
  };
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

export async function getMyReview(courseId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("course_reviews")
    .select("id, rating, comment")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
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
