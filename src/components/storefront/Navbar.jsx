"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cartItemCount, useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const count = cartItemCount(items);

  return (
    <header className="sticky top-0 w-full z-40 bg-dl-chalk border-b border-dl-rule">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Link
          href="/"
          className="font-dl-sans text-xl font-bold text-dl-ink [font-stretch:110%]"
        >
          DevLabs
        </Link>

        <nav className="hidden md:flex gap-gutter">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-dl-sans text-dl-body uppercase tracking-wide pb-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2 ${
                  active
                    ? "text-dl-ink font-semibold border-b-2 border-dl-ink"
                    : "text-dl-charcoal hover:text-dl-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-stack-md">
          <button
            type="button"
            aria-label={`Open cart${count > 0 ? `, ${count} items` : ""}`}
            onClick={openCart}
            className="font-dl-sans text-dl-body text-dl-ink hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
          >
            Cart
            {count > 0 && (
              <span className="ml-1 font-dl-mono text-dl-spec text-dl-signal-ink tabular-nums">
                ({count})
              </span>
            )}
          </button>

          <ThemeToggle />

          <Link
            href="/account"
            className="font-dl-sans text-dl-body text-dl-ink hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
          >
            Account
          </Link>
        </div>
      </div>
    </header>
  );
}
