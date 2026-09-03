import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Footer } from "@/components/storefront/Footer";
import { Navbar } from "@/components/storefront/Navbar";

export default function StorefrontLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="bg-surface-container-low dark:bg-primary-container text-on-surface-variant dark:text-on-primary-container py-2 text-sm font-medium overflow-hidden whitespace-nowrap border-b border-outline-variant dark:border-outline">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          Free shipping over ₹1,499 · 7-day returns · Made for developers · Free
          shipping over ₹1,499 · 7-day returns · Made for developers
        </div>
      </div>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
