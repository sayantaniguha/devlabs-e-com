// Skeleton mirrors the real courses layout: header rule, 240px filter rail,
// three-up card grid. Sharp corners and dl-sheet fills, matching the system.
export default function CoursesLoading() {
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-video bg-dl-sheet" />
                <div className="h-4 w-24 bg-dl-sheet mt-4" />
                <div className="h-5 w-full bg-dl-sheet mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
