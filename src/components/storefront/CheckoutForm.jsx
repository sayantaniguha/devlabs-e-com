"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { confirmPayment, createOrder } from "@/lib/actions/checkout";
import { cartSubtotal, useCartStore } from "@/lib/cart-store";
import { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const LABEL =
  "font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide";
const INPUT =
  "px-4 py-2 border border-dl-rule bg-dl-chalk font-dl-sans text-dl-body text-dl-ink placeholder:text-dl-charcoal focus:border-dl-signal transition-colors";

// Razorpay renders its own modal, so it needs a literal hex rather than a
// token. This is --dl-ink, matching the site's primary button.
const RAZORPAY_THEME_COLOR = "#15181B";

export function CheckoutForm({ profile }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [razorpayReady, setRazorpayReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cartSubtotal(items);
  const shippingTotal =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shippingTotal;

  if (items.length === 0) {
    return (
      // Not an <h1>: the checkout page already carries one above this.
      <div className="max-w-md mx-auto w-full border border-dl-rule bg-dl-chalk px-stack-lg py-stack-xl text-center">
        <p className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
          Your cart is empty.
        </p>
        <p className="font-dl-sans text-dl-body text-dl-charcoal mt-2">
          Add a product or a course, then come back to check out.
        </p>
        <div className="flex flex-col sm:flex-row gap-stack-sm justify-center mt-stack-md">
          <Link
            href="/shop"
            className={`inline-block bg-dl-ink text-dl-chalk px-6 py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
          >
            Browse shop
          </Link>
          <Link
            href="/courses"
            className={`inline-block border border-dl-rule px-6 py-3 font-dl-sans text-dl-body font-semibold text-dl-ink hover:border-dl-ink active:scale-[0.98] transition ${FOCUS_RING}`}
          >
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!razorpayReady) {
      setError("Payment is still loading. Try again in a moment.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.target);
    const payload = {
      items: items.map((i) => ({
        itemType: i.itemType,
        variantId: i.variantId,
        courseId: i.courseId,
        quantity: i.quantity,
      })),
      guestEmail: form.get("guestEmail") || "",
      shipping: {
        fullName: form.get("fullName"),
        phone: form.get("phone"),
        line1: form.get("line1"),
        line2: form.get("line2") || "",
        city: form.get("city"),
        state: form.get("state"),
        postalCode: form.get("postalCode"),
        country: "IN",
      },
    };

    const result = await createOrder(payload);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: result.razorpayKeyId,
      order_id: result.razorpayOrderId,
      amount: Math.round(result.amount * 100),
      currency: "INR",
      name: "DevLabs",
      description: "Order payment",
      prefill: {
        name: result.customerName,
        email: result.customerEmail,
        contact: result.customerPhone,
      },
      theme: { color: RAZORPAY_THEME_COLOR },
      handler: async (response) => {
        await confirmPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        clearCart();
        router.push(
          `/checkout/success?order=${result.orderId}&token=${result.confirmationToken}`,
        );
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    });
    rzp.on("payment.failed", () => {
      setError("Payment failed. Please try again.");
      setSubmitting(false);
    });
    rzp.open();
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
          <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink border-b border-dl-rule pb-stack-sm">
            Shipping details
          </h2>

          {!profile && (
            <label className="flex flex-col gap-1">
              <span className={LABEL}>Email</span>
              <input
                type="email"
                name="guestEmail"
                autoComplete="email"
                required
                className={`${INPUT} ${FOCUS_RING}`}
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className={LABEL}>Full name</span>
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              required
              defaultValue={profile?.full_name ?? ""}
              className={`${INPUT} ${FOCUS_RING}`}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className={LABEL}>Phone</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              required
              className={`${INPUT} ${FOCUS_RING}`}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className={LABEL}>Address line 1</span>
            <input
              type="text"
              name="line1"
              autoComplete="address-line1"
              required
              className={`${INPUT} ${FOCUS_RING}`}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className={LABEL}>Address line 2 (optional)</span>
            <input
              type="text"
              name="line2"
              autoComplete="address-line2"
              className={`${INPUT} ${FOCUS_RING}`}
            />
          </label>

          <div className="grid grid-cols-2 gap-stack-sm">
            <label className="flex flex-col gap-1">
              <span className={LABEL}>City</span>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                required
                className={`${INPUT} ${FOCUS_RING}`}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={LABEL}>State</span>
              <input
                type="text"
                name="state"
                autoComplete="address-level1"
                required
                className={`${INPUT} ${FOCUS_RING}`}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className={LABEL}>Postal code</span>
            <input
              type="text"
              name="postalCode"
              autoComplete="postal-code"
              inputMode="numeric"
              required
              className={`${INPUT} ${FOCUS_RING} w-40`}
            />
          </label>

          {error && (
            <p
              role="alert"
              className="font-dl-sans text-dl-body text-dl-signal-ink"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full h-12 bg-dl-ink text-dl-chalk font-dl-sans text-dl-body-lg font-semibold tabular-nums hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 ${FOCUS_RING}`}
          >
            {submitting ? "Processing..." : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        <div className="border border-dl-rule bg-dl-chalk p-stack-lg h-fit">
          <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
            Order summary
          </h2>
          <div className="flex flex-col gap-stack-sm mb-stack-md">
            {items.map((item) => {
              const key =
                item.itemType === "course"
                  ? `course:${item.courseId}`
                  : `variant:${item.variantId}`;
              return (
                <div
                  key={key}
                  className="flex justify-between gap-stack-sm font-dl-sans text-dl-body"
                >
                  <span className="text-dl-charcoal">
                    {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""} ×{" "}
                    <span className="tabular-nums">{item.quantity}</span>
                  </span>
                  <span className="text-dl-ink tabular-nums whitespace-nowrap">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-dl-rule pt-stack-sm flex flex-col gap-1">
            <div className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal">
              <span>Shipping</span>
              <span className="tabular-nums">
                {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between font-dl-sans text-dl-body-lg font-semibold text-dl-ink pt-1">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
