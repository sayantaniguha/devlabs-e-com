import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

const TAG =
  "px-2 py-0.5 border font-dl-mono text-dl-spec uppercase tracking-wide whitespace-nowrap";

export function StockStatusBadge({ totalStock }) {
  if (totalStock <= 0) {
    return (
      <span className={`${TAG} border-dl-signal-ink text-dl-signal-ink`}>
        Out of Stock
      </span>
    );
  }
  if (totalStock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className={`${TAG} border-dl-warning text-dl-warning`}>
        Low Stock
      </span>
    );
  }
  return (
    <span className={`${TAG} border-dl-success text-dl-success`}>
      In Stock
    </span>
  );
}
