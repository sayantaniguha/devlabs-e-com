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
      className="text-on-error-container hover:opacity-70 disabled:opacity-40"
      aria-label={`Delete ${productName}`}
    >
      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
        delete
      </span>
    </button>
  );
}
