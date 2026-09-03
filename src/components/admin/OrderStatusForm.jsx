"use client";

import { useActionState } from "react";
import { updateOrderStatus } from "@/lib/actions/admin/orders";

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export function OrderStatusForm({ orderId, status }) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, null);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        className="rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-primary-container text-on-surface dark:text-inverse-on-surface py-2 px-3 text-body-sm capitalize"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="bg-secondary text-on-secondary font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update Status"}
      </button>
      {state?.error && <p className="text-error text-xs">{state.error}</p>}
      {state?.success && (
        <p className="text-on-tertiary-container text-xs">Updated</p>
      )}
    </form>
  );
}
