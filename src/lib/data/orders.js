import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Guests have no session to own an order under RLS, so order-confirmation
// access is via a capability URL (order id + its random confirmation_token)
// rather than an "owner" query — verified here with the admin client.
export async function getOrderForConfirmation(orderId, token) {
  if (!orderId || !token) return null;

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal, shipping_total, total, created_at, confirmation_token, shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, items:order_items(id, name_snapshot, variant_label_snapshot, unit_price_snapshot, quantity)",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order || order.confirmation_token !== token) return null;
  return order;
}
