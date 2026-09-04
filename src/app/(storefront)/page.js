import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/components/storefront/CourseCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCourses } from "@/lib/data/courses";
import { getCategories, getProducts } from "@/lib/data/products";

const CATEGORY_ICONS = {
  "t-shirts": "checkroom",
  hoodies: "dry_cleaning",
  desk: "desktop_windows",
  bags: "backpack",
  drinkware: "local_cafe",
  stickers: "sticky_note_2",
};

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
      {/* Hero */}
      <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col md:flex-row items-center gap-gutter">
        <div className="flex-1 space-y-6">
          <h1 className="font-display text-display text-on-background dark:text-inverse-on-surface">
            Engineered for Innovation.
            <br />
            Styled for You.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container max-w-lg">
            Official DevLabs merchandise and courses. High-quality apparel and
            gear, taught by the team building the product. Comfortable,
            functional, and minimal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/shop"
              className="bg-secondary text-on-primary px-8 py-3 rounded font-semibold hover:bg-secondary-container transition-colors text-center"
            >
              Shop the Collection
            </Link>
            <Link
              href="/courses"
              className="border border-outline-variant dark:border-outline text-on-surface dark:text-inverse-on-surface px-8 py-3 rounded font-semibold hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors text-center"
            >
              Browse Courses
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full aspect-square md:aspect-[6/5] rounded-xl border border-outline-variant dark:border-outline overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <Image
            src="/hero/hero.svg"
            alt="DevLabs apparel and gear"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-surface-container-low dark:bg-primary-container border-y border-outline-variant dark:border-outline">
        <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 sm:grid-cols-3 gap-stack-md">
          {[
            { icon: "local_shipping", text: "Free shipping over ₹1,499" },
            { icon: "autorenew", text: "7-day returns on unworn apparel" },
            { icon: "code", text: "Built by developers, for developers" },
          ].map((item) => (
            <div
              key={item.icon}
              className="flex items-center gap-3 justify-center sm:justify-start"
            >
              <span className="material-symbols-outlined text-secondary dark:text-secondary-fixed-dim">
                {item.icon}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-lg">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-stack-md">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="flex flex-col items-center gap-2 p-stack-lg rounded-lg border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all"
            >
              <span className="material-symbols-outlined text-[32px] text-secondary dark:text-secondary-fixed-dim">
                {CATEGORY_ICONS[category.slug] ?? "category"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="bg-surface-container-low dark:bg-primary-container">
          <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
            <div className="flex items-center justify-between mb-stack-lg">
              <h2 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface">
                Featured Merch
              </h2>
              <Link
                href="/shop"
                className="font-body-sm text-body-sm text-secondary hover:underline whitespace-nowrap"
              >
                Shop all →
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
        <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
          <div className="flex items-center justify-between mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface">
                Explore Our Courses
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mt-1">
                Learn from the team building DevLabs.
              </p>
            </div>
            <Link
              href="/courses"
              className="font-body-sm text-body-sm text-secondary hover:underline whitespace-nowrap"
            >
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
