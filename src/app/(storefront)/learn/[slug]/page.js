import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/storefront/LessonPlayer";
import { getCurrentProfile } from "@/lib/auth";
import { getCourseForLearning, getMyEnrollment } from "@/lib/data/courses";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

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
      <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
        <div className="max-w-md mx-auto border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
          <h1 className="font-dl-sans text-dl-headline text-dl-ink">
            You do not have access to this course
          </h1>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-sm">
            Enrol to unlock every lesson, with full lifetime access.
          </p>
          <Link
            href={`/courses/${slug}`}
            className={`inline-block mt-stack-md bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
          >
            View course
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="border-b border-dl-rule pb-stack-md mb-stack-lg">
        <Link
          href={`/courses/${slug}`}
          className={`font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors ${FOCUS_RING}`}
        >
          <span aria-hidden="true">←</span> Course overview
        </Link>
        <h1 className="font-dl-sans text-dl-headline text-dl-ink mt-stack-sm">
          {course.title}
        </h1>
      </div>
      <LessonPlayer lessons={course.lessons} />
    </section>
  );
}
