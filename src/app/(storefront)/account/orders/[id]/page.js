import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getCurrentProfile } from "@/lib/auth";
import { getMyOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/format";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
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

  const order = await getMyOrderById(id);
  if (!order) notFound();

  return (
    <section className="max-w-2xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <Link
        href="/account/orders"
        className="font-body-sm text-body-sm text-secondary hover:underline mb-stack-md inline-block"
      >
        ← Back to orders
      </Link>

      <div className="flex items-center justify-between mb-stack-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface">
            {order.order_number}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg mb-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-md">
          Items
        </h2>
        <div className="flex flex-col gap-stack-sm mb-stack-md">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-body-sm font-body-sm"
            >
              <span className="text-on-surface-variant dark:text-on-primary-container">
                {item.name_snapshot}
                {item.variant_label_snapshot
                  ? ` (${item.variant_label_snapshot})`
                  : ""}{" "}
                × {item.quantity}
              </span>
              <span className="text-on-surface dark:text-inverse-on-surface">
                {formatPrice(item.unit_price_snapshot * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-outline-variant dark:border-outline pt-stack-sm flex flex-col gap-1">
          <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
            <span>Shipping</span>
            <span>
              {order.shipping_total === 0
                ? "Free"
                : formatPrice(order.shipping_total)}
            </span>
          </div>
          <div className="flex justify-between font-price-lg text-price-lg text-on-background dark:text-inverse-on-surface font-bold pt-1">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-sm">
          Shipped to
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
          {order.shipping_name}
          <br />
          {order.shipping_line1}
          {order.shipping_line2 && <>, {order.shipping_line2}</>}
          <br />
          {order.shipping_city}, {order.shipping_state}{" "}
          {order.shipping_postal_code}
        </p>
      </div>
    </section>
  );
}
