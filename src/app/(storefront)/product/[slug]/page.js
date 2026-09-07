import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

// Below this, the row reads as a broken grid rather than a recommendation:
// categories here are small enough that one related item is common.
const MIN_RELATED = 3;

// getProductBySlug is tag-cached, so this does not cost a second query when
// the page below calls it again.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const description = product.description ?? "";
  return {
    title: product.name,
    description,
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: product.primaryImage
        ? [
            {
              url: product.primaryImage,
              width: 1024,
              height: 1024,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.primaryImage ? [product.primaryImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Called unconditionally now: the fallback fills the row for uncategorised
  // products too, instead of leaving them with nothing.
  const related = await getRelatedProducts(product.category_id, product.id);

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex items-center gap-stack-sm font-dl-sans text-dl-body text-dl-charcoal mb-stack-lg">
        <Link
          href="/"
          className="hover:text-dl-ink hover:underline underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
        >
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/shop"
          className="hover:text-dl-ink hover:underline underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
        >
          Shop
        </Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-dl-ink font-semibold">
              {product.category.name}
            </span>
          </>
        )}
      </div>

      <ProductDetail product={product} />

      {related.length >= MIN_RELATED && (
        <section className="mt-stack-xl pt-stack-xl border-t border-dl-rule">
          <div className="flex justify-between items-end mb-stack-lg">
            <h2 className="font-dl-sans text-dl-headline text-dl-ink">
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
    </section>
  );
}
