import Image from "next/image";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { getMyEnrolledCourses } from "@/lib/data/courses";

export default async function MyCoursesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-md">
          You're not logged in
        </h1>
        <Link
          href="/login"
          className="inline-block bg-secondary text-on-primary px-8 py-3 rounded font-semibold hover:bg-secondary-container transition-colors"
        >
          Log in
        </Link>
      </section>
    );
  }

  const enrollments = await getMyEnrolledCourses();

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-lg">
        My Courses
      </h1>

      {enrollments.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
          You haven't enrolled in any courses yet.
        </p>
      ) : (
        <div className="flex flex-col gap-stack-sm">
          {enrollments.map(({ course }) => (
            <Link
              key={course.id}
              href={`/learn/${course.slug}`}
              className="flex items-center gap-stack-md border border-outline-variant dark:border-outline rounded-lg p-stack-md hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors"
            >
              <div className="relative w-20 aspect-video shrink-0 rounded overflow-hidden bg-surface-container-low dark:bg-inverse-surface">
                {course.thumbnail_url && (
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
                {course.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
