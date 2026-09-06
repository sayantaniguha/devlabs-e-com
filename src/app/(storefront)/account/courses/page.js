import Image from "next/image";
import Link from "next/link";
import { LoggedOut } from "@/components/account/LoggedOut";
import { getCurrentProfile } from "@/lib/auth";
import { getMyEnrolledCourses } from "@/lib/data/courses";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export const metadata = { title: "My courses" };

export default async function MyCoursesPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <LoggedOut next="/account/courses" />;

  const enrollments = await getMyEnrolledCourses();

  return (
    <section className="max-w-2xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="flex items-end justify-between gap-stack-md border-b border-dl-rule pb-stack-md mb-stack-lg">
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">
          My courses
        </h1>
        <span className="font-dl-sans text-dl-body text-dl-charcoal tabular-nums whitespace-nowrap">
          {enrollments.length} enrolled
        </span>
      </div>

      {enrollments.length === 0 ? (
        <div className="border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
          <p className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
            You have not enrolled in any courses yet.
          </p>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-2">
            Everything you enrol in shows up here, with full lifetime access.
          </p>
          <Link
            href="/courses"
            className={`inline-block mt-stack-md bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <ul className="border-t border-dl-rule divide-y divide-dl-rule">
          {enrollments.map(({ course }) => (
            <li key={course.id}>
              <Link
                href={`/learn/${course.slug}`}
                className={`group flex items-center gap-stack-md py-stack-md px-1 hover:bg-dl-sheet transition-colors ${FOCUS_RING}`}
              >
                <div className="relative w-24 aspect-video shrink-0 border border-dl-rule bg-dl-sheet overflow-hidden">
                  {course.thumbnail_url && (
                    <Image
                      src={course.thumbnail_url}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="flex flex-col gap-1 min-w-0">
                  {course.category && (
                    <span className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide">
                      {course.category}
                    </span>
                  )}
                  <span className="font-dl-sans text-dl-body font-semibold text-dl-ink group-hover:underline underline-offset-4">
                    {course.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
