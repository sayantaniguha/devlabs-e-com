import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/storefront/CourseDetail";
import { getCurrentProfile } from "@/lib/auth";
import {
  getCourseBySlug,
  getMyEnrollment,
  getMyReview,
} from "@/lib/data/courses";

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
