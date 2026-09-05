import { create } from "zustand";

// Deliberately tiny: mount <Toaster /> once, call toast() from anywhere.
// No provider, no context, no hook needed at the call site.
let nextId = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  push: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: ++nextId, message }],
    })),
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message) {
  useToastStore.getState().push(message);
}
