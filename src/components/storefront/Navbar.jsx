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
    <header className="sticky top-0 w-full z-40 bg-surface dark:bg-primary-container border-b border-outline-variant dark:border-outline">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <Link
          href="/"
          className="text-headline-lg font-headline-lg font-bold text-on-background dark:text-inverse-on-surface tracking-tight"
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
                className={
                  active
                    ? "text-secondary dark:text-secondary-fixed-dim font-bold border-b-2 border-secondary dark:border-secondary-fixed-dim font-label-caps text-label-caps uppercase pb-1"
                    : "text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors font-label-caps text-label-caps uppercase pb-1"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-stack-md">
          <button
            type="button"
            aria-label="Search"
            className="text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-all scale-95 active:scale-90 duration-150"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-all scale-95 active:scale-90 duration-150"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>

          <ThemeToggle />

          <Link
            href="/account"
            aria-label="Account"
            className="text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-all scale-95 active:scale-90 duration-150"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
