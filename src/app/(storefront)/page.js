import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/components/storefront/CourseCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCourses } from "@/lib/data/courses";
import { getProducts } from "@/lib/data/products";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export default async function Home() {
  const [products, courses] = await Promise.all([
    getProducts({ sort: "newest" }),
    getCourses({ sort: "rating-desc" }),
  ]);

  const featuredCourses = courses.slice(0, 6);
  const featuredProducts = products.slice(0, 4);

  // Course categories, counted from the courses already fetched rather than
  // with a second query. Courses lead the page now, so these replace the
  // merch category tiles that used to sit here.
  const courseCategories = [
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ].sort();

  return (
    <>
      <section className="bg-dl-chalk border-b border-dl-rule">
        <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col md:flex-row items-center gap-gutter">
          <div className="flex-1">
            {/* Ceiling is 46px, not 72px: the hero text column is ~595px at
                1440, and 72px fitted about 14 characters per line, so any
                two-clause headline wrapped to 4-5 lines. */}
            <h1 className="font-dl-sans font-extrabold text-dl-ink [font-stretch:125%] text-[clamp(1.5rem,3vw+2px,2.875rem)] leading-[0.98] tracking-[-0.01em]">
              Taught by the team
              <br />
              that builds DevLabs.
            </h1>
            {/* The headline now owns the provenance claim, so the subhead
                does not repeat "taught by" and says what the courses cover. */}
            <p className="font-dl-sans text-dl-body-lg text-dl-charcoal max-w-prose mt-4">
              Engineering courses on the work we ship, plus official apparel and
              desk gear.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/courses"
                className={`bg-dl-ink text-dl-chalk px-8 py-3 font-dl-sans font-semibold text-center hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
              >
                Browse Courses
              </Link>
              <Link
                href="/shop"
                className={`border border-dl-rule text-dl-ink px-8 py-3 font-dl-sans font-semibold text-center hover:border-dl-ink active:scale-[0.98] transition ${FOCUS_RING}`}
              >
                Shop the Collection
              </Link>
            </div>
            <p className="font-dl-sans text-dl-spec text-dl-charcoal tabular-nums mt-3">
              <span className="font-dl-mono">{courses.length}</span> courses ·{" "}
              <span className="font-dl-mono">{products.length}</span> products
            </p>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-[6/5] border border-dl-rule overflow-hidden relative bg-dl-sheet">
            <Image
              src="/hero/hero.jpg"
              alt="A drafting board holding a half-finished orthographic engineering drawing, with steel dividers and a scale rule resting on its ledge"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Courses lead the page. This is the business. */}
      {featuredCourses.length > 0 && (
        <section className="bg-dl-chalk">
          <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
            <div className="flex items-end justify-between gap-stack-md mb-stack-lg">
              <div>
                <h2 className="font-dl-sans text-dl-headline text-dl-ink">
                  Courses
                </h2>
                <p className="font-dl-sans text-dl-body text-dl-charcoal mt-1">
                  Taught by the engineers who build DevLabs.
                </p>
              </div>
              <Link
                href="/courses"
                className={`font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 whitespace-nowrap ${FOCUS_RING}`}
              >
                Browse all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {featuredCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} priority={i < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {courseCategories.length > 0 && (
        <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
          <h2 className="font-dl-sans text-dl-headline text-dl-ink mb-stack-lg">
            Browse by Subject
          </h2>
          {/* Three across: the subject count divides evenly, so the grid has
              no dangling empty cell, and the longer names get room. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-l border-t border-dl-rule">
            {courseCategories.map((name) => {
              const count = courses.filter((c) => c.category === name).length;
              return (
                <Link
                  key={name}
                  href={`/courses?category=${encodeURIComponent(name)}`}
                  className={`group flex flex-col justify-between gap-8 p-stack-lg border-r border-b border-dl-rule bg-dl-chalk hover:bg-dl-sheet transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:-outline-offset-2`}
                >
                  <span className="font-dl-sans text-dl-body text-dl-ink group-hover:underline underline-offset-4">
                    {name}
                  </span>
                  <span className="font-dl-mono text-dl-spec text-dl-charcoal tabular-nums">
                    {count} {count === 1 ? "course" : "courses"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Merch, deliberately below the education sections. */}
      {featuredProducts.length > 0 && (
        <section className="bg-dl-chalk border-t border-dl-rule">
          <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
            <div className="flex items-end justify-between gap-stack-md mb-stack-lg">
              <div>
                <h2 className="font-dl-sans text-dl-headline text-dl-ink">
                  Apparel and Desk Gear
                </h2>
                <p className="font-dl-sans text-dl-body text-dl-charcoal mt-1">
                  Official DevLabs merch.
                </p>
              </div>
              <Link
                href="/shop"
                className={`font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 whitespace-nowrap ${FOCUS_RING}`}
              >
                Shop all <span aria-hidden="true">→</span>
              </Link>
            </div>
            {/* The original hero photograph, kept and moved here: it is a good
                shot and it is on-message where merch actually lives now. */}
            <div className="relative w-full aspect-[21/9] border border-dl-rule overflow-hidden bg-dl-sheet mb-stack-lg">
              <Image
                src="/products/merch-lifestyle.jpg"
                alt="A DevLabs backpack, hoodie and mug arranged on a wooden desk beside an open laptop"
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
