const STYLES = {
  delivered: "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant",
  shipped: "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant",
  paid: "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant",
  processing: "bg-amber-100 text-amber-800",
  pending: "bg-surface-variant text-on-surface-variant",
  cancelled: "bg-error-container/50 text-on-error-container",
  refunded: "bg-error-container/50 text-on-error-container",
};

export function OrderStatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded inline-block ${STYLES[status] ?? "bg-surface-variant text-on-surface-variant"}`}
    >
      {status}
    </span>
  );
}
