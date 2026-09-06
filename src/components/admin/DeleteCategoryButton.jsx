"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCategory } from "@/lib/actions/admin/categories";

// Text, not an icon, matching DeleteProductButton. The icon here was one of
// the last consumers of the Material Symbols webfont.
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
        aria-label={`Delete ${categoryName}`}
        className="font-dl-sans text-dl-body text-dl-signal-ink hover:underline underline-offset-4 disabled:opacity-40 disabled:no-underline whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error && (
        <p
          role="alert"
          className="font-dl-sans text-dl-spec text-dl-signal-ink"
        >
          {error}
        </p>
      )}
    </div>
  );
}
