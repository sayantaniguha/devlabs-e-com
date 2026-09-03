"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "@/lib/actions/addresses";
import { AddressForm } from "./AddressForm";

export function AddressCard({ address }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (editing) {
    return (
      <div className="border border-outline-variant dark:border-outline rounded-lg p-stack-md">
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
    <div className="border border-outline-variant dark:border-outline rounded-lg p-stack-md flex items-start justify-between gap-stack-md">
      <div>
        {address.is_default && (
          <span className="inline-block mb-1 px-2 py-0.5 bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-wider rounded">
            Default
          </span>
        )}
        <p className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
          {address.line1}
          {address.line2 && <>, {address.line2}</>}
          <br />
          {address.city}, {address.state} {address.postal_code}
          {address.phone && (
            <>
              <br />
              {address.phone}
            </>
          )}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-body-sm font-body-sm text-secondary hover:underline"
        >
          Edit
        </button>
        {!address.is_default && (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={busy}
            className="text-body-sm font-body-sm text-secondary hover:underline disabled:opacity-60"
          >
            Set default
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="text-body-sm font-body-sm text-error hover:underline disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
