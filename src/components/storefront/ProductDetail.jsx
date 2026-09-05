"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronIcon } from "@/components/ui/icons";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export function ProductDetail({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const hasSizes = product.variants.some((v) => v.size);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    hasSizes ? null : (product.variants[0]?.size ?? null),
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    if (!hasSizes) return product.variants[0] ?? null;
    return product.variants.find((v) => v.size === selectedSize) ?? null;
  }, [hasSizes, product.variants, selectedSize]);

  const canAdd = selectedVariant && selectedVariant.stock_quantity > 0;
  const maxQuantity = selectedVariant?.stock_quantity ?? 1;

  function handleSelectSize(variant) {
    setSelectedSize(variant.size);
    setQuantity(1);
  }

  function handleAdd() {
    if (!canAdd) return;
    addItem({
      itemType: "product",
      variantId: selectedVariant.id,
      name: product.name,
      image: product.primaryImage,
      unitPrice: Number(selectedVariant.price_override ?? product.base_price),
      variantLabel: selectedVariant.size
        ? `Size ${selectedVariant.size}`
        : undefined,
      maxQuantity: selectedVariant.stock_quantity,
      quantity,
    });
  }

  function handleBuyNow() {
    handleAdd();
    openCart();
  }

  const images = product.images.length
    ? product.images
    : [{ url: null, position: 0 }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-xl mb-stack-xl">
      {/* Imagery */}
      <div className="flex flex-col space-y-stack-md">
        <div className="aspect-square bg-dl-sheet border border-dl-rule overflow-hidden relative">
          {images[selectedImage]?.url && (
            <Image
              src={images[selectedImage].url}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
              priority
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-stack-sm" aria-label="Product images">
            {images.map((img, i) => {
              const active = i === selectedImage;
              return (
                <button
                  key={img.url ?? i}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square bg-dl-sheet overflow-hidden cursor-pointer relative transition-colors ${FOCUS_RING} ${
                    active
                      ? "border-2 border-dl-ink"
                      : "border border-dl-rule opacity-70 hover:opacity-100 hover:border-dl-ink"
                  }`}
                >
                  {img.url && (
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h1 className="font-dl-sans text-dl-headline text-dl-ink">
          {product.name}
        </h1>
        <div className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink tabular-nums mt-2">
          {formatPrice(product.base_price)}
        </div>
        <p className="font-dl-sans text-dl-body text-dl-charcoal border-b border-dl-rule mt-4 pb-stack-md">
          {product.description}
        </p>

        {hasSizes && (
          <div className="mt-stack-lg">
            <span className="block font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-stack-sm">
              Size
            </span>
            <div className="flex flex-wrap gap-stack-sm" aria-label="Size">
              {product.variants.map((v) => {
                const outOfStock = v.stock_quantity <= 0;
                const active = v.size === selectedSize;
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-current={active ? "true" : undefined}
                    aria-label={`Size ${v.size}${outOfStock ? ", out of stock" : ""}`}
                    disabled={outOfStock}
                    onClick={() => handleSelectSize(v)}
                    className={`px-4 py-2 font-dl-mono text-dl-body transition-colors active:scale-[0.98] ${FOCUS_RING} ${
                      outOfStock
                        ? "border border-dl-rule text-dl-charcoal opacity-50 line-through cursor-not-allowed"
                        : active
                          ? "bg-dl-ink text-dl-chalk"
                          : "border border-dl-rule text-dl-ink hover:border-dl-ink"
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-stack-sm mt-stack-lg">
          <div className="flex space-x-stack-sm h-12">
            <div className="flex items-center border border-dl-rule w-32 bg-dl-chalk">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className={`px-3 h-full font-dl-sans text-lg text-dl-charcoal hover:text-dl-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-dl-charcoal ${FOCUS_RING}`}
              >
                −
              </button>
              <span className="flex-grow text-center font-dl-sans text-dl-body-lg text-dl-ink tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(maxQuantity, q + 1))
                }
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className={`px-3 h-full font-dl-sans text-lg text-dl-charcoal hover:text-dl-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-dl-charcoal ${FOCUS_RING}`}
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAdd}
              className={`flex-grow border border-dl-rule font-dl-sans text-dl-body-lg font-semibold text-dl-ink hover:border-dl-ink transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${FOCUS_RING}`}
            >
              Add to Cart
            </button>
          </div>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleBuyNow}
            className={`w-full h-12 bg-dl-ink text-dl-chalk font-dl-sans text-dl-body-lg font-semibold hover:opacity-90 transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${FOCUS_RING}`}
          >
            Buy Now
          </button>
        </div>

        <div className="flex flex-col space-y-stack-xs font-dl-sans text-dl-body border-b border-dl-rule mt-stack-lg pb-stack-md">
          {canAdd ? (
            <span className="text-dl-charcoal">In stock and ready to ship</span>
          ) : (
            <span className="text-dl-signal-ink">Out of stock</span>
          )}
          <span className="text-dl-charcoal">Ships in 2-3 business days</span>
        </div>

        <div className="divide-y divide-dl-rule">
          <details className="group py-4" open>
            <summary
              className={`flex justify-between items-center font-dl-sans text-dl-body-lg font-semibold text-dl-ink cursor-pointer list-none rounded-sm ${FOCUS_RING}`}
            >
              Description
              <ChevronIcon className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4 font-dl-sans text-dl-body text-dl-charcoal">
              {product.description}
            </div>
          </details>
          <details className="group py-4">
            <summary
              className={`flex justify-between items-center font-dl-sans text-dl-body-lg font-semibold text-dl-ink cursor-pointer list-none rounded-sm ${FOCUS_RING}`}
            >
              Shipping &amp; Returns
              <ChevronIcon className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4 font-dl-sans text-dl-body text-dl-charcoal">
              Free shipping on orders over ₹1,499. 7-day return policy for
              unworn/unused items with tags attached.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
