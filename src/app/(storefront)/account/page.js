import Link from "next/link";
import { LoggedOut } from "@/components/account/LoggedOut";
import { ChevronIcon } from "@/components/ui/icons";
import { signOut } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/auth";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

// Words and rules rather than an icon per row. The leading Material Symbols
// glyphs here were the site's second icon family and carried no information
// the label did not already give.
const NAV = [
  { href: "/account/courses", label: "My courses" },
  { href: "/account/orders", label: "Order history" },
  { href: "/account/addresses", label: "Addresses" },
];

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <LoggedOut next="/account" />;

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="border-b border-dl-rule pb-stack-md mb-stack-lg">
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">
          {profile.full_name || profile.email}
        </h1>
        <p className="font-dl-sans text-dl-body text-dl-charcoal mt-1">
          {profile.email}
        </p>
      </div>

      {profile.role === "admin" && (
        <Link
          href="/admin"
          className={`inline-block mb-stack-lg bg-dl-ink text-dl-chalk px-6 py-2 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
        >
          Admin panel
        </Link>
      )}

      <nav aria-label="Account" className="border-t border-dl-rule mb-stack-lg">
        <ul className="divide-y divide-dl-rule">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group flex items-center justify-between gap-stack-sm px-1 py-stack-md font-dl-sans text-dl-body text-dl-ink hover:bg-dl-sheet transition-colors ${FOCUS_RING}`}
              >
                <span className="group-hover:underline underline-offset-4">
                  {item.label}
                </span>
                <ChevronIcon className="w-4 h-4 shrink-0 text-dl-charcoal -rotate-90" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <form action={signOut}>
        <button
          type="submit"
          className={`border border-dl-rule text-dl-ink px-6 py-2 font-dl-sans text-dl-body font-semibold hover:border-dl-ink active:scale-[0.98] transition ${FOCUS_RING}`}
        >
          Log out
        </button>
      </form>
    </section>
  );
}
