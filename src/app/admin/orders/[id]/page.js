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
        <div className="bg-dl-chalk border border-dl-rule p-stack-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-dl-sans text-dl-body text-dl-charcoal">
              Current status:
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <OrderStatusForm orderId={order.id} status={order.status} />
        </div>

        <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
          <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
            Customer
          </h2>
          <p className="font-dl-sans text-dl-body text-dl-ink">
            {order.profile?.full_name ?? order.shipping_name}
          </p>
          <p className="font-dl-sans text-dl-body text-dl-charcoal">
            {order.profile?.email ?? order.guest_email}
          </p>
        </div>

        <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
          <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
            Shipping Address
          </h2>
          <p className="font-dl-sans text-dl-body text-dl-charcoal">
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

        <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
          <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
            Items
          </h2>
          <div className="flex flex-col gap-stack-sm mb-stack-md">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between font-dl-sans text-dl-body"
              >
                <span className="text-dl-charcoal">
                  {item.name_snapshot}
                  {item.variant_label_snapshot
                    ? ` (${item.variant_label_snapshot})`
                    : ""}{" "}
                  × {item.quantity}
                </span>
                <span className="text-dl-ink">
                  {formatPrice(item.unit_price_snapshot * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-dl-rule pt-stack-sm flex flex-col gap-1">
            <div className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal">
              <span>Shipping</span>
              <span>
                {order.shipping_total === 0
                  ? "Free"
                  : formatPrice(order.shipping_total)}
              </span>
            </div>
            <div className="flex justify-between font-dl-sans text-dl-body-lg tabular-nums text-dl-ink font-bold pt-1">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {order.payments?.length > 0 && (
          <div className="bg-dl-chalk border border-dl-rule p-stack-lg">
            <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
              Payments
            </h2>
            <div className="space-y-2">
              {order.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between font-dl-sans text-dl-body text-dl-charcoal"
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
