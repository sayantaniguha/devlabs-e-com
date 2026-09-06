import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { getCurrentProfile } from "@/lib/auth";

export default async function CheckoutPage() {
  const profile = await getCurrentProfile();

  return (
    <section className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-dl-sans text-dl-ink [font-stretch:110%] text-[clamp(2rem,4vw+1rem,3rem)] leading-[1.05] border-b border-dl-rule pb-stack-md mb-stack-lg">
        Checkout
      </h1>
      <CheckoutForm profile={profile} />
    </section>
  );
}
