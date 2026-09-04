"use client";

import Image from "next/image";
import Link from "next/link";
import { cartItemCount, cartSubtotal, useCartStore } from "@/lib/cart-store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!isOpen) return null;

  const subtotal = cartSubtotal(items);
  const count = cartItemCount(items);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-primary/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="relative w-full md:w-[480px] bg-surface dark:bg-primary-container shadow-2xl flex flex-col border-l border-outline-variant dark:border-outline">
        <div className="h-16 border-b border-outline-variant dark:border-outline flex items-center justify-between px-stack-lg shrink-0">
          <h2 className="font-headline-md text-headline-md text-primary dark:text-inverse-on-surface">
            Your Cart ({count})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 -mr-2 text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-inverse-on-surface transition-colors rounded hover:bg-surface-container dark:hover:bg-inverse-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-stack-lg flex flex-col gap-stack-lg no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-stack-sm text-on-surface-variant dark:text-on-primary-container">
              <span className="material-symbols-outlined text-[40px]">
                shopping_cart
              </span>
              <p className="font-body-sm text-body-sm">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="font-body-sm text-body-sm text-secondary hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const key =
                item.itemType === "course"
                  ? `course:${item.courseId}`
                  : `variant:${item.variantId}`;
              return (
                <div key={key} className="flex gap-stack-md">
                  <div className="relative w-24 h-24 shrink-0 rounded border border-outline-variant bg-surface-container-low dark:bg-inverse-surface overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-body-lg text-body-lg text-primary dark:text-inverse-on-surface font-medium line-clamp-2 pr-4">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        aria-label="Remove item"
                        className="text-on-surface-variant dark:text-on-primary-container hover:text-error transition-colors p-1 -mr-1 -mt-1"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          close
                        </span>
                      </button>
                    </div>
                    {item.variantLabel && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mt-1">
                        {item.variantLabel}
                      </p>
                    )}
                    <div className="flex justify-between items-end mt-auto">
                      {item.itemType === "course" ? (
                        <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                          1 seat
                        </span>
                      ) : (
                        <div className="flex items-center border border-outline-variant rounded h-8">
                          <button
                            type="button"
                            onClick={() => setQuantity(item, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-inverse-on-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              remove
                            </span>
                          </button>
                          <span className="font-body-sm text-body-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item, item.quantity + 1)}
                            disabled={
                              item.maxQuantity != null &&
                              item.quantity >= item.maxQuantity
                            }
                            className="w-8 h-full flex items-center justify-center text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-inverse-on-surface transition-colors disabled:opacity-40 disabled:pointer-events-none"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              add
                            </span>
                          </button>
                        </div>
                      )}
                      <span className="font-price-sm text-price-sm text-primary dark:text-inverse-on-surface">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-outline-variant dark:border-outline p-stack-lg bg-surface-container-lowest dark:bg-inverse-surface shrink-0">
            <div className="flex justify-between items-center mb-stack-sm">
              <span className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container">
                Subtotal
              </span>
              <span className="font-price-lg text-price-lg text-primary dark:text-inverse-on-surface font-bold">
                {formatPrice(subtotal)}
              </span>
            </div>
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <div className="flex items-center gap-2 text-on-tertiary-container bg-tertiary-fixed-dim/20 px-3 py-2 rounded mb-stack-md">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                <span className="font-body-sm text-body-sm font-medium">
                  Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}{" "}
                  applied
                </span>
              </div>
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-md">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                free shipping.
              </p>
            )}
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-lg">
              Taxes and shipping calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-secondary text-on-secondary h-12 rounded-lg font-headline-md text-headline-md md:text-[16px] flex items-center justify-center hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
