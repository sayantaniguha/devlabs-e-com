"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Advertises merch shipping/returns — not relevant (and slightly misleading)
// on course pages, where there's nothing to ship.
export function PromoBanner() {
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);

  // WCAG 2.2.2 requires a pause control for any auto-moving content past 5s,
  // regardless of the OS motion preference — the button below covers that.
  // This just picks a sensible default for users who've asked for less motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  if (pathname.startsWith("/courses") || pathname.startsWith("/learn")) {
    return null;
  }

  return (
    <div className="bg-dl-chalk text-dl-charcoal py-2 font-dl-sans text-dl-body tabular-nums border-b border-dl-rule flex items-center gap-3">
      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap">
        <div
          className="inline-block animate-[marquee_20s_linear_infinite]"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          Free shipping over ₹1,499 · 7-day returns · Made for developers · Free
          shipping over ₹1,499 · 7-day returns · Made for developers
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Resume scrolling text" : "Pause scrolling text"}
        className="shrink-0 mr-3 font-dl-mono text-dl-spec text-dl-charcoal hover:text-dl-ink transition-colors underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
