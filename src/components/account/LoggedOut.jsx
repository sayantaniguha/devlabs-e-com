import Link from "next/link";

// The same logged-out block appeared verbatim in all five account routes.
// Extracted because it was copied five times, not on speculation.
export function LoggedOut({ next }) {
  const href = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">
          You are not logged in
        </h1>
        <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-sm">
          Log in to see your courses, orders and saved addresses.
        </p>
        <Link
          href={href}
          className="inline-block mt-stack-md bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
        >
          Log in
        </Link>
      </div>
    </section>
  );
}
