import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { getAdminOrderById } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <>
      <AdminTopbar
        title={`Order ${order.order_number}`}
        subtitle={`Placed ${new Date(order.created_at).toLocaleString("en-IN")}`}
      />
      <div className="p-margin-desktop space-y-stack-lg max-w-3xl mx-auto w-full">
        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              Current status:
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <OrderStatusForm orderId={order.id} status={order.status} />
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-md">
            Customer
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
            {order.profile?.full_name ?? order.shipping_name}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
            {order.profile?.email ?? order.guest_email}
          </p>
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-md">
            Shipping Address
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
            {order.shipping_name}
            <br />
            {order.shipping_phone}
            <br />
            {order.shipping_line1}
            {order.shipping_line2 && <>, {order.shipping_line2}</>}
            <br />
            {order.shipping_city}, {order.shipping_state}{" "}
            {order.shipping_postal_code}
          </p>
        </div>

        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-md">
            Items
          </h2>
          <div className="flex flex-col gap-stack-sm mb-stack-md">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-body-sm font-body-sm"
              >
                <span className="text-on-surface-variant dark:text-on-primary-container">
                  {item.name_snapshot}
                  {item.variant_label_snapshot
                    ? ` (${item.variant_label_snapshot})`
                    : ""}{" "}
                  × {item.quantity}
                </span>
                <span className="text-on-surface dark:text-inverse-on-surface">
                  {formatPrice(item.unit_price_snapshot * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-outline-variant dark:border-outline pt-stack-sm flex flex-col gap-1">
            <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container">
              <span>Shipping</span>
              <span>
                {order.shipping_total === 0
                  ? "Free"
                  : formatPrice(order.shipping_total)}
              </span>
            </div>
            <div className="flex justify-between font-price-lg text-price-lg text-on-background dark:text-inverse-on-surface font-bold pt-1">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {order.payments?.length > 0 && (
          <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg shadow-sm p-stack-lg">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-inverse-on-surface mb-stack-md">
              Payments
            </h2>
            <div className="space-y-2">
              {order.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between text-body-sm font-body-sm text-on-surface-variant dark:text-on-primary-container"
                >
                  <span>
                    {payment.gateway} ·{" "}
                    {payment.gateway_payment_id ?? payment.gateway_order_id}
                  </span>
                  <span className="capitalize">{payment.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
