import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

export function StockStatusBadge({ totalStock }) {
  if (totalStock <= 0) {
    return (
      <span className="px-2 py-1 bg-error-container/50 text-on-error-container dark:bg-error/20 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider rounded">
        Out of Stock
      </span>
    );
  }
  if (totalStock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded">
        Low Stock
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant dark:text-tertiary-fixed text-[10px] font-bold uppercase tracking-wider rounded">
      In Stock
    </span>
  );
}
