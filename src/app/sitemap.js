import { getCourses } from "@/lib/data/courses";
import { getProducts } from "@/lib/data/products";
import { siteUrl } from "@/lib/site-url";

// Rendered per request rather than prerendered at build. Both data functions
// are already tag-cached (revalidateTag("products") / ("courses") fires from
// the admin actions), so this is cheap, it reflects catalogue changes without
// waiting for a revalidation window, and the build never needs database
// access to succeed.
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/courses", changeFrequency: "daily", priority: 0.9 },
  { path: "/shop", changeFrequency: "daily", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
];

// The schema has no updated_at, only created_at, so that is the honest
// lastModified. Better an accurate older date than a fabricated fresh one.
function lastModified(row) {
  return row?.created_at ? new Date(row.created_at) : new Date();
}

export default async function sitemap() {
  const base = siteUrl();

  const [courses, products] = await Promise.all([getCourses(), getProducts()]);

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...courses.map((course) => ({
      url: `${base}/courses/${course.slug}`,
      lastModified: lastModified(course),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${base}/product/${product.slug}`,
      lastModified: lastModified(product),
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
