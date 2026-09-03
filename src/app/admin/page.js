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
      className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
        positive
          ? "text-on-tertiary-container bg-tertiary-fixed-dim/20"
          : "text-on-error-container bg-error-container/50"
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">
        {positive ? "trending_up" : "trending_down"}
      </span>
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
          <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider mb-1">
                  Total Sales
                </p>
                <p className="font-price-lg text-price-lg font-bold text-on-surface dark:text-inverse-on-surface">
                  {formatPrice(stats.totalSalesThisMonth)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChangeBadge percent={stats.salesChangePercent} />
              <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container text-xs">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider mb-1">
                  Active Orders
                </p>
                <p className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">
                  {stats.activeOrdersCount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChangeBadge percent={stats.activeOrdersChangePercent} />
              <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container text-xs">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider mb-1">
                  New Customers
                </p>
                <p className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">
                  {stats.newCustomersThisMonth.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">group</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChangeBadge percent={stats.customersChangePercent} />
              <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container text-xs">
                vs last month
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg shadow-sm flex flex-col">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-lg tracking-tight">
              Revenue Overview
            </h2>
            <div className="flex-1 flex items-end justify-between gap-2 h-48 pb-4">
              {stats.revenueLast7Days.map((day, i) => {
                const isLast = i === stats.revenueLast7Days.length - 1;
                const heightPercent = Math.max(
                  (day.total / maxRevenue) * 100,
                  2,
                );
                return (
                  <div
                    key={`${day.label}-${i}`}
                    className="w-full flex flex-col items-center gap-2"
                    title={formatPrice(day.total)}
                  >
                    <div
                      className={`w-8 md:w-12 rounded-t-sm ${isLast ? "bg-secondary" : "bg-secondary-fixed/50"}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span
                      className={`font-label-caps text-label-caps ${isLast ? "font-bold text-on-surface dark:text-inverse-on-surface" : "text-on-surface-variant dark:text-on-primary-container"}`}
                    >
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg p-stack-lg shadow-sm">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-md tracking-tight">
              Inventory Status
            </h2>
            <ul className="divide-y divide-outline-variant/30 dark:divide-outline/30">
              {stats.inventoryStatus.map((p) => (
                <li
                  key={p.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-body-sm text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                      {p.name}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container text-xs">
                      {p.totalStock} units
                    </p>
                  </div>
                  <StockStatusBadge totalStock={p.totalStock} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm overflow-hidden">
          <div className="px-stack-lg py-stack-md border-b border-outline-variant/50 dark:border-outline/50">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface tracking-tight">
              Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low dark:bg-primary-container border-b border-outline-variant/50 dark:border-outline/50 font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase tracking-wider">
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
              <tbody className="divide-y divide-outline-variant/30 dark:divide-outline/30 font-body-sm text-body-sm">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-stack-lg py-4 font-price-sm text-price-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-secondary"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-stack-lg py-4 font-semibold text-on-surface dark:text-inverse-on-surface">
                      {order.customerName}
                    </td>
                    <td className="px-stack-lg py-4 text-on-surface-variant dark:text-on-primary-container">
                      {order.productLabel}
                    </td>
                    <td className="px-stack-lg py-4 text-on-surface-variant dark:text-on-primary-container">
                      {formatOrderDate(order.created_at)}
                    </td>
                    <td className="px-stack-lg py-4 font-price-sm text-price-sm text-right">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-stack-lg py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-stack-lg py-8 text-center text-on-surface-variant dark:text-on-primary-container"
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
