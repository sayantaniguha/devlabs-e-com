import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : [];

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex items-center space-x-stack-sm font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-lg">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-primary dark:text-inverse-on-surface font-medium">
              {product.category.name}
            </span>
          </>
        )}
      </div>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-stack-xl pt-stack-xl border-t border-outline-variant dark:border-outline">
          <div className="flex justify-between items-end mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg md:text-[32px] text-primary dark:text-inverse-on-surface">
              You may also like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md md:gap-stack-lg">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
