// Semantic mapping: success = money secured / fulfilled without issue;
// warning = actively being worked, worth watching so it doesn't stall;
// danger (reuses the storefront's dl-signal-ink) = needs attention;
// neutral = just waiting, nothing to flag yet.
const TONE = {
  paid: "success",
  shipped: "success",
  delivered: "success",
  processing: "warning",
  pending: "neutral",
  cancelled: "danger",
  refunded: "danger",
  payment_failed: "danger",
};

const TONE_CLASSES = {
  success: "border-dl-success text-dl-success",
  warning: "border-dl-warning text-dl-warning",
  danger: "border-dl-signal-ink text-dl-signal-ink",
  neutral: "border-dl-rule text-dl-charcoal",
};

const LABELS = {
  payment_failed: "Payment Failed",
};

export function OrderStatusBadge({ status }) {
  const tone = TONE[status] ?? "neutral";
  return (
    <span
      className={`px-2 py-0.5 border font-dl-mono text-dl-spec uppercase tracking-wide whitespace-nowrap inline-block ${TONE_CLASSES[tone]}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
