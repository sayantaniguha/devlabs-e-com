"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/utils/format";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const MAX_PRICE_CEILING = 3000;

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const CHIP =
  "flex items-center gap-1.5 border border-dl-rule pl-3 pr-2 py-1 font-dl-sans text-dl-spec text-dl-charcoal";

export function ShopFilters({ categories, currentPage, totalPages, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || MAX_PRICE_CEILING,
  );

  const activeCategories = searchParams.getAll("category");
  const activeSize = searchParams.get("size");
  const activeMaxPrice = Number(searchParams.get("maxPrice")) || null;
  const inStockOnly = searchParams.get("inStock") === "1";
  const activeSearch = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  function pushParams(mutate, { resetPage = true } = {}) {
    const params = new URLSearchParams(searchParams.toString());
    if (resetPage) params.delete("page");
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

  function clearPrice() {
    setMaxPrice(MAX_PRICE_CEILING);
    pushParams((params) => params.delete("maxPrice"));
  }

  function clearSearch() {
    setSearch("");
    pushParams((params) => params.delete("q"));
  }

  function clearAll() {
    setSearch("");
    setMaxPrice(MAX_PRICE_CEILING);
    router.push(pathname);
  }

  function goToPage(page) {
    pushParams((params) => params.set("page", String(page)), {
      resetPage: false,
    });
  }

  // Debounce the search box so we're not navigating on every keystroke.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (search === current) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(id);
  }, [search, searchParams, pathname, router]);

  const activeChips = [
    ...activeCategories.map((slug) => ({
      key: `category:${slug}`,
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      onRemove: () => toggleCategory(slug),
    })),
    ...(activeSize
      ? [
          {
            key: "size",
            label: `Size ${activeSize}`,
            onRemove: () => toggleSize(activeSize),
          },
        ]
      : []),
    ...(activeMaxPrice
      ? [
          {
            key: "price",
            label: `Under ${formatPrice(activeMaxPrice)}`,
            onRemove: clearPrice,
          },
        ]
      : []),
    ...(inStockOnly
      ? [
          {
            key: "inStock",
            label: "In stock only",
            onRemove: toggleInStock,
          },
        ]
      : []),
    ...(activeSearch
      ? [
          {
            key: "search",
            label: `"${activeSearch}"`,
            onRemove: clearSearch,
          },
        ]
      : []),
  ];

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
            {categories.map((c) => (
              <label
                key={c.slug}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={activeCategories.includes(c.slug)}
                  onChange={() => toggleCategory(c.slug)}
                  className={`w-4 h-4 accent-dl-ink ${FOCUS_RING}`}
                />
                <span className="font-dl-sans text-dl-body text-dl-charcoal group-hover:text-dl-ink transition-colors">
                  {c.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-b border-dl-rule pb-stack-md">
          <h3 className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-stack-sm">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const active = activeSize === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1 font-dl-mono text-dl-body transition-colors active:scale-[0.98] ${FOCUS_RING} ${
                    active
                      ? "bg-dl-ink text-dl-chalk"
                      : "border border-dl-rule text-dl-ink hover:border-dl-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-b border-dl-rule pb-stack-md">
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
                pushParams((params) =>
                  params.set("maxPrice", String(maxPrice)),
                )
              }
              onTouchEnd={() =>
                pushParams((params) =>
                  params.set("maxPrice", String(maxPrice)),
                )
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

        <div className="flex items-center justify-between pt-stack-xs">
          <span className="font-dl-sans text-dl-body text-dl-ink">
            In stock only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            aria-label="In stock only"
            onClick={toggleInStock}
            className={`w-10 h-6 relative transition-colors ${FOCUS_RING} ${inStockOnly ? "bg-dl-ink" : "bg-dl-rule"}`}
          >
            <span
              className={`absolute left-1 top-1 bg-dl-chalk w-4 h-4 transition-transform ${inStockOnly ? "translate-x-4" : ""}`}
            />
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col gap-stack-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className={`w-full sm:w-64 px-4 py-2 bg-dl-chalk border border-dl-rule font-dl-sans text-dl-body text-dl-ink placeholder:text-dl-charcoal outline-none focus:border-dl-signal transition-colors ${FOCUS_RING}`}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort by"
            className={`w-full sm:w-48 px-3 py-2 bg-dl-chalk border border-dl-rule font-dl-sans text-dl-body text-dl-ink outline-none focus:border-dl-signal transition-colors cursor-pointer ${FOCUS_RING}`}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <span key={chip.key} className={CHIP}>
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove filter: ${chip.label}`}
                  className={`text-dl-charcoal hover:text-dl-ink transition-colors ${FOCUS_RING}`}
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className={`font-dl-sans text-dl-spec text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 ${FOCUS_RING}`}
            >
              Clear all
            </button>
          </div>
        )}

        {children}

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2 pt-stack-md"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className={`px-3 py-2 border border-dl-rule font-dl-sans text-dl-body text-dl-ink hover:border-dl-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dl-rule ${FOCUS_RING}`}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                aria-current={p === currentPage ? "page" : undefined}
                onClick={() => goToPage(p)}
                className={`w-10 h-10 font-dl-mono text-dl-body tabular-nums transition-colors active:scale-[0.98] ${FOCUS_RING} ${
                  p === currentPage
                    ? "bg-dl-ink text-dl-chalk"
                    : "border border-dl-rule text-dl-ink hover:border-dl-ink"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className={`px-3 py-2 border border-dl-rule font-dl-sans text-dl-body text-dl-ink hover:border-dl-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dl-rule ${FOCUS_RING}`}
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
