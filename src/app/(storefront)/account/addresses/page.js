import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm } from "@/components/account/AddressForm";
import { LoggedOut } from "@/components/account/LoggedOut";
import { createAddress } from "@/lib/actions/addresses";
import { getCurrentProfile } from "@/lib/auth";
import { getMyAddresses } from "@/lib/data/addresses";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <LoggedOut next="/account/addresses" />;

  const addresses = await getMyAddresses();

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="flex items-end justify-between gap-stack-md border-b border-dl-rule pb-stack-md mb-stack-lg">
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">Addresses</h1>
        <span className="font-dl-sans text-dl-body text-dl-charcoal tabular-nums whitespace-nowrap">
          {addresses.length} saved
        </span>
      </div>

      {addresses.length > 0 ? (
        <div className="flex flex-col gap-stack-sm mb-stack-lg">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      ) : (
        <p className="font-dl-sans text-dl-body text-dl-charcoal mb-stack-lg">
          No saved addresses yet. Add one below and it will be offered at
          checkout.
        </p>
      )}

      <div className="border-t border-dl-rule pt-stack-lg">
        <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
          Add a new address
        </h2>
        <AddressForm key={addresses.length} action={createAddress} />
      </div>
    </section>
  );
}
