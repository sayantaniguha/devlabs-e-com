import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/components/storefront/CourseCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCourses } from "@/lib/data/courses";
import { getCategories, getProducts } from "@/lib/data/products";

export default async function Home() {
  const [categories, products, courses] = await Promise.all([
    getCategories(),
    getProducts({ sort: "newest" }),
    getCourses({ sort: "rating-desc" }),
  ]);

  const featuredProducts = products.slice(0, 4);
  const featuredCourses = courses.slice(0, 3);

  return (
    <>
      {/* Hero — DevLabs redesign token layer (dl-*). Everything below this
          section still renders on the previous system; see globals.css. */}
      <section className="bg-dl-chalk">
        <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col md:flex-row items-center gap-gutter">
          <div className="flex-1">
            <h1 className="font-dl-sans font-extrabold text-dl-ink [font-stretch:125%] text-[clamp(2.25rem,5vw+1rem,4.5rem)] leading-[0.98] tracking-[-0.01em]">
              Engineered for Innovation.
              <br />
              Styled for You.
            </h1>
            <p className="font-dl-sans text-dl-body-lg text-dl-charcoal max-w-prose mt-4">
              Official DevLabs merchandise and courses. High-quality apparel
              and gear, taught by the team building the product. Comfortable,
              functional, and minimal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/shop"
                className="bg-dl-ink text-dl-chalk px-8 py-3 font-dl-sans font-semibold text-center hover:opacity-90 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
              >
                Shop the Collection
              </Link>
              <Link
                href="/courses"
                className="border border-dl-rule text-dl-ink px-8 py-3 font-dl-sans font-semibold text-center hover:border-dl-ink active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
              >
                Browse Courses
              </Link>
            </div>
            <p className="font-dl-sans text-dl-spec text-dl-charcoal tabular-nums mt-3">
              <span className="font-dl-mono">{products.length}</span> products
              · <span className="font-dl-mono">{courses.length}</span> courses
            </p>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-[6/5] border border-dl-rule overflow-hidden relative bg-dl-sheet">
            <Image
              src="/hero/hero.jpg"
              alt="DevLabs apparel and gear"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Trust bar — dl tokens, no icons: words carry it instead */}
      <section className="bg-dl-chalk border-b border-dl-rule">
        <ul className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop divide-y divide-dl-rule sm:divide-y-0 sm:flex">
          {[
            "Free shipping over ₹1,499",
            "7-day returns on unworn apparel",
            "Built by developers, for developers",
          ].map((text) => (
            <li
              key={text}
              className="flex-1 py-stack-sm sm:py-stack-md sm:px-6 sm:border-l sm:first:border-l-0 border-dl-rule font-dl-sans text-dl-body text-dl-charcoal text-center sm:text-left"
            >
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Shop by category — indexed spec list, not icon tiles */}
      <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
        <h2 className="font-dl-sans text-dl-headline text-dl-ink mb-stack-lg">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-l border-t border-dl-rule">
          {categories.map((category) => {
            const count = products.filter(
              (p) => p.category?.slug === category.slug,
            ).length;
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group flex flex-col justify-between gap-8 p-stack-lg border-r border-b border-dl-rule bg-dl-chalk hover:bg-dl-sheet transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:-outline-offset-2"
              >
                <span className="font-dl-mono text-dl-spec text-dl-charcoal tabular-nums">
                  {count} {count === 1 ? "product" : "products"}
                </span>
                <span className="font-dl-sans text-dl-body text-dl-ink group-hover:underline underline-offset-4">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="bg-dl-chalk border-t border-dl-rule">
          <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
            <div className="flex items-center justify-between mb-stack-lg">
              <h2 className="font-dl-sans text-dl-headline text-dl-ink">
                Featured Merch
              </h2>
              <Link
                href="/shop"
                className="font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
              >
                Shop all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {featuredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 2}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore our collection */}
      {featuredCourses.length > 0 && (
        <section className="bg-dl-chalk border-t border-dl-rule">
          <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
            <div className="flex items-center justify-between mb-stack-lg">
              <div>
                <h2 className="font-dl-sans text-dl-headline text-dl-ink">
                  Explore Our Courses
                </h2>
                <p className="font-dl-sans text-dl-body text-dl-charcoal mt-1">
                  Learn from the team building DevLabs.
                </p>
              </div>
              <Link
                href="/courses"
                className="font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
              >
                Browse all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
