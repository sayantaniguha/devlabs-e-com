import Link from "next/link";
import { LoggedOut } from "@/components/account/LoggedOut";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getCurrentProfile } from "@/lib/auth";
import { getMyOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export const metadata = { title: "Order history" };

export default async function OrderHistoryPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <LoggedOut next="/account/orders" />;

  const orders = await getMyOrders();

  return (
    <section className="max-w-2xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="flex items-end justify-between gap-stack-md border-b border-dl-rule pb-stack-md mb-stack-lg">
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">
          Order history
        </h1>
        <span className="font-dl-sans text-dl-body text-dl-charcoal tabular-nums whitespace-nowrap">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
          <p className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
            You have not placed any orders yet.
          </p>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-2">
            Orders appear here as soon as checkout completes.
          </p>
          <Link
            href="/shop"
            className={`inline-block mt-stack-md bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
          >
            Browse shop
          </Link>
        </div>
      ) : (
        <ul className="border-t border-dl-rule divide-y divide-dl-rule">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className={`group flex items-center justify-between gap-stack-md py-stack-md px-1 hover:bg-dl-sheet transition-colors ${FOCUS_RING}`}
              >
                <span className="flex flex-col gap-1 min-w-0">
                  {/* Mono is for identifiers in this system, which an order
                      number is. Prices stay in sans. */}
                  <span className="font-dl-mono text-dl-body text-dl-ink group-hover:underline underline-offset-4">
                    {order.order_number}
                  </span>
                  <span className="font-dl-sans text-dl-spec text-dl-charcoal tabular-nums">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
                <span className="flex items-center gap-stack-md shrink-0">
                  <span className="font-dl-sans text-dl-body font-semibold text-dl-ink tabular-nums">
                    {formatPrice(order.total)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
