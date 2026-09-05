import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AdminTopbar({ title, subtitle }) {
  return (
    <header className="h-[72px] bg-dl-chalk border-b border-dl-rule flex items-center justify-between px-margin-desktop sticky top-0 z-10">
      <div>
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">{title}</h1>
        {subtitle && (
          <p className="font-dl-sans text-dl-body text-dl-charcoal">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
