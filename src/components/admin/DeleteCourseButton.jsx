"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCourse } from "@/lib/actions/admin/courses";

export function DeleteCourseButton({ courseId, courseName }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${courseName}"? This cannot be undone.`)) return;
    setDeleting(true);
    const result = await deleteCourse(courseId);
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
      aria-label={`Delete ${courseName}`}
    >
      <span className="material-symbols-outlined text-[20px]">delete</span>
    </button>
  );
}
