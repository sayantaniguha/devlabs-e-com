/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local SVGs (e.g. /hero/hero.svg) need this explicitly allowed —
    // next/image blocks SVG output otherwise. Sandboxed via CSP so served
    // SVGs can't execute scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emrxvnrcawsbpisfzamt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
