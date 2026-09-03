import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/auth";

export default async function AccountPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-md">
          You're not logged in
        </h1>
        <Link
          href="/login"
          className="inline-block bg-secondary text-on-primary px-8 py-3 rounded font-semibold hover:bg-secondary-container transition-colors"
        >
          Log in
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-sm">
        Hi, {profile.full_name || profile.email}
      </h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-lg">
        {profile.email}
      </p>

      {profile.role === "admin" && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2 rounded font-semibold hover:opacity-90 transition-opacity mb-stack-lg"
        >
          <span className="material-symbols-outlined text-[18px]">
            admin_panel_settings
          </span>
          Admin Panel
        </Link>
      )}

      <div className="flex flex-col gap-stack-sm mb-stack-lg">
        <Link
          href="/account/orders"
          className="flex items-center justify-between border border-outline-variant dark:border-outline rounded-lg px-stack-md py-stack-sm hover:bg-surface-container-low dark:hover:bg-surface-container-lowest transition-colors"
        >
          <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
            <span className="material-symbols-outlined text-[18px]">
              receipt_long
            </span>
            Order History
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-on-primary-container">
            chevron_right
          </span>
        </Link>
        <Link
          href="/account/addresses"
          className="flex items-center justify-between border border-outline-variant dark:border-outline rounded-lg px-stack-md py-stack-sm hover:bg-surface-container-low dark:hover:bg-surface-container-lowest transition-colors"
        >
          <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>
            Addresses
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-on-primary-container">
            chevron_right
          </span>
        </Link>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="border border-outline-variant dark:border-outline text-on-surface dark:text-inverse-on-surface px-6 py-2 rounded font-semibold hover:bg-surface-container dark:hover:bg-surface-container-low transition-colors"
        >
          Log out
        </button>
      </form>
    </section>
  );
}
