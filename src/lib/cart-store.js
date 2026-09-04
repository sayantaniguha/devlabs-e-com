import { create } from "zustand";
import { persist } from "zustand/middleware";

function lineKey({ itemType, variantId, courseId }) {
  return itemType === "course" ? `course:${courseId}` : `variant:${variantId}`;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const key = lineKey(item);
        const existing = get().items.find((i) => lineKey(i) === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i) === key
                ? {
                    ...i,
                    ...item,
                    quantity: i.quantity + (item.quantity ?? 1),
                  }
                : i,
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: item.quantity ?? 1 }],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (item) => {
        const key = lineKey(item);
        set({ items: get().items.filter((i) => lineKey(i) !== key) });
      },

      setQuantity: (item, quantity) => {
        const key = lineKey(item);
        if (quantity < 1) {
          get().removeItem(item);
          return;
        }
        set({
          items: get().items.map((i) =>
            lineKey(i) === key ? { ...i, quantity } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "devlabs-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartItemCount(items) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items) {
  return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
}
