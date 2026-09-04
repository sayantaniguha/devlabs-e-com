"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { orderStatusSchema } from "@/lib/validations/admin";

const RESTOCKING_STATUSES = ["cancelled", "refunded"];

export async function updateOrderStatus(_prevState, formData) {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = createAdminClient();

  // Cancelling/refunding a paid order needs to give back the stock it
  // decremented and revoke any course access it granted — a plain status
  // update would silently leave both in place. restock_cancelled_order is a
  // no-op beyond the status write for orders that never reached "paid".
  if (RESTOCKING_STATUSES.includes(parsed.data.status)) {
    const { error } = await supabase.rpc("restock_cancelled_order", {
      p_order_id: parsed.data.orderId,
      p_new_status: parsed.data.status,
    });
    if (error) return { error: "Could not update order status." };
    revalidateTag("products");
  } else {
    const { error } = await supabase
      .from("orders")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.orderId);
    if (error) return { error: "Could not update order status." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
  return { success: true };
}
