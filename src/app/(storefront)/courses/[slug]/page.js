import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/storefront/CourseDetail";
import { getCurrentProfile } from "@/lib/auth";
import {
  getCourseBySlug,
  getMyEnrollment,
  getMyReview,
} from "@/lib/data/courses";

// getCourseBySlug is tag-cached, so this does not cost a second query when
// the page below calls it again.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };

  const description = course.description ?? "";
  return {
    title: course.title,
    description,
    openGraph: {
      type: "article",
      title: course.title,
      description,
      images: course.thumbnail_url
        ? [
            {
              url: course.thumbnail_url,
              width: 1024,
              height: 576,
              alt: course.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description,
      images: course.thumbnail_url ? [course.thumbnail_url] : undefined,
    },
  };
}

// Relative review times are resolved here, on the server, and handed down as
// fixed strings. Computing them during render inside the client component
// called Date.now() on both the server pass and again at hydration, which is
// the "variable input such as Date.now()" hydration-mismatch class: the two
// disagree whenever a render and its hydration straddle a day boundary.
//
// Not folded into getCourseBySlug because that is cached indefinitely and
// invalidated only by tag, so the label would freeze at whatever it was when
// the cache was filled. This page is dynamic, so it recomputes per request.
function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const profile = await getCurrentProfile();
  const isEnrolled = profile ? await getMyEnrollment(course.id) : false;
  const isAdminPreview = profile?.role === "admin" && !isEnrolled;
  const myReview = profile ? await getMyReview(course.id) : null;

  // New objects rather than mutation: `course` comes from the cache.
  const courseWithReviewTimes = {
    ...course,
    reviews: (course.reviews ?? []).map((review) => ({
      ...review,
      timeAgoLabel: timeAgo(review.created_at),
    })),
  };

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <CourseDetail
        course={courseWithReviewTimes}
        isEnrolled={isEnrolled}
        isAdminPreview={isAdminPreview}
        myReview={myReview}
      />
    </section>
  );
}
