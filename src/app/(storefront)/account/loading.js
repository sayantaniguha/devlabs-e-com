export default function AccountLoading() {
  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl animate-pulse">
      <div className="h-8 w-56 bg-surface-container-low dark:bg-inverse-surface rounded mb-stack-sm" />
      <div className="h-4 w-40 bg-surface-container-low dark:bg-inverse-surface rounded mb-stack-lg" />
      <div className="flex flex-col gap-stack-sm">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-surface-container-low dark:bg-inverse-surface rounded-lg"
          />
        ))}
      </div>
    </section>
  );
}
