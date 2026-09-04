import Link from "next/link";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-primary-container w-full border-t border-outline-variant dark:border-outline mt-stack-xl">
      <div className="max-w-container-max mx-auto px-margin-desktop py-stack-xl grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div>
          <div className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface mb-6">
            DevLabs
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container opacity-80 mb-4">
            Building the tools and community for the next generation of
            engineers.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container opacity-80">
            © {YEAR} DevLabs Infrastructure. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed mb-4 uppercase">
            Shop
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/shop"
                className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
              >
                Apparel
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
              >
                Desk Setup
              </Link>
            </li>
            <li>
              <Link
                href="/courses"
                className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
              >
                Courses
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed mb-4 uppercase">
            Company
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/about"
                className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed mb-4 uppercase">
            Newsletter
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container opacity-80 mb-4">
            Subscribe for updates on new drops and course releases.
          </p>
          <form className="flex">
            <input
              className="w-full px-4 py-2 border border-outline-variant rounded-l focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/10 bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface placeholder:text-on-surface-variant/50 dark:placeholder:text-on-primary-container/50 font-body-sm text-body-sm"
              placeholder="Email address"
              type="email"
              name="email"
              suppressHydrationWarning
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="bg-secondary text-on-primary px-4 py-2 rounded-r hover:bg-secondary-container transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
