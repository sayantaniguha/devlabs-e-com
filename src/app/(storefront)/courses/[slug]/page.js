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

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const profile = await getCurrentProfile();
  const isEnrolled = profile ? await getMyEnrollment(course.id) : false;
  const isAdminPreview = profile?.role === "admin" && !isEnrolled;
  const myReview = profile ? await getMyReview(course.id) : null;

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <CourseDetail
        course={course}
        isEnrolled={isEnrolled}
        isAdminPreview={isAdminPreview}
        myReview={myReview}
      />
    </section>
  );
}
