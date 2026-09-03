"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { createOrder } from "@/lib/actions/checkout";
import { cartSubtotal, useCartStore } from "@/lib/cart-store";
import { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

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
      <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-md">
          Your cart is empty
        </h1>
        <a
          href="/shop"
          className="inline-block bg-secondary text-on-primary px-8 py-3 rounded font-semibold hover:bg-secondary-container transition-colors"
        >
          Continue shopping
        </a>
      </section>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!razorpayReady) {
      setError("Payment is still loading — try again in a moment.");
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
      theme: { color: "#4b41e1" },
      handler: () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface">
            Shipping details
          </h2>

          {!profile && (
            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
                Email
              </span>
              <input
                type="email"
                name="guestEmail"
                required
                className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
              Full name
            </span>
            <input
              type="text"
              name="fullName"
              required
              defaultValue={profile?.full_name ?? ""}
              className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
              Phone
            </span>
            <input
              type="tel"
              name="phone"
              required
              className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
              Address line 1
            </span>
            <input
              type="text"
              name="line1"
              required
              className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
              Address line 2 (optional)
            </span>
            <input
              type="text"
              name="line2"
              className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
            />
          </label>

          <div className="grid grid-cols-2 gap-stack-sm">
            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
                City
              </span>
              <input
                type="text"
                name="city"
                required
                className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
                State
              </span>
              <input
                type="text"
                name="state"
                required
                className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
              Postal code
            </span>
            <input
              type="text"
              name="postalCode"
              required
              className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface text-on-surface w-40"
            />
          </label>

          {error && (
            <p className="text-error text-body-sm font-body-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-secondary text-on-secondary rounded font-body-lg text-body-lg font-medium disabled:opacity-60"
          >
            {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        <div className="bg-surface-container-lowest border border-outline-variant dark:border-outline rounded-lg p-stack-lg h-fit">
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-md">
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
                  className="flex justify-between text-body-sm font-body-sm"
                >
                  <span className="text-on-surface-variant dark:text-on-primary-container">
                    {item.name}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""} ×{" "}
                    {item.quantity}
                  </span>
                  <span className="text-on-surface dark:text-inverse-on-surface">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-outline-variant dark:border-outline pt-stack-sm flex flex-col gap-1">
            <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
              <span>Shipping</span>
              <span>
                {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between font-price-lg text-price-lg text-on-background dark:text-inverse-on-surface font-bold pt-1">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
