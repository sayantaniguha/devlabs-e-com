"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProduct } from "@/lib/actions/admin/products";

export function DeleteProductButton({ productId, productName }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    setDeleting(true);
    const result = await deleteProduct(productId);
    setDeleting(false);
    if (result?.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      aria-label={`Delete ${productName}`}
      className="font-dl-sans text-dl-body text-dl-signal-ink hover:underline underline-offset-4 disabled:opacity-40 disabled:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
