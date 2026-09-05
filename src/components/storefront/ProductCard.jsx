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
      className={`group flex flex-col bg-dl-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2 ${soldOut ? "pointer-events-none" : "cursor-pointer"}`}
    >
      <div className="aspect-square bg-dl-sheet relative overflow-hidden flex items-center justify-center p-4">
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
      <div className="pt-4 flex flex-col flex-grow border-t border-dl-rule">
        <span className="font-dl-sans text-dl-spec text-dl-charcoal uppercase">
          {product.category?.name}
        </span>
        <h3 className="font-dl-sans text-dl-body text-dl-ink mt-1">
          {product.name}
        </h3>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          {soldOut ? (
            <span className="font-dl-mono text-dl-spec text-dl-charcoal uppercase tracking-wide border border-dl-charcoal px-2 py-0.5">
              Sold out
            </span>
          ) : (
            <span className="font-dl-sans text-dl-body font-semibold text-dl-ink tabular-nums">
              {formatPrice(product.base_price)}
            </span>
          )}
          {lowStock && (
            <span className="font-dl-mono text-dl-spec text-dl-signal-ink tabular-nums border border-dl-signal-ink px-2 py-0.5">
              {product.totalStock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
