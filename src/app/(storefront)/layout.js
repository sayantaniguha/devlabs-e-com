import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Footer } from "@/components/storefront/Footer";
import { Navbar } from "@/components/storefront/Navbar";
import { PromoBanner } from "@/components/storefront/PromoBanner";

export default function StorefrontLayout({ children }) {
  return (
    <>
      <Navbar />
      <PromoBanner />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
