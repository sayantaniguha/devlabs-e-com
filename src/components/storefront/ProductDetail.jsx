"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils/format";

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
        <div className="aspect-square bg-surface-container-low rounded-lg border border-outline-variant dark:border-outline overflow-hidden relative">
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
          <div className="grid grid-cols-4 gap-stack-sm">
            {images.map((img, i) => (
              <button
                key={img.url ?? i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`aspect-square bg-surface-container-low rounded overflow-hidden cursor-pointer relative ${
                  i === selectedImage
                    ? "border-2 border-secondary"
                    : "border border-outline-variant dark:border-outline opacity-70 hover:opacity-100 hover:border-secondary transition-colors"
                }`}
              >
                {img.url && (
                  <Image
                    src={img.url}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h1 className="font-headline-lg text-headline-lg md:text-[32px] text-primary dark:text-inverse-on-surface mb-stack-xs">
          {product.name}
        </h1>
        <div className="font-price-lg text-price-lg text-primary dark:text-inverse-on-surface mb-stack-md">
          {formatPrice(product.base_price)}
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container mb-stack-lg border-b border-outline-variant dark:border-outline pb-stack-md">
          {product.description}
        </p>

        {hasSizes && (
          <div className="mb-stack-lg">
            <div className="flex justify-between items-center mb-stack-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container">
                SIZE
              </span>
            </div>
            <div className="flex flex-wrap gap-stack-sm">
              {product.variants.map((v) => {
                const outOfStock = v.stock_quantity <= 0;
                const active = v.size === selectedSize;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => handleSelectSize(v)}
                    className={
                      outOfStock
                        ? "px-4 py-2 border border-outline-variant dark:border-outline rounded font-body-sm text-body-sm text-outline-variant opacity-50 cursor-not-allowed line-through"
                        : active
                          ? "px-4 py-2 bg-secondary text-on-secondary rounded font-body-sm text-body-sm font-medium transition-colors shadow-[0_4px_12px_rgba(79,70,229,0.2)]"
                          : "px-4 py-2 border border-outline-variant dark:border-outline rounded font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface hover:border-secondary transition-colors"
                    }
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-stack-sm mb-stack-lg">
          <div className="flex space-x-stack-sm h-12">
            <div className="flex items-center border border-outline-variant dark:border-outline rounded w-32 bg-surface dark:bg-inverse-surface">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-inverse-on-surface"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="flex-grow text-center font-body-lg text-body-lg text-primary dark:text-inverse-on-surface">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                className="px-3 text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-inverse-on-surface"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAdd}
              className="flex-grow border border-outline-variant dark:border-outline rounded font-body-lg text-body-lg font-medium text-primary dark:text-inverse-on-surface hover:border-primary dark:hover:border-inverse-on-surface transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>Add to Cart</span>
            </button>
          </div>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleBuyNow}
            className="w-full h-12 bg-secondary text-on-secondary rounded font-body-lg text-body-lg font-medium shadow-[0_4px_12px_rgba(79,70,229,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>

        <div className="flex flex-col space-y-stack-xs font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-lg border-b border-outline-variant dark:border-outline pb-stack-md">
          {canAdd ? (
            <div className="flex items-center space-x-2 text-[#059669]">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              <span>In stock and ready to ship</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-error">
              <span className="material-symbols-outlined text-sm">cancel</span>
              <span>Out of stock</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-sm">
              local_shipping
            </span>
            <span>Ships in 2-3 business days</span>
          </div>
        </div>

        <div className="border-t border-outline-variant dark:border-outline border-x-0 border-b-0 divide-y divide-outline-variant dark:divide-outline">
          <details className="group py-4" open>
            <summary className="flex justify-between items-center font-headline-md text-headline-md text-primary dark:text-inverse-on-surface cursor-pointer list-none">
              Description
              <span className="material-symbols-outlined transition group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="pt-4 font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              {product.description}
            </div>
          </details>
          <details className="group py-4">
            <summary className="flex justify-between items-center font-headline-md text-headline-md text-primary dark:text-inverse-on-surface cursor-pointer list-none">
              Shipping &amp; Returns
              <span className="material-symbols-outlined transition group-open:rotate-180">
                expand_more
              </span>
            </summary>
            <div className="pt-4 font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              Free shipping on orders over ₹1,499. 7-day return policy for
              unworn/unused items with tags attached.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
