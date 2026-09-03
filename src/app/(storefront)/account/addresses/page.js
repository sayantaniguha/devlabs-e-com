import Link from "next/link";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm } from "@/components/account/AddressForm";
import { createAddress } from "@/lib/actions/addresses";
import { getCurrentProfile } from "@/lib/auth";
import { getMyAddresses } from "@/lib/data/addresses";

export default async function AddressesPage() {
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

  const addresses = await getMyAddresses();

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-lg">
        Addresses
      </h1>

      {addresses.length > 0 && (
        <div className="flex flex-col gap-stack-sm mb-stack-lg">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}

      <div className="border-t border-outline-variant dark:border-outline pt-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-sm">
          Add a new address
        </h2>
        <AddressForm key={addresses.length} action={createAddress} />
      </div>
    </section>
  );
}
