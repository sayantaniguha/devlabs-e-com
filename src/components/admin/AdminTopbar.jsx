import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AdminTopbar({ title, subtitle }) {
  return (
    <header className="h-[72px] bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline flex items-center justify-between px-margin-desktop sticky top-0 z-10">
      <div>
        <h1 className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          type="button"
          className="relative p-2 text-on-surface-variant dark:text-on-primary-container hover:text-on-surface dark:hover:text-inverse-on-surface transition-colors rounded-full hover:bg-surface-container-low dark:hover:bg-primary-container"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </button>
      </div>
    </header>
  );
}
