import Link from "next/link";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getCurrentProfile } from "@/lib/auth";
import { getMyOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/format";

export default async function OrderHistoryPage() {
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

  const orders = await getMyOrders();

  return (
    <section className="max-w-2xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-lg">
        Order History
      </h1>

      {orders.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="flex flex-col gap-stack-sm">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between border border-outline-variant dark:border-outline rounded-lg p-stack-md hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors"
            >
              <div>
                <p className="font-price-sm text-price-sm text-on-surface dark:text-inverse-on-surface">
                  {order.order_number}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-price-sm text-price-sm text-on-surface dark:text-inverse-on-surface">
                  {formatPrice(order.total)}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
