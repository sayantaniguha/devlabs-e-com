import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/storefront/LessonPlayer";
import { getCurrentProfile } from "@/lib/auth";
import { getCourseForLearning, getMyEnrollment } from "@/lib/data/courses";

export default async function LearnPage({ params }) {
  const { slug } = await params;
  const profile = await getCurrentProfile();
  if (!profile) redirect(`/login?next=/learn/${slug}`);

  const course = await getCourseForLearning(slug);
  if (!course) notFound();

  const isEnrolled =
    profile.role === "admin" || (await getMyEnrollment(course.id));

  if (!isEnrolled) {
    return (
      <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-md">
          You haven't purchased this course
        </h1>
        <Link
          href={`/courses/${slug}`}
          className="inline-block bg-secondary text-on-primary px-8 py-3 rounded font-semibold hover:bg-secondary-container transition-colors"
        >
          View course
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-lg">
        {course.title}
      </h1>
      <LessonPlayer lessons={course.lessons} />
    </section>
  );
}
