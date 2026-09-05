import Link from "next/link";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-dl-chalk w-full border-t border-dl-rule mt-stack-xl">
      <div className="max-w-container-max mx-auto px-margin-desktop py-stack-xl grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div>
          <div className="font-dl-sans text-lg font-bold text-dl-ink [font-stretch:110%] mb-6">
            DevLabs
          </div>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mb-4">
            Building the tools and community for the next generation of
            engineers.
          </p>
          <p className="font-dl-sans text-dl-body text-dl-charcoal">
            © {YEAR} DevLabs Infrastructure. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="font-dl-sans text-dl-body font-semibold text-dl-ink mb-4 uppercase tracking-wide">
            Shop
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/shop?category=t-shirts&category=hoodies"
                className="font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors"
              >
                Apparel
              </Link>
            </li>
            <li>
              <Link
                href="/shop?category=bags&category=drinkware&category=stickers"
                className="font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                href="/shop?category=desk"
                className="font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors"
              >
                Desk Setup
              </Link>
            </li>
            <li>
              <Link
                href="/courses"
                className="font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors"
              >
                Courses
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-dl-sans text-dl-body font-semibold text-dl-ink mb-4 uppercase tracking-wide">
            Company
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/about"
                className="font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-dl-sans text-dl-body font-semibold text-dl-ink mb-4 uppercase tracking-wide">
            Newsletter
          </h4>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mb-4">
            Subscribe for updates on new drops and course releases.
          </p>
          <form className="flex">
            <input
              className="w-full px-4 py-2 border border-dl-rule bg-dl-sheet text-dl-ink placeholder:text-dl-charcoal font-dl-sans text-dl-body focus:outline-none focus:border-dl-signal focus:ring-1 focus:ring-dl-signal/20"
              placeholder="Email address"
              type="email"
              name="email"
              suppressHydrationWarning
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="bg-dl-ink text-dl-chalk px-4 font-dl-sans hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
