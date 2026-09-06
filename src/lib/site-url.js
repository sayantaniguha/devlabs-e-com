// Absolute origin for the metadata routes (robots.txt, sitemap.xml), which
// must emit absolute URLs.
//
// VERCEL_PROJECT_PRODUCTION_URL is the stable production domain.
// VERCEL_URL is deliberately not used: it is the per-deployment hostname, so
// it would put preview URLs into the production sitemap.
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  return "http://localhost:3000";
}
