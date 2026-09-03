/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // placehold.co (dev-only placeholder images) serves SVG by default,
    // which next/image blocks unless explicitly allowed. Sandboxed via CSP
    // so served SVGs can't execute scripts. Real product images (Supabase
    // Storage uploads) will be raster, so this only matters for placeholders.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emrxvnrcawsbpisfzamt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
