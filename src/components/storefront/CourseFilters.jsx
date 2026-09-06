"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StarRating } from "@/components/storefront/StarRating";
import { formatPrice } from "@/lib/utils/format";

const MAX_PRICE_CEILING = 9000;
const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0];

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export function CourseFilters({ categories, isEmpty, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || MAX_PRICE_CEILING,
  );

  const activeCategories = searchParams.getAll("category");
  const activeRating = Number(searchParams.get("minRating")) || null;
  const sort = searchParams.get("sort") ?? "newest";

  const filterCount =
    activeCategories.length +
    (activeRating ? 1 : 0) +
    (searchParams.get("maxPrice") ? 1 : 0) +
    (searchParams.get("q") ? 1 : 0);

  function pushParams(mutate) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleCategory(name) {
    pushParams((params) => {
      const current = params.getAll("category");
      params.delete("category");
      const next = current.includes(name)
        ? current.filter((c) => c !== name)
        : [...current, name];
      for (const c of next) params.append("category", c);
    });
  }

  function setRating(value) {
    pushParams((params) => {
      if (activeRating === value) {
        params.delete("minRating");
      } else {
        params.set("minRating", String(value));
      }
    });
  }

  function setSort(value) {
    pushParams((params) => params.set("sort", value));
  }

  function clearAll() {
    setSearch("");
    setMaxPrice(MAX_PRICE_CEILING);
    router.push(pathname);
  }

  // Debounce the search box so we're not navigating on every keystroke.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (search === current) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(id);
  }, [search, searchParams, pathname, router]);

  return (
    <>
      <aside className="w-full md:w-[240px] flex-shrink-0 space-y-stack-lg">
        <div className="flex justify-between items-center">
          <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
            Filters
          </h2>
          <button
            type="button"
            onClick={clearAll}
            className={`font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 ${FOCUS_RING}`}
          >
            Clear all
          </button>
        </div>

        <div className="border-b border-dl-rule pb-stack-md">
          <h3 className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-stack-sm">
            Category
          </h3>
          <div className="space-y-2">
            {categories.map((name) => (
              <label
                key={name}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={activeCategories.includes(name)}
                  onChange={() => toggleCategory(name)}
                  className={`w-4 h-4 accent-dl-ink ${FOCUS_RING}`}
                />
                <span className="font-dl-sans text-dl-body text-dl-charcoal group-hover:text-dl-ink transition-colors">
                  {name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-b border-dl-rule pb-stack-md">
          <h3 className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-stack-sm">
            Rating
          </h3>
          <div className="space-y-1">
            {RATING_OPTIONS.map((value) => {
              const active = activeRating === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRating(value)}
                  className={`flex items-center gap-2 w-full text-left px-1 py-1 transition-colors ${FOCUS_RING} ${
                    active
                      ? "text-dl-ink"
                      : "text-dl-charcoal hover:text-dl-ink"
                  }`}
                >
                  <StarRating average={value} size={14} />
                  <span
                    className={`font-dl-sans text-dl-body tabular-nums ${active ? "font-semibold" : ""}`}
                  >
                    {value.toFixed(1)} &amp; up
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pb-stack-md">
          <h3 className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-stack-sm">
            Price
          </h3>
          <div className="px-1">
            <input
              type="range"
              min={0}
              max={MAX_PRICE_CEILING}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              onMouseUp={() =>
                pushParams((params) => params.set("maxPrice", String(maxPrice)))
              }
              onTouchEnd={() =>
                pushParams((params) => params.set("maxPrice", String(maxPrice)))
              }
              aria-label="Maximum price"
              className={`w-full accent-dl-ink cursor-pointer ${FOCUS_RING}`}
            />
          </div>
          <div className="flex justify-between mt-2 font-dl-sans text-dl-body text-dl-charcoal tabular-nums">
            <span>₹0</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col gap-stack-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            aria-label="Search courses"
            className={`w-full sm:w-64 px-4 py-2 bg-dl-chalk border border-dl-rule font-dl-sans text-dl-body text-dl-ink placeholder:text-dl-charcoal focus:border-dl-signal transition-colors ${FOCUS_RING}`}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort by"
            className={`w-full sm:w-48 px-3 py-2 bg-dl-chalk border border-dl-rule font-dl-sans text-dl-body text-dl-ink focus:border-dl-signal transition-colors cursor-pointer ${FOCUS_RING}`}
          >
            <option value="newest">Newest</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Same arrangement as the shop: rendered here rather than passed in,
            so the recovery action can call clearAll() and also reset the
            search box and price slider held in local state. */}
        {isEmpty ? (
          <div className="border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
            <p className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
              {filterCount > 0
                ? "No courses match these filters."
                : "No courses available right now."}
            </p>
            {filterCount > 0 && (
              <>
                <p className="font-dl-sans text-dl-body text-dl-charcoal mt-2">
                  Remove one filter, or clear them all and start again.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className={`mt-stack-md bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}
