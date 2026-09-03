import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { getCurrentProfile } from "@/lib/auth";

export default async function CheckoutPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
      <h1 className="text-display font-display text-on-background dark:text-inverse-on-surface mb-stack-lg">
        Checkout
      </h1>
      <CheckoutForm profile={profile} />
    </main>
  );
}
