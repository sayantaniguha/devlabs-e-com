"use client";

import { useActionState, useEffect } from "react";

export function CategoryForm({ action, category, onSuccess }) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex items-center gap-2">
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      <input
        type="text"
        name="name"
        defaultValue={category?.name ?? ""}
        placeholder="Category name"
        required
        className="flex-1 border border-dl-rule bg-dl-chalk text-dl-ink py-2 px-3 font-dl-sans text-dl-body"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-dl-ink text-dl-chalk font-semibold py-2 px-4 hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
      >
        {pending ? "Saving…" : category?.id ? "Save" : "Add"}
      </button>
      {state?.error && (
        <p className="text-dl-signal-ink text-xs whitespace-nowrap">
          {state.error}
        </p>
      )}
    </form>
  );
}
