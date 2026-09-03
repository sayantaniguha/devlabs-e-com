import { CourseCard } from "@/components/storefront/CourseCard";
import { CourseFilters } from "@/components/storefront/CourseFilters";
import { getCourseCategories, getCourses } from "@/lib/data/courses";

export default async function CoursesPage({ searchParams }) {
  const sp = await searchParams;
  const [courses, categories] = await Promise.all([
    getCourses({
      category: sp.category,
      search: sp.q,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      minRating: sp.minRating ? Number(sp.minRating) : undefined,
      sort: sp.sort,
    }),
    getCourseCategories(),
  ]);

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-sm">
        Courses
      </h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-xl">
        Learn from the team building DevLabs.
      </p>

      <div className="flex flex-col md:flex-row gap-stack-xl">
        <CourseFilters categories={categories}>
          {courses.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              No courses match these filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-gutter">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} priority={i < 3} />
              ))}
            </div>
          )}
        </CourseFilters>
      </div>
    </section>
  );
}
