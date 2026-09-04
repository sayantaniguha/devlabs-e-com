const STYLES = {
  delivered: "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant dark:text-tertiary-fixed",
  shipped: "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant dark:text-tertiary-fixed",
  paid: "bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant dark:text-tertiary-fixed",
  processing: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  pending: "bg-surface-variant text-on-surface-variant dark:bg-inverse-surface dark:text-inverse-on-surface",
  cancelled: "bg-error-container/50 text-on-error-container dark:bg-error/20 dark:text-red-300",
  refunded: "bg-error-container/50 text-on-error-container dark:bg-error/20 dark:text-red-300",
  payment_failed: "bg-error-container/50 text-on-error-container dark:bg-error/20 dark:text-red-300",
};

const LABELS = {
  payment_failed: "Payment Failed",
};

export function OrderStatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded inline-block ${STYLES[status] ?? "bg-surface-variant text-on-surface-variant dark:bg-inverse-surface dark:text-inverse-on-surface"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
