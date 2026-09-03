import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { getCategories, getProducts } from "@/lib/data/products";

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

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-stack-xl">
      <div className="py-stack-lg border-b border-outline-variant/30 mb-stack-lg flex flex-col md:flex-row justify-between items-baseline gap-stack-sm">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-xs"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-secondary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <span className="material-symbols-outlined text-[16px] mx-1">
                  chevron_right
                </span>
                <span className="text-on-background dark:text-inverse-on-surface">
                  Shop
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-display font-display text-on-background dark:text-inverse-on-surface">
            Shop All
          </h1>
        </div>
        <span className="text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
          {products.length} product{products.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-gutter">
        <ShopFilters categories={categories}>
          {products.length === 0 ? (
            <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container py-stack-xl text-center">
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
