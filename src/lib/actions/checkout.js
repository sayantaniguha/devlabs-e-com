"use server";

import crypto from "node:crypto";
import { getCurrentProfile } from "@/lib/auth";
import { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { markPaymentCaptured } from "@/lib/payments";
import { getRazorpay } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/utils/orderNumber";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function createOrder(input) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { items, guestEmail, shipping } = parsed.data;

  const profile = await getCurrentProfile();
  if (!profile && !guestEmail) {
    return { error: "Enter an email address to check out as a guest." };
  }

  const supabase = createAdminClient();

  // Re-price and re-validate every line against the database — the client
  // is never trusted for price or stock.
  const priced = [];
  for (const item of items) {
    if (item.itemType === "product") {
      if (!item.variantId) return { error: "Missing product variant." };
      const { data: variant, error } = await supabase
        .from("product_variants")
        .select(
          "id, size, stock_quantity, price_override, product:products(id, name, status, base_price)",
        )
        .eq("id", item.variantId)
        .maybeSingle();
      if (error || !variant || variant.product?.status !== "active") {
        return {
          error: "One of the items in your cart is no longer available.",
        };
      }
      if (variant.stock_quantity < item.quantity) {
        return {
          error: `Only ${variant.stock_quantity} left of "${variant.product.name}"${variant.size ? ` (Size ${variant.size})` : ""}.`,
        };
      }
      priced.push({
        itemType: "product",
        variantId: variant.id,
        courseId: null,
        quantity: item.quantity,
        nameSnapshot: variant.product.name,
        variantLabelSnapshot: variant.size ? `Size ${variant.size}` : null,
        unitPrice: Number(variant.price_override ?? variant.product.base_price),
      });
    } else {
      if (!item.courseId) return { error: "Missing course." };
      const { data: course, error } = await supabase
        .from("courses")
        .select("id, title, status, price")
        .eq("id", item.courseId)
        .maybeSingle();
      if (error || !course || course.status !== "active") {
        return {
          error: "One of the courses in your cart is no longer available.",
        };
      }
      if (profile) {
        const { data: existingEnrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", profile.id)
          .eq("course_id", course.id)
          .maybeSingle();
        if (existingEnrollment) {
          return {
            error: `You already have access to "${course.title}" — check My Courses in your account.`,
          };
        }
      }
      priced.push({
        itemType: "course",
        variantId: null,
        courseId: course.id,
        quantity: 1,
        nameSnapshot: course.title,
        variantLabelSnapshot: null,
        unitPrice: Number(course.price),
      });
    }
  }

  const subtotal = priced.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingTotal =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shippingTotal;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: profile?.id ?? null,
      guest_email: profile ? null : guestEmail,
      order_number: generateOrderNumber(),
      status: "pending",
      subtotal,
      shipping_total: shippingTotal,
      total,
      shipping_name: shipping.fullName,
      shipping_phone: shipping.phone,
      shipping_line1: shipping.line1,
      shipping_line2: shipping.line2 || null,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_postal_code: shipping.postalCode,
      shipping_country: shipping.country,
    })
    .select("id, order_number, confirmation_token")
    .single();

  if (orderError) {
    return { error: "Could not create your order. Please try again." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    priced.map((i) => ({
      order_id: order.id,
      item_type: i.itemType,
      variant_id: i.variantId,
      course_id: i.courseId,
      name_snapshot: i.nameSnapshot,
      variant_label_snapshot: i.variantLabelSnapshot,
      unit_price_snapshot: i.unitPrice,
      quantity: i.quantity,
    })),
  );
  if (itemsError) {
    return { error: "Could not create your order. Please try again." };
  }

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: order.order_number,
      notes: { order_id: order.id },
    });
  } catch {
    return { error: "Could not start payment. Please try again." };
  }

  await supabase.from("payments").insert({
    order_id: order.id,
    gateway: "razorpay",
    gateway_order_id: razorpayOrder.id,
    status: "created",
    amount: total,
  });

  return {
    orderId: order.id,
    confirmationToken: order.confirmation_token,
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: total,
    customerName: shipping.fullName,
    customerEmail: profile?.email ?? guestEmail,
    customerPhone: shipping.phone,
  };
}

// Confirms payment from the checkout redirect itself, rather than waiting on
// the Razorpay webhook — webhooks can't reach localhost in dev, and even in
// production they can be delayed, so the client-side success handler is the
// primary confirmation path with the webhook as a durable backstop.
// markPaymentCaptured (shared with the webhook handler) is idempotent via
// confirm_paid_order, so running both is safe.
export async function confirmPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return { error: "Missing payment confirmation details." };
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  const provided = Buffer.from(razorpaySignature);
  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), provided)
  ) {
    return { error: "Payment verification failed." };
  }

  const supabase = createAdminClient();
  const result = await markPaymentCaptured(supabase, {
    gatewayOrderId: razorpayOrderId,
    gatewayPaymentId: razorpayPaymentId,
  });
  if (result.notFound) return { error: "Payment record not found." };
  if (result.error) return { error: "Order confirmation failed." };
  return { success: true };
}
