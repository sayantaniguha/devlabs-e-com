import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Guests have no session to own an order under RLS, so order-confirmation
// access is via a capability URL (order id + its random confirmation_token)
// rather than an "owner" query — verified here with the admin client.
export async function getOrderForConfirmation(orderId, token) {
  if (!orderId || !token) return null;

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal, shipping_total, total, created_at, confirmation_token, user_id, guest_email, shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, items:order_items(id, name_snapshot, variant_label_snapshot, unit_price_snapshot, quantity)",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order || order.confirmation_token !== token) return null;
  return order;
}

// RLS ("orders_select_own") scopes these to the caller's own rows — no
// admin client or manual ownership check needed.
export async function getMyOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getMyOrderById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal, shipping_total, total, created_at, shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, items:order_items(id, name_snapshot, variant_label_snapshot, unit_price_snapshot, quantity)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
