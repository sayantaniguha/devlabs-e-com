"use client";

import { useActionState, useState } from "react";
import { StarIcon } from "@/components/ui/icons";
import { createReview } from "@/lib/actions/reviews";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

export function ReviewForm({ courseId, courseSlug }) {
  const [state, formAction, pending] = useActionState(createReview, null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (state?.success) {
    return (
      <p className="font-dl-sans text-dl-body text-dl-ink border border-dl-rule bg-dl-sheet p-stack-md">
        Thanks, your review has been posted.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="border border-dl-rule bg-dl-sheet p-stack-md flex flex-col gap-stack-sm"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="courseSlug" value={courseSlug} />

      <p className="font-dl-sans text-dl-body font-semibold text-dl-ink">
        Leave a review
      </p>

      {/* Real radios in a fieldset. This was previously a role="radiogroup"
          wrapping plain buttons, which gave the group radio semantics without
          radio behaviour: no arrow-key navigation and no checked state. */}
      <fieldset
        className="border-0 p-0 m-0"
        onMouseLeave={() => setHoverRating(0)}
      >
        <legend className="sr-only">Rating</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= (hoverRating || rating);
            return (
              <label
                key={n}
                onMouseEnter={() => setHoverRating(n)}
                className={`cursor-pointer p-0.5 ${filled ? "text-dl-ink" : "text-dl-rule"} hover:text-dl-ink transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-dl-signal focus-within:outline-offset-2`}
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="sr-only"
                />
                <StarIcon filled={filled} className="w-6 h-6" />
                <span className="sr-only">
                  {n} star{n > 1 ? "s" : ""}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <textarea
        name="comment"
        rows={3}
        aria-label="Review comment"
        placeholder="What did you think of this course? (optional)"
        className={`w-full border border-dl-rule bg-dl-chalk text-dl-ink placeholder:text-dl-charcoal font-dl-sans text-dl-body py-2 px-3 focus:border-dl-signal transition-colors ${FOCUS_RING}`}
      />

      {state?.error && (
        <p className="font-dl-sans text-dl-body text-dl-signal-ink">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`self-start bg-dl-ink text-dl-chalk px-6 py-2 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 ${FOCUS_RING}`}
      >
        {pending ? "Posting..." : "Post review"}
      </button>
    </form>
  );
}
