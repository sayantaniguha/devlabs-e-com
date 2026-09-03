import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col md:flex-row items-center gap-gutter">
      <div className="flex-1 space-y-6">
        <h1 className="font-display text-display text-on-background dark:text-inverse-on-surface">
          Engineered for Innovation.
          <br />
          Styled for You.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container max-w-lg">
          Official DevLabs merchandise. High-quality apparel and gear designed
          for the modern developer. Comfortable, functional, and minimal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/shop"
            className="bg-secondary text-on-primary px-8 py-3 rounded font-semibold hover:bg-secondary-container transition-colors text-center"
          >
            Shop the Collection
          </Link>
          <Link
            href="/courses"
            className="border border-outline-variant dark:border-outline text-on-surface dark:text-inverse-on-surface px-8 py-3 rounded font-semibold hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors text-center"
          >
            Browse Courses
          </Link>
        </div>
      </div>
      <div className="flex-1 w-full h-[500px] bg-surface-container-low dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.05)]" />
    </section>
  );
}
