import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getAdminOrders } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils/format";

const STATUS_FILTERS = [
  { value: undefined, label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export default async function AdminOrdersPage({ searchParams }) {
  const sp = await searchParams;
  const status = sp.status;
  const orders = await getAdminOrders({ status });

  return (
    <>
      <AdminTopbar title="Orders" subtitle="All customer orders." />
      <div className="p-margin-desktop space-y-stack-lg max-w-container-max mx-auto w-full">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const active = status === filter.value;
            const href = filter.value
              ? `/admin/orders?status=${filter.value}`
              : "/admin/orders";
            return (
              <Link
                key={filter.label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 font-dl-sans text-dl-body transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2 ${
                  active
                    ? "bg-dl-ink text-dl-chalk font-semibold"
                    : "border border-dl-rule text-dl-charcoal hover:border-dl-ink hover:text-dl-ink"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <div className="bg-dl-chalk border border-dl-rule overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dl-sheet border-b border-dl-rule font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide">
                  <th className="px-stack-lg py-3 font-semibold">Order #</th>
                  <th className="px-stack-lg py-3 font-semibold">Customer</th>
                  <th className="px-stack-lg py-3 font-semibold">Date</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Amount
                  </th>
                  <th className="px-stack-lg py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dl-rule font-dl-sans text-dl-body">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-dl-sheet/50 transition-colors"
                  >
                    <td className="px-stack-lg py-3 font-dl-mono text-dl-spec whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-dl-ink hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-stack-lg py-3 font-semibold text-dl-ink">
                      {order.profile?.full_name ?? order.guest_email ?? "Guest"}
                    </td>
                    <td className="px-stack-lg py-3 text-dl-charcoal tabular-nums whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-stack-lg py-3 font-semibold text-dl-ink text-right tabular-nums">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-stack-lg py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-stack-lg py-8 text-center text-dl-charcoal"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
