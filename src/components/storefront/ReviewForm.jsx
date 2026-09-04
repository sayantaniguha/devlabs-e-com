"use client";

import { useActionState, useState } from "react";
import { createReview } from "@/lib/actions/reviews";

export function ReviewForm({ courseId, courseSlug }) {
  const [state, formAction, pending] = useActionState(createReview, null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (state?.success) {
    return (
      <p className="font-body-sm text-body-sm text-on-tertiary-container bg-tertiary-fixed-dim/20 rounded p-stack-md">
        Thanks — your review has been posted.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="border border-outline-variant dark:border-outline rounded-lg p-stack-md flex flex-col gap-stack-sm"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="courseSlug" value={courseSlug} />
      <input type="hidden" name="rating" value={rating} />

      <p className="font-body-sm text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface">
        Leave a review
      </p>

      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="text-amber-500"
          >
            <span
              className="material-symbols-outlined text-[28px]"
              style={{
                fontVariationSettings:
                  n <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              star
            </span>
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        rows={3}
        placeholder="What did you think of this course? (optional)"
        className="w-full rounded-md border border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface focus:outline-none focus:border-secondary py-2 px-3 text-body-sm"
      />

      {state?.error && (
        <p className="text-error text-body-sm font-body-sm">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-secondary text-on-secondary px-6 py-2 rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
