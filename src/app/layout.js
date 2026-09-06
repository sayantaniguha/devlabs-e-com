import { Archivo, Inter, JetBrains_Mono, Martian_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// DevLabs redesign token layer — additive only, used by the new landing
// hero. Everything above still renders on Inter/JetBrains Mono.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "Courses on the engineering work we actually ship, plus official DevLabs apparel and desk gear.";

export const metadata = {
  // metadataBase makes the relative og:image paths below resolve to absolute
  // URLs, which is what crawlers and social scrapers require.
  metadataBase: new URL(siteUrl()),
  title: {
    // The brand is integral to the default, so it needs no separator. Child
    // pages supply their own title and the template appends the brand, which
    // is what stops all 26 pages sharing one <title>.
    default: "Engineering courses from the team that builds DevLabs",
    template: "%s · DevLabs",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "DevLabs",
    title: "Engineering courses from the team that builds DevLabs",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "A drafting board holding a half-finished engineering drawing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering courses from the team that builds DevLabs",
    description: SITE_DESCRIPTION,
    images: ["/og/default.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${archivo.variable} ${martianMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface dark:bg-primary-container dark:text-inverse-on-surface">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
