"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { cartItemCount, cartSubtotal, useCartStore } from "@/lib/cart-store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const lastAddedKey = useCartStore((s) => s.lastAddedKey);
  const clearLastAdded = useCartStore((s) => s.clearLastAdded);

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // <dialog>.showModal() gives the drawer a native focus trap, Escape-to-close,
  // and focus restored to whatever triggered it on close — all for free.
  // Focus is moved to the close button explicitly (not via the `autoFocus`
  // prop): React's autoFocus and showModal()'s own attribute-scanning
  // fallback don't reliably compose across every path that can flip
  // isOpen — this is deterministic regardless.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Fires on Escape (native "cancel" → "close") and on dialog.close() —
    // keep the store in sync regardless of which path closed it.
    function handleClose() {
      closeCart();
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [closeCart]);

  // The highlight is a pulse, not a persistent state — clearing it lets the
  // colour transition fade back out on its own.
  useEffect(() => {
    if (!lastAddedKey) return;
    const id = setTimeout(clearLastAdded, 1200);
    return () => clearTimeout(id);
  }, [lastAddedKey, clearLastAdded]);

  const subtotal = cartSubtotal(items);
  const count = cartItemCount(items);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-drawer-heading"
      className="dl-motion fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-transparent border-0 open:flex justify-end backdrop:backdrop-blur-sm"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={closeCart}
      />

      <div className="dl-drawer-panel dl-motion-child relative w-full md:w-[480px] h-full bg-dl-chalk flex flex-col border-l border-dl-rule">
        <div className="h-16 border-b border-dl-rule flex items-center justify-between px-stack-lg shrink-0">
          <h2
            id="cart-drawer-heading"
            className="font-dl-sans text-dl-headline text-dl-ink"
          >
            Your Cart ({count})
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className={`p-2 -mr-2 text-dl-charcoal hover:text-dl-ink transition-colors ${FOCUS_RING}`}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-stack-lg flex flex-col gap-stack-lg no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-stack-sm text-dl-charcoal text-center">
              <p className="font-dl-sans text-dl-body">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className={`font-dl-sans text-dl-body text-dl-ink hover:underline underline-offset-4 ${FOCUS_RING}`}
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
                <div
                  key={key}
                  data-just-added={key === lastAddedKey ? "" : undefined}
                  className="dl-motion flex gap-stack-md -mx-2 px-2 py-2 -my-2 bg-transparent transition-colors duration-500 ease-out data-just-added:bg-dl-sheet"
                >
                  <div className="relative w-24 h-24 shrink-0 bg-dl-sheet border border-dl-rule overflow-hidden">
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
                      <h3 className="font-dl-sans text-dl-body text-dl-ink font-semibold line-clamp-2 pr-4">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        aria-label={`Remove ${item.name} from cart`}
                        className={`text-dl-charcoal hover:text-dl-signal-ink transition-colors p-1 -mr-1 -mt-1 ${FOCUS_RING}`}
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantLabel && (
                      <p className="font-dl-sans text-dl-spec text-dl-charcoal mt-1">
                        {item.variantLabel}
                      </p>
                    )}
                    <div className="flex justify-between items-end mt-auto">
                      {item.itemType === "course" ? (
                        <span className="font-dl-sans text-dl-spec text-dl-charcoal">
                          1 seat
                        </span>
                      ) : (
                        <div className="flex items-center border border-dl-rule h-8">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item, item.quantity - 1)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                            className={`w-8 h-full flex items-center justify-center font-dl-sans text-dl-charcoal hover:text-dl-ink transition-colors ${FOCUS_RING}`}
                          >
                            −
                          </button>
                          <span className="font-dl-sans text-dl-body text-dl-ink w-8 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item, item.quantity + 1)
                            }
                            disabled={
                              item.maxQuantity != null &&
                              item.quantity >= item.maxQuantity
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                            className={`w-8 h-full flex items-center justify-center font-dl-sans text-dl-charcoal hover:text-dl-ink transition-colors disabled:opacity-30 disabled:pointer-events-none ${FOCUS_RING}`}
                          >
                            +
                          </button>
                        </div>
                      )}
                      <span className="font-dl-sans text-dl-body font-semibold text-dl-ink tabular-nums">
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
          <div className="border-t border-dl-rule p-stack-lg bg-dl-chalk shrink-0">
            <div className="flex justify-between items-center mb-stack-sm">
              <span className="font-dl-sans text-dl-body text-dl-charcoal">
                Subtotal
              </span>
              <span className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <p className="font-dl-sans text-dl-body text-dl-charcoal mb-stack-md">
                Free shipping applied.
              </p>
            ) : (
              <p className="font-dl-sans text-dl-body text-dl-charcoal mb-stack-md">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                free shipping.
              </p>
            )}
            <p className="font-dl-sans text-dl-spec text-dl-charcoal mb-stack-lg">
              Taxes and shipping calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className={`w-full bg-dl-ink text-dl-chalk h-12 font-dl-sans text-dl-body-lg font-semibold flex items-center justify-center hover:opacity-90 transition active:scale-[0.98] ${FOCUS_RING}`}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </dialog>
  );
}
