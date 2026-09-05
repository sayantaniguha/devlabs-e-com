import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { getCategories, getProducts } from "@/lib/data/products";

// Client-side page slice, not a query param on getProducts: the catalog is
// small, other callers (the homepage) need the full unpaginated list for
// counts, and slicing an already-fetched array is simplest and lowest-risk.
const PAGE_SIZE = 6;

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;

  const filters = {
    category: sp.category,
    search: sp.q,
    sort: sp.sort,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    size: sp.size,
    inStockOnly: sp.inStock === "1",
  };

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  const totalPages = Math.max(1, Math.ceil(allProducts.length / PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(1, Number(sp.page) || 1),
    totalPages,
  );
  const products = allProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-stack-xl">
      <div className="py-stack-lg border-b border-dl-rule mb-stack-lg flex flex-col md:flex-row justify-between items-baseline gap-stack-sm">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-stack-sm font-dl-sans text-dl-body text-dl-charcoal mb-stack-xs"
          >
            <Link
              href="/"
              className="hover:text-dl-ink hover:underline underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-dl-ink font-semibold">Shop</span>
          </nav>
          <h1 className="font-dl-sans text-dl-nameplate text-dl-ink [font-stretch:110%] text-[clamp(2rem,4vw+1rem,3rem)] leading-[1.05]">
            Shop All
          </h1>
        </div>
        <span className="font-dl-sans text-dl-body text-dl-charcoal tabular-nums">
          {allProducts.length} product{allProducts.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-gutter">
        <ShopFilters
          categories={categories}
          currentPage={currentPage}
          totalPages={totalPages}
        >
          {products.length === 0 ? (
            <p className="font-dl-sans text-dl-body text-dl-charcoal py-stack-xl text-center">
              No products match these filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 3}
                />
              ))}
            </div>
          )}
        </ShopFilters>
      </div>
    </main>
  );
}
