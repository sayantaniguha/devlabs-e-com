import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/storefront/CourseDetail";
import { getCurrentProfile } from "@/lib/auth";
import { getCourseBySlug, getMyEnrollment } from "@/lib/data/courses";

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const profile = await getCurrentProfile();
  const isEnrolled = profile
    ? profile.role === "admin" || (await getMyEnrollment(course.id))
    : false;

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <CourseDetail course={course} isEnrolled={isEnrolled} />
    </section>
  );
}
