export default function ShopLoading() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-stack-xl animate-pulse">
      <div className="py-stack-lg border-b border-outline-variant/30 mb-stack-lg">
        <div className="h-4 w-24 bg-surface-container-low dark:bg-inverse-surface rounded mb-stack-sm" />
        <div className="h-10 w-48 bg-surface-container-low dark:bg-inverse-surface rounded" />
      </div>
      <div className="flex flex-col md:flex-row gap-gutter">
        <div className="w-full md:w-[240px] shrink-0 flex flex-col gap-stack-lg">
          <div className="h-6 w-20 bg-surface-container-low dark:bg-inverse-surface rounded" />
          <div className="h-32 bg-surface-container-low dark:bg-inverse-surface rounded" />
          <div className="h-24 bg-surface-container-low dark:bg-inverse-surface rounded" />
        </div>
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-surface-container-low dark:bg-inverse-surface rounded-lg"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
