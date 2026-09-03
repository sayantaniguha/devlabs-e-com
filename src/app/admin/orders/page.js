import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
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
                className={`px-3 py-1.5 rounded-full text-body-sm font-body-sm transition-colors ${
                  active
                    ? "bg-secondary text-on-secondary font-semibold"
                    : "bg-surface-container-low dark:bg-primary-container text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-high"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-primary-container border-b border-outline-variant/50 dark:border-outline/50 font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider">
                  <th className="px-stack-lg py-3 font-semibold">Order #</th>
                  <th className="px-stack-lg py-3 font-semibold">Customer</th>
                  <th className="px-stack-lg py-3 font-semibold">Date</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Amount
                  </th>
                  <th className="px-stack-lg py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 dark:divide-outline/30 font-body-sm text-body-sm">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/50 dark:hover:bg-primary-container/50 transition-colors"
                  >
                    <td className="px-stack-lg py-4 font-price-sm text-price-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-secondary"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-stack-lg py-4 font-semibold text-on-surface dark:text-inverse-on-surface">
                      {order.profile?.full_name ?? order.guest_email ?? "Guest"}
                    </td>
                    <td className="px-stack-lg py-4 text-on-surface-variant dark:text-on-primary-container">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-stack-lg py-4 font-price-sm text-price-sm text-right">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-stack-lg py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-stack-lg py-8 text-center text-on-surface-variant dark:text-on-primary-container"
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
