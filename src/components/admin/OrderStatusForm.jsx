"use client";

import { useActionState } from "react";
import { updateOrderStatus } from "@/lib/actions/admin/orders";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
  { value: "payment_failed", label: "Payment Failed" },
];

export function OrderStatusForm({ orderId, status }) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, null);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        className="border border-dl-rule bg-dl-chalk text-dl-ink py-2 px-3 font-dl-sans text-dl-body"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="bg-dl-ink text-dl-chalk font-semibold py-2 px-4 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update Status"}
      </button>
      {state?.error && (
        <p className="text-dl-signal-ink text-xs">{state.error}</p>
      )}
      {state?.success && <p className="text-dl-ink text-xs">Updated</p>}
    </form>
  );
}
