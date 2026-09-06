import { getActiveCourseCount } from "@/lib/data/courses";

// Skeleton mirrors the real courses layout: header rule, 240px filter rail,
// three-up card grid.
//
// The card count is derived rather than hardcoded. A fixed 6 against a real
// 15 made the fallback roughly 1000px shorter than the content replacing it,
// so the footer jumped when the stream swapped them in: an intermittent CLS
// of 0.065 on ~60% of loads. Deriving it means a 16th course cannot silently
// desync the two again. getActiveCourseCount is cached under the "courses"
// tag, so this costs a cache read, not a query.
export default async function CoursesLoading() {
  const count = await getActiveCourseCount();

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl animate-pulse">
      <div className="border-b border-dl-rule pb-stack-md mb-stack-lg">
        <div className="h-10 w-40 bg-dl-sheet" />
        <div className="h-5 w-72 bg-dl-sheet mt-2" />
      </div>
      <div className="flex flex-col md:flex-row gap-gutter">
        <div className="w-full md:w-[240px] shrink-0 flex flex-col gap-stack-lg">
          <div className="h-6 w-20 bg-dl-sheet" />
          <div className="h-40 bg-dl-sheet" />
          <div className="h-24 bg-dl-sheet" />
        </div>
        <div className="flex-grow flex flex-col gap-stack-lg">
          <div className="flex flex-col sm:flex-row justify-between gap-stack-md">
            <div className="h-10 w-full sm:w-64 bg-dl-sheet" />
            <div className="h-10 w-full sm:w-48 bg-dl-sheet" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {Array.from({ length: count }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered
              <div key={i} className="flex flex-col">
                {/* Mirrors CourseCard: image, rule, category, two title
                    lines, price row. Matching the structure matters as much
                    as matching the count, since a short card multiplied by
                    five rows reintroduces the same gap. */}
                <div className="aspect-video bg-dl-sheet" />
                <div className="pt-4 border-t border-dl-rule flex flex-col gap-1">
                  <div className="h-4 w-24 bg-dl-sheet" />
                  <div className="h-5 w-full bg-dl-sheet" />
                  <div className="h-5 w-2/3 bg-dl-sheet" />
                  <div className="h-5 w-28 bg-dl-sheet mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
