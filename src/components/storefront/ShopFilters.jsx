"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const MAX_PRICE_CEILING = 3000;

export function ShopFilters({ categories, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || MAX_PRICE_CEILING,
  );

  const activeCategories = searchParams.getAll("category");
  const activeSize = searchParams.get("size");
  const inStockOnly = searchParams.get("inStock") === "1";
  const sort = searchParams.get("sort") ?? "newest";

  function pushParams(mutate) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleCategory(slug) {
    pushParams((params) => {
      const current = params.getAll("category");
      params.delete("category");
      const next = current.includes(slug)
        ? current.filter((c) => c !== slug)
        : [...current, slug];
      for (const c of next) params.append("category", c);
    });
  }

  function toggleSize(sizeValue) {
    pushParams((params) => {
      if (params.get("size") === sizeValue) {
        params.delete("size");
      } else {
        params.set("size", sizeValue);
      }
    });
  }

  function setSort(value) {
    pushParams((params) => params.set("sort", value));
  }

  function toggleInStock() {
    pushParams((params) => {
      if (params.get("inStock") === "1") {
        params.delete("inStock");
      } else {
        params.set("inStock", "1");
      }
    });
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
            {categories.map((c) => (
              <label
                key={c.slug}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={activeCategories.includes(c.slug)}
                  onChange={() => toggleCategory(c.slug)}
                  className="rounded border-outline-variant text-secondary focus:ring-secondary/20 form-checkbox h-4 w-4 bg-surface-container-lowest"
                />
                <span className="text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container group-hover:text-on-background dark:group-hover:text-inverse-on-surface transition-colors">
                  {c.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-b border-outline-variant/30 pb-stack-md">
          <h3 className="font-label-caps text-label-caps text-on-background dark:text-inverse-on-surface mb-stack-sm">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={
                  activeSize === s
                    ? "px-3 py-1 border border-secondary bg-secondary/10 rounded text-secondary transition-colors text-body-sm font-body-sm"
                    : "px-3 py-1 border border-outline-variant dark:border-outline rounded hover:border-secondary hover:text-secondary transition-colors text-body-sm font-body-sm bg-surface-container-lowest dark:bg-inverse-surface text-on-surface-variant dark:text-on-primary-container"
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-outline-variant/30 pb-stack-md">
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

        <div className="flex items-center justify-between pt-stack-xs">
          <span className="text-body-sm font-body-sm text-on-background dark:text-inverse-on-surface">
            In stock only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            aria-label="In stock only"
            onClick={toggleInStock}
            className={`w-10 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50 ${inStockOnly ? "bg-secondary" : "bg-surface-variant"}`}
          >
            <span
              className={`absolute left-1 top-1 bg-surface-container-lowest w-4 h-4 rounded-full transition-transform transform ${inStockOnly ? "translate-x-4" : ""}`}
            />
          </button>
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
              placeholder="Search products..."
              aria-label="Search products"
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
