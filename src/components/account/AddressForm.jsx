"use client";

import { useActionState, useEffect } from "react";

const fieldClass =
  "px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface focus:outline-none focus:border-secondary";

export function AddressForm({ action, address, onSuccess, onCancel }) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-stack-sm">
      {address?.id && <input type="hidden" name="id" value={address.id} />}

      <input
        type="text"
        name="line1"
        defaultValue={address?.line1 ?? ""}
        placeholder="Address line 1"
        required
        className={fieldClass}
      />
      <input
        type="text"
        name="line2"
        defaultValue={address?.line2 ?? ""}
        placeholder="Address line 2 (optional)"
        className={fieldClass}
      />
      <div className="grid grid-cols-2 gap-stack-sm">
        <input
          type="text"
          name="city"
          defaultValue={address?.city ?? ""}
          placeholder="City"
          required
          className={fieldClass}
        />
        <input
          type="text"
          name="state"
          defaultValue={address?.state ?? ""}
          placeholder="State"
          required
          className={fieldClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-stack-sm">
        <input
          type="text"
          name="postalCode"
          defaultValue={address?.postal_code ?? ""}
          placeholder="Postal code"
          required
          className={fieldClass}
        />
        <input
          type="tel"
          name="phone"
          defaultValue={address?.phone ?? ""}
          placeholder="Phone (optional)"
          className={fieldClass}
        />
      </div>

      {state?.error && (
        <p className="text-error text-body-sm font-body-sm">{state.error}</p>
      )}

      <div className="flex gap-stack-sm">
        <button
          type="submit"
          disabled={pending}
          className="bg-secondary text-on-primary px-6 py-2 rounded font-semibold hover:bg-secondary-container transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-outline-variant dark:border-outline text-on-surface dark:text-inverse-on-surface px-6 py-2 rounded font-semibold hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
