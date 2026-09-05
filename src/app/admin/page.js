import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StockStatusBadge } from "@/components/admin/StockStatusBadge";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getDashboardStats } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils/format";

function ChangeBadge({ percent }) {
  const positive = percent >= 0;
  return (
    <span
      className={`font-dl-mono text-dl-spec tabular-nums ${positive ? "text-dl-success" : "text-dl-warning"}`}
    >
      {positive ? "+" : ""}
      {percent.toFixed(1)}%
    </span>
  );
}

function formatOrderDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const maxRevenue = Math.max(...stats.revenueLast7Days.map((d) => d.total), 1);

  return (
    <>
      <AdminTopbar
        title="Dashboard Overview"
        subtitle="Performance metrics and recent activity."
      />
      <div className="p-margin-desktop space-y-stack-xl max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
            <p className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-1">
              Total Sales
            </p>
            <p className="font-dl-sans text-dl-headline font-bold text-dl-ink tabular-nums mb-3">
              {formatPrice(stats.totalSalesThisMonth)}
            </p>
            <div className="flex items-center gap-2">
              <ChangeBadge percent={stats.salesChangePercent} />
              <span className="font-dl-sans text-dl-spec text-dl-charcoal">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
            <p className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-1">
              Active Orders
            </p>
            <p className="font-dl-sans text-dl-headline font-bold text-dl-ink tabular-nums mb-3">
              {stats.activeOrdersCount.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-2">
              <ChangeBadge percent={stats.activeOrdersChangePercent} />
              <span className="font-dl-sans text-dl-spec text-dl-charcoal">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
            <p className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-1">
              New Customers
            </p>
            <p className="font-dl-sans text-dl-headline font-bold text-dl-ink tabular-nums mb-3">
              {stats.newCustomersThisMonth.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-2">
              <ChangeBadge percent={stats.customersChangePercent} />
              <span className="font-dl-sans text-dl-spec text-dl-charcoal">
                vs last month
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 bg-dl-chalk border border-dl-rule p-stack-lg flex flex-col">
            <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-lg">
              Revenue Overview
            </h2>
            <div className="flex-1 flex justify-between gap-2 h-48 pb-4">
              {stats.revenueLast7Days.map((day, i) => {
                const isLast = i === stats.revenueLast7Days.length - 1;
                const heightPercent = Math.max(
                  (day.total / maxRevenue) * 100,
                  2,
                );
                return (
                  <div
                    key={`${day.label}-${i}`}
                    className="w-full h-full flex flex-col justify-end items-center gap-2"
                    title={formatPrice(day.total)}
                  >
                    <div
                      className={isLast ? "w-8 md:w-12 bg-dl-ink" : "w-8 md:w-12 bg-dl-rule"}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span
                      className={`font-dl-mono text-dl-spec ${isLast ? "font-semibold text-dl-ink" : "text-dl-charcoal"}`}
                    >
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
            <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
              Inventory Status
            </h2>
            <ul className="divide-y divide-dl-rule">
              {stats.inventoryStatus.map((p) => (
                <li
                  key={p.id}
                  className="py-3 flex justify-between items-center gap-2"
                >
                  <div>
                    <p className="font-dl-sans text-dl-body font-semibold text-dl-ink">
                      {p.name}
                    </p>
                    <p className="font-dl-mono text-dl-spec text-dl-charcoal tabular-nums">
                      {p.totalStock} units
                    </p>
                  </div>
                  <StockStatusBadge totalStock={p.totalStock} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-dl-chalk border border-dl-rule overflow-hidden">
          <div className="px-stack-lg py-stack-md border-b border-dl-rule">
            <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
              Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dl-sheet border-b border-dl-rule font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide">
                  <th className="px-stack-lg py-3 font-semibold">Order #</th>
                  <th className="px-stack-lg py-3 font-semibold">Customer</th>
                  <th className="px-stack-lg py-3 font-semibold">Product</th>
                  <th className="px-stack-lg py-3 font-semibold">Date</th>
                  <th className="px-stack-lg py-3 font-semibold text-right">
                    Amount
                  </th>
                  <th className="px-stack-lg py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dl-rule font-dl-sans text-dl-body">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-dl-sheet/50 transition-colors">
                    <td className="px-stack-lg py-3 font-dl-mono text-dl-spec whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-dl-ink hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-stack-lg py-3 font-semibold text-dl-ink">
                      {order.customerName}
                    </td>
                    <td className="px-stack-lg py-3 text-dl-charcoal">
                      {order.productLabel}
                    </td>
                    <td className="px-stack-lg py-3 text-dl-charcoal tabular-nums whitespace-nowrap">
                      {formatOrderDate(order.created_at)}
                    </td>
                    <td className="px-stack-lg py-3 font-semibold text-dl-ink text-right tabular-nums">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-stack-lg py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-stack-lg py-8 text-center text-dl-charcoal"
                    >
                      No orders yet.
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
