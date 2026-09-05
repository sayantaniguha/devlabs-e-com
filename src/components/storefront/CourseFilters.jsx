"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StarRating } from "@/components/storefront/StarRating";
import { formatPrice } from "@/lib/utils/format";

const MAX_PRICE_CEILING = 9000;
const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0];

export function CourseFilters({ categories, children }) {
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
          <h2 className="text-headline-md font-headline-md text-on-background dark:text-inverse-on-surface">
            Filters
          </h2>
          <button
            type="button"
            onClick={clearAll}
            className="text-body-sm font-body-sm text-secondary hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="border-b border-outline-variant/30 pb-stack-md">
          <h3 className="font-label-caps text-label-caps text-on-background dark:text-inverse-on-surface mb-stack-sm">
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
                  className="rounded border-outline-variant text-secondary focus:ring-secondary/20 form-checkbox h-4 w-4 bg-surface-container-lowest"
                />
                <span className="text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container group-hover:text-on-background dark:group-hover:text-inverse-on-surface transition-colors">
                  {name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-b border-outline-variant/30 pb-stack-md">
          <h3 className="font-label-caps text-label-caps text-on-background dark:text-inverse-on-surface mb-stack-sm">
            Rating
          </h3>
          <div className="space-y-2">
            {RATING_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`flex items-center gap-2 w-full text-left rounded px-1 py-1 transition-colors ${
                  activeRating === value
                    ? "text-secondary"
                    : "text-on-surface-variant dark:text-on-primary-container hover:text-on-background dark:hover:text-inverse-on-surface"
                }`}
              >
                <StarRating average={value} size={16} />
                <span className="text-body-sm font-body-sm">
                  {value.toFixed(1)} &amp; up
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pb-stack-md">
          <h3 className="font-label-caps text-label-caps text-on-background dark:text-inverse-on-surface mb-stack-sm">
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
              className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between mt-2 text-price-sm font-price-sm text-on-surface-variant dark:text-on-primary-container">
            <span>₹0</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col gap-stack-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <div className="relative w-full sm:w-64 group">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-primary-container group-focus-within:text-secondary transition-colors"
              aria-hidden="true"
            >
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all text-body-sm font-body-sm outline-none placeholder:text-on-surface-variant/50 dark:placeholder:text-on-primary-container/50 text-on-surface dark:text-inverse-on-surface"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort by"
              className="w-full pl-3 pr-8 py-2 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all text-body-sm font-body-sm appearance-none outline-none text-on-background dark:text-inverse-on-surface cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <span
              className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-primary-container pointer-events-none text-[20px]"
              aria-hidden="true"
            >
              expand_more
            </span>
          </div>
        </div>

        {children}
      </div>
    </>
  );
}
