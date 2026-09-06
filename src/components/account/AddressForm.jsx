"use client";

import { useActionState, useEffect, useId } from "react";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const LABEL =
  "font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide";
const INPUT =
  "px-4 py-2 border border-dl-rule bg-dl-chalk font-dl-sans text-dl-body text-dl-ink placeholder:text-dl-charcoal focus:border-dl-signal transition-colors";

// Every field previously used its placeholder as its only label, which
// disappears the moment you type and is not reliably announced. Real labels
// now, with the placeholder dropped where the label already says it.
function Field({
  id,
  name,
  label,
  type = "text",
  required,
  defaultValue,
  autoComplete,
  inputMode,
  className = "",
}) {
  return (
    <label htmlFor={id} className={`flex flex-col gap-1 ${className}`}>
      <span className={LABEL}>
        {label}
        {!required && " (optional)"}
      </span>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`${INPUT} ${FOCUS_RING}`}
      />
    </label>
  );
}

export function AddressForm({ action, address, onSuccess, onCancel }) {
  const [state, formAction, pending] = useActionState(action, null);
  const uid = useId();

  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-stack-sm">
      {address?.id && <input type="hidden" name="id" value={address.id} />}

      <Field
        id={`${uid}-line1`}
        name="line1"
        label="Address line 1"
        required
        defaultValue={address?.line1}
        autoComplete="address-line1"
      />
      <Field
        id={`${uid}-line2`}
        name="line2"
        label="Address line 2"
        defaultValue={address?.line2}
        autoComplete="address-line2"
      />

      <div className="grid grid-cols-2 gap-stack-sm">
        <Field
          id={`${uid}-city`}
          name="city"
          label="City"
          required
          defaultValue={address?.city}
          autoComplete="address-level2"
        />
        <Field
          id={`${uid}-state`}
          name="state"
          label="State"
          required
          defaultValue={address?.state}
          autoComplete="address-level1"
        />
      </div>
      <div className="grid grid-cols-2 gap-stack-sm">
        <Field
          id={`${uid}-postal`}
          name="postalCode"
          label="Postal code"
          required
          defaultValue={address?.postal_code}
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <Field
          id={`${uid}-phone`}
          name="phone"
          label="Phone"
          type="tel"
          defaultValue={address?.phone}
          autoComplete="tel"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="font-dl-sans text-dl-body text-dl-signal-ink"
        >
          {state.error}
        </p>
      )}

      <div className="flex gap-stack-sm">
        <button
          type="submit"
          disabled={pending}
          className={`bg-dl-ink text-dl-chalk px-6 py-2 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 ${FOCUS_RING}`}
        >
          {pending ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`border border-dl-rule text-dl-ink px-6 py-2 font-dl-sans text-dl-body font-semibold hover:border-dl-ink active:scale-[0.98] transition ${FOCUS_RING}`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
