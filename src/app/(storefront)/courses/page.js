import { CourseCard } from "@/components/storefront/CourseCard";
import { CourseFilters } from "@/components/storefront/CourseFilters";
import { getCourseCategories, getCourses } from "@/lib/data/courses";

export const metadata = {
  title: "Courses",
  description:
    "Engineering courses taught by the people who build DevLabs. Rendering, systems, infrastructure, security and interview preparation.",
};

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
      <div className="flex justify-between items-end border-b border-dl-rule pb-stack-md mb-stack-lg">
        <div>
          <h1 className="font-dl-sans text-dl-ink [font-stretch:110%] text-[clamp(2rem,4vw+1rem,3rem)] leading-[1.05]">
            Courses
          </h1>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-2">
            Taught by the engineers who build DevLabs.
          </p>
        </div>
        <span className="font-dl-sans text-dl-body text-dl-charcoal tabular-nums whitespace-nowrap">
          {courses.length} course{courses.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-gutter">
        <CourseFilters categories={categories} isEmpty={courses.length === 0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} priority={i < 3} />
            ))}
          </div>
        </CourseFilters>
      </div>
    </section>
  );
}
