import crypto from "node:crypto";
import { markPaymentCaptured } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";

function verifySignature(rawBody, signature) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return (
    signature?.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifySignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const supabase = createAdminClient();

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    // Atomic: checks stock, decrements it, marks the order paid, and
    // enrolls any course items — a no-op if already paid, so a retried
    // webhook delivery (or the client-redirect confirmation path already
    // having handled it) can never double-decrement stock.
    const result = await markPaymentCaptured(supabase, {
      gatewayOrderId: payment.order_id,
      gatewayPaymentId: payment.id,
      rawPayload: payment,
    });
    if (result.error) {
      console.error("confirm_paid_order failed:", result.error);
      return Response.json(
        { error: "Order confirmation failed" },
        { status: 500 },
      );
    }
  } else if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    await supabase
      .from("payments")
      .update({ status: "failed", raw_payload: payment })
      .eq("gateway_order_id", payment.order_id);
  }

  return Response.json({ received: true });
}
