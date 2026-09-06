import Link from "next/link";
import { notFound } from "next/navigation";
import { LoggedOut } from "@/components/account/LoggedOut";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getCurrentProfile } from "@/lib/auth";
import { getMyOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

function Plate({ title, children }) {
  return (
    <section className="border border-dl-rule bg-dl-chalk p-stack-lg mb-stack-lg">
      <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return <LoggedOut next={`/account/orders/${id}`} />;

  const order = await getMyOrderById(id);
  if (!order) notFound();

  return (
    <section className="max-w-2xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <Link
        href="/account/orders"
        className={`inline-block mb-stack-md font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors ${FOCUS_RING}`}
      >
        <span aria-hidden="true">←</span> Back to orders
      </Link>

      <div className="flex items-center justify-between gap-stack-md border-b border-dl-rule pb-stack-md mb-stack-lg">
        <div>
          <h1 className="font-dl-mono text-dl-headline text-dl-ink">
            {order.order_number}
          </h1>
          <p className="font-dl-sans text-dl-body text-dl-charcoal tabular-nums mt-1">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Plate title="Items">
        <div className="flex flex-col gap-stack-sm mb-stack-md">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-stack-sm font-dl-sans text-dl-body"
            >
              <span className="text-dl-charcoal">
                {item.name_snapshot}
                {item.variant_label_snapshot
                  ? ` (${item.variant_label_snapshot})`
                  : ""}{" "}
                × <span className="tabular-nums">{item.quantity}</span>
              </span>
              <span className="text-dl-ink tabular-nums whitespace-nowrap">
                {formatPrice(item.unit_price_snapshot * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-dl-rule pt-stack-sm flex flex-col gap-1">
          <div className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal">
            <span>Shipping</span>
            <span className="tabular-nums">
              {order.shipping_total === 0
                ? "Free"
                : formatPrice(order.shipping_total)}
            </span>
          </div>
          <div className="flex justify-between font-dl-sans text-dl-body-lg font-semibold text-dl-ink pt-1">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>
      </Plate>

      <Plate title="Shipped to">
        <p className="font-dl-sans text-dl-body text-dl-charcoal">
          {order.shipping_name}
          <br />
          {order.shipping_line1}
          {order.shipping_line2 && <>, {order.shipping_line2}</>}
          <br />
          {order.shipping_city}, {order.shipping_state}{" "}
          <span className="tabular-nums">{order.shipping_postal_code}</span>
        </p>
      </Plate>
    </section>
  );
}
