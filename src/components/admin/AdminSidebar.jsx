"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Analytics", icon: "monitoring" },
  { href: "/admin/products", label: "Inventory", icon: "inventory_2" },
  { href: "/admin/courses", label: "Courses", icon: "school" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_cart" },
  { href: "/admin/categories", label: "Categories", icon: "category" },
];

export function AdminSidebar({ profile }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest dark:bg-inverse-surface border-r border-outline-variant dark:border-outline flex flex-col py-stack-lg px-stack-md z-20">
      <div className="mb-stack-lg">
        <p className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface">
          DevLabs
        </p>
        <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider">
          Store Manager
        </p>
      </div>

      <div className="flex items-center gap-3 p-3 mb-stack-lg border border-outline-variant dark:border-outline rounded-lg bg-surface-container-low dark:bg-primary-container">
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-semibold shrink-0">
          {profile.full_name?.[0]?.toUpperCase() ?? "A"}
        </div>
        <div className="min-w-0">
          <p className="font-body-sm text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface truncate">
            {profile.full_name || "Admin"}
          </p>
          <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container">
            Full Access
          </p>
        </div>
      </div>

      <Link
        href="/admin/products?new=1"
        className="w-full bg-secondary text-on-secondary py-2 px-4 rounded-md font-body-sm text-body-sm font-semibold mb-stack-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
          add
        </span>
        New Product
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-body-sm text-body-sm transition-colors ${
                active
                  ? "bg-secondary text-on-secondary font-semibold"
                  : "text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-primary-container"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="mt-auto">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low dark:hover:bg-primary-container transition-colors font-body-sm text-body-sm"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            logout
          </span>
          Logout
        </button>
      </form>
    </aside>
  );
}
