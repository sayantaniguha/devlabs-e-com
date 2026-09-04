import "server-only";
import { revalidateTag } from "next/cache";

// Shared by the Razorpay webhook (src/app/api/webhooks/razorpay/route.js) and
// the client-redirect confirmation path (confirmPayment in
// lib/actions/checkout.js) — each verifies its own signature before calling
// this, then this applies the actual state change. confirm_paid_order is
// idempotent, so both paths calling it is safe and intentional: the webhook
// is the durable source of truth, the client path confirms immediately
// without waiting on webhook delivery (which can't even reach localhost in
// dev, and can lag in production).
export async function markPaymentCaptured(
  supabase,
  { gatewayOrderId, gatewayPaymentId, rawPayload },
) {
  const { data: paymentRow } = await supabase
    .from("payments")
    .select("id, order_id")
    .eq("gateway_order_id", gatewayOrderId)
    .maybeSingle();

  if (!paymentRow) return { notFound: true };

  await supabase
    .from("payments")
    .update({
      status: "captured",
      gateway_payment_id: gatewayPaymentId,
      ...(rawPayload ? { raw_payload: rawPayload } : {}),
    })
    .eq("id", paymentRow.id);

  const { error } = await supabase.rpc("confirm_paid_order", {
    p_order_id: paymentRow.order_id,
  });
  if (error) {
    // The customer's payment was captured by Razorpay, but we couldn't
    // fulfill it (most likely: lost a stock race after paying). Flag the
    // order distinctly rather than leaving it "pending" forever with no way
    // to tell it apart from an order that's simply still awaiting payment —
    // this needs a human to review and refund. Guarded to only fire from
    // 'pending' so a concurrent successful confirmation (e.g. the webhook
    // beating this call, or vice versa) can never be clobbered back down.
    await supabase
      .from("orders")
      .update({ status: "payment_failed" })
      .eq("id", paymentRow.order_id)
      .eq("status", "pending");
    return { error };
  }

  // confirm_paid_order decrements product_variants.stock_quantity, which the
  // cached product listing/detail reads embed — without this, a purchase
  // wouldn't be reflected in stock counts shown to other shoppers until an
  // unrelated admin edit happened to revalidate the same tag.
  revalidateTag("products");
  return { success: true };
}
