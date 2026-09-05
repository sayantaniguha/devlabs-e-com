import Image from "next/image";
import Link from "next/link";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

export function ProductCard({ product, priority = false }) {
  const soldOut = product.totalStock <= 0;
  const lowStock = !soldOut && product.totalStock <= LOW_STOCK_THRESHOLD;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group flex flex-col bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-lg overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${soldOut ? "pointer-events-none" : "cursor-pointer"}`}
    >
      {soldOut && (
        <>
          <span className="absolute inset-0 bg-surface/20 z-20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <span className="bg-surface border border-outline-variant px-3 py-1 rounded text-label-caps font-label-caps uppercase tracking-wide text-on-surface font-bold shadow-sm">
              Sold Out
            </span>
          </div>
        </>
      )}
      {lowStock && (
        <span className="absolute top-3 left-3 z-10 bg-error/10 text-error px-2 py-1 rounded text-label-caps font-label-caps uppercase tracking-wide">
          Low stock
        </span>
      )}

      <div
        className={`aspect-square bg-surface-variant relative overflow-hidden flex items-center justify-center p-4 ${soldOut ? "opacity-60 grayscale" : ""}`}
      >
        {product.primaryImage && (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-label-caps font-label-caps text-on-surface-variant dark:text-on-primary-container mb-1 uppercase">
          {product.category?.name}
        </span>
        <h3 className="text-body-lg font-body-lg font-medium text-on-background dark:text-inverse-on-surface mb-2">
          {product.name}
        </h3>
        <div className="mt-auto">
          <span className="text-price-lg font-price-lg text-on-background dark:text-inverse-on-surface">
            {formatPrice(product.base_price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
