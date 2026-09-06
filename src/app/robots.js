import { siteUrl } from "@/lib/site-url";

// Crawlable: the storefront and both catalogues. Not crawlable: anything
// behind auth, anything transactional, and the API. /learn is gated content
// and /checkout carries order state, so neither belongs in an index.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/checkout",
        "/learn",
        "/api",
        "/login",
        "/signup",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
