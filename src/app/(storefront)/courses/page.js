import { CourseCard } from "@/components/storefront/CourseCard";
import { getCourses } from "@/lib/data/courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-sm">
        Courses
      </h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-xl">
        Learn from the team building DevLabs.
      </p>

      {courses.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
          No courses available yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
