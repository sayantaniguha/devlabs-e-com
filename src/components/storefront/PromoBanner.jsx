"use client";

import { usePathname } from "next/navigation";

// Advertises merch shipping/returns — not relevant (and slightly misleading)
// on course pages, where there's nothing to ship.
export function PromoBanner() {
  const pathname = usePathname();
  if (pathname.startsWith("/courses") || pathname.startsWith("/learn")) {
    return null;
  }

  return (
    <div className="bg-surface-container-low dark:bg-primary-container text-on-surface-variant dark:text-on-primary-container py-2 text-sm font-medium overflow-hidden whitespace-nowrap border-b border-outline-variant dark:border-outline">
      <div className="inline-block animate-[marquee_20s_linear_infinite]">
        Free shipping over ₹1,499 · 7-day returns · Made for developers · Free
        shipping over ₹1,499 · 7-day returns · Made for developers
      </div>
    </div>
  );
}
