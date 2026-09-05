import { Archivo, Inter, JetBrains_Mono, Martian_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
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

export const metadata = {
  title: "DevLabs — Engineered for Innovation",
  description:
    "Official DevLabs merchandise and courses — apparel and gear designed for the modern developer.",
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
