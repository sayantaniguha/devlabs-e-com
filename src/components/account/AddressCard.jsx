"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "@/lib/actions/addresses";
import { AddressForm } from "./AddressForm";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const ACTION =
  "font-dl-sans text-dl-body text-dl-charcoal hover:text-dl-ink hover:underline underline-offset-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

export function AddressCard({ address }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (editing) {
    return (
      <div className="border border-dl-rule bg-dl-chalk p-stack-md">
        <AddressForm
          action={updateAddress}
          address={address}
          onSuccess={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  async function handleDelete() {
    if (!confirm("Delete this address?")) return;
    setBusy(true);
    await deleteAddress(address.id);
    setBusy(false);
    router.refresh();
  }

  async function handleSetDefault() {
    setBusy(true);
    await setDefaultAddress(address.id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="border border-dl-rule bg-dl-chalk p-stack-md flex items-start justify-between gap-stack-md">
      <div>
        {address.is_default && (
          // Bordered tag, matching the low-stock treatment on ProductCard,
          // rather than a tinted pill.
          <span className="inline-block mb-2 border border-dl-rule px-2 py-0.5 font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide">
            Default
          </span>
        )}
        <p className="font-dl-sans text-dl-body text-dl-ink">
          {address.line1}
          {address.line2 && <>, {address.line2}</>}
          <br />
          {address.city}, {address.state}{" "}
          <span className="tabular-nums">{address.postal_code}</span>
          {address.phone && (
            <>
              <br />
              <span className="tabular-nums">{address.phone}</span>
            </>
          )}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`${ACTION} ${FOCUS_RING}`}
        >
          Edit
        </button>
        {!address.is_default && (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={busy}
            className={`${ACTION} ${FOCUS_RING}`}
          >
            Set default
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className={`font-dl-sans text-dl-body text-dl-signal-ink hover:underline underline-offset-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${FOCUS_RING}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
