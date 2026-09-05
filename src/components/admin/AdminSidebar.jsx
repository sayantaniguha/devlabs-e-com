"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Analytics" },
  { href: "/admin/products", label: "Inventory" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/categories", label: "Categories" },
];

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF4A1F] focus-visible:outline-offset-2";

// Permanently dark regardless of the site's light/dark toggle — the settled
// admin structure calls for a fixed dark sidebar, so colors here are the
// literal dl-ink/dl-chalk/dl-charcoal/dl-rule/dl-signal hex values rather
// than the swappable dl-* classes (which would flip wrong in light mode).
export function AdminSidebar({ profile }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#15181B] border-r border-[#2A3034] flex flex-col py-stack-lg px-stack-md z-20">
      <div className="mb-stack-lg">
        <p className="font-dl-sans text-lg font-bold text-[#EDEEEF] [font-stretch:110%]">
          DevLabs
        </p>
        <p className="font-dl-sans text-dl-spec text-[#8A9298] uppercase tracking-wide">
          Store Manager
        </p>
      </div>

      <div className="flex items-center gap-3 p-3 mb-stack-lg border border-[#2A3034]">
        <div className="w-10 h-10 bg-[#2A3034] text-[#EDEEEF] flex items-center justify-center font-dl-sans font-semibold shrink-0">
          {profile.full_name?.[0]?.toUpperCase() ?? "A"}
        </div>
        <div className="min-w-0">
          <p className="font-dl-sans text-dl-body font-semibold text-[#EDEEEF] truncate">
            {profile.full_name || "Admin"}
          </p>
          <p className="font-dl-sans text-dl-spec text-[#8A9298]">
            Full Access
          </p>
        </div>
      </div>

      <Link
        href="/admin/products?new=1"
        className={`w-full bg-[#EDEEEF] text-[#15181B] py-2 px-4 font-dl-sans text-dl-body font-semibold mb-stack-lg flex items-center justify-center hover:opacity-90 transition-opacity ${FOCUS_RING}`}
      >
        + New Product
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
              className={`block px-3 py-2 font-dl-sans text-dl-body border-l-2 transition-colors ${FOCUS_RING} ${
                active
                  ? "border-[#FF4A1F] text-[#EDEEEF] font-semibold bg-[#1C2024]"
                  : "border-transparent text-[#8A9298] hover:text-[#EDEEEF]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="mt-auto">
        <button
          type="submit"
          className={`w-full text-left px-3 py-2 text-[#8A9298] hover:text-[#EDEEEF] transition-colors font-dl-sans text-dl-body ${FOCUS_RING}`}
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
