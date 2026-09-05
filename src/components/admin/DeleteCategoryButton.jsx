"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCategory } from "@/lib/actions/admin/categories";

export function DeleteCategoryButton({ categoryId, categoryName }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${categoryName}"?`)) return;
    setDeleting(true);
    setError(null);
    const result = await deleteCategory(categoryId);
    setDeleting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="text-on-error-container hover:opacity-70 disabled:opacity-40"
        aria-label={`Delete ${categoryName}`}
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
          delete
        </span>
      </button>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
