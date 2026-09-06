import Link from "next/link";
import { CheckIcon } from "@/components/ui/icons";
import { getOrderForConfirmation } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const PRIMARY = `inline-block bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`;

function Plate({ title, children, className = "" }) {
  return (
    <section
      className={`border border-dl-rule bg-dl-chalk p-stack-lg mb-stack-lg ${className}`}
    >
      <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const sp = await searchParams;
  const order = await getOrderForConfirmation(sp.order, sp.token);

  if (!order) {
    return (
      <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
        <div className="border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
          <h1 className="font-dl-sans text-dl-headline text-dl-ink">
            Order not found
          </h1>
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-sm">
            This confirmation link may have expired or been mistyped.
          </p>
          <Link href="/shop" className={`mt-stack-md ${PRIMARY}`}>
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  const isPaymentFailed = order.status === "payment_failed";
  const isPaid = !isPaymentFailed && order.status !== "pending";

  return (
    <section className="max-w-2xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <div className="border border-dl-rule bg-dl-sheet p-stack-lg text-center mb-stack-lg">
        {isPaid && (
          <span className="inline-flex items-center justify-center w-12 h-12 border border-dl-ink text-dl-ink mb-stack-sm">
            <CheckIcon className="w-6 h-6" />
          </span>
        )}
        <h1
          className={`font-dl-sans text-dl-headline ${isPaymentFailed ? "text-dl-signal-ink" : "text-dl-ink"}`}
        >
          {isPaymentFailed
            ? "We could not complete this order"
            : isPaid
              ? "Order confirmed"
              : "Confirming your payment"}
        </h1>
        <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-xs">
          Order{" "}
          <span className="font-dl-mono text-dl-ink">{order.order_number}</span>
        </p>
        {isPaymentFailed && (
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-sm max-w-prose mx-auto">
            Your payment went through, but an item sold out before we could
            confirm it. Nothing was shipped. Contact us and we will sort out a
            refund.
          </p>
        )}
        {!isPaymentFailed && !isPaid && (
          <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-sm max-w-prose mx-auto">
            This can take a few seconds to finalise. Refresh if it does not
            update.
          </p>
        )}
        {isPaymentFailed && (
          <Link href="/contact" className={`mt-stack-md ${PRIMARY}`}>
            Contact support
          </Link>
        )}
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

      <Plate title="Shipping to">
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

      {!order.user_id && order.guest_email && (
        <div className="border border-dl-rule bg-dl-sheet p-stack-lg mb-stack-lg text-center">
          <p className="font-dl-sans text-dl-body text-dl-ink mb-stack-sm">
            Create an account to track this order and check out faster next
            time.
          </p>
          <Link
            href={`/signup?email=${encodeURIComponent(order.guest_email)}`}
            className={PRIMARY}
          >
            Create an account
          </Link>
        </div>
      )}

      <div className="text-center">
        <Link href="/shop" className={PRIMARY}>
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
