export default function CoursesLoading() {
  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl animate-pulse">
      <div className="h-9 w-40 bg-surface-container-low dark:bg-inverse-surface rounded mb-stack-sm" />
      <div className="h-5 w-64 bg-surface-container-low dark:bg-inverse-surface rounded mb-stack-xl" />
      <div className="flex flex-col md:flex-row gap-stack-xl">
        <div className="w-full md:w-[240px] shrink-0 flex flex-col gap-stack-lg">
          <div className="h-6 w-20 bg-surface-container-low dark:bg-inverse-surface rounded" />
          <div className="h-40 bg-surface-container-low dark:bg-inverse-surface rounded" />
          <div className="h-24 bg-surface-container-low dark:bg-inverse-surface rounded" />
        </div>
        <div className="flex-grow grid grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-surface-container-low dark:bg-inverse-surface rounded-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
