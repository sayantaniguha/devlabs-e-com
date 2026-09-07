"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ReviewForm } from "@/components/storefront/ReviewForm";
import { StarRating } from "@/components/storefront/StarRating";
import {
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  LockIcon,
  PlayIcon,
} from "@/components/ui/icons";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils/format";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const REQUIREMENTS_BY_LEVEL = {
  Beginner: "No prior experience required.",
  Intermediate: "Basic familiarity with the subject is recommended.",
  Advanced: "Prior hands-on experience with the subject is expected.",
  "Beginner–Advanced":
    "No prior experience required. The course builds up to advanced material.",
};

function Panel({ title, children, className = "" }) {
  return (
    <section
      className={`border border-dl-rule bg-dl-chalk p-stack-lg ${className}`}
    >
      <h2 className="font-dl-sans text-dl-body-lg font-semibold text-dl-ink mb-stack-md">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CourseDetail({ course, isEnrolled, isAdminPreview, myReview }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const hasAccess = isEnrolled || isAdminPreview;

  const [modalLesson, setModalLesson] = useState(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const previewLessons = course.lessons.filter((l) => l.video_url);
  const discountPercent = course.compare_at_price
    ? Math.round(
        (1 - Number(course.price) / Number(course.compare_at_price)) * 100,
      )
    : null;

  const learningOutcomes = course.lessons.slice(0, 8).map((l) => l.title);
  const requirement =
    REQUIREMENTS_BY_LEVEL[course.level] ?? "No prior experience required.";

  // Native <dialog> so the preview gets a focus trap, Escape-to-close, and
  // focus restored to the trigger for free. Focus is set imperatively because
  // React's autoFocus does not compose with showModal()'s own algorithm.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (modalLesson && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!modalLesson && dialog.open) {
      dialog.close();
    }
  }, [modalLesson]);

  function handleAdd() {
    addItem({
      itemType: "course",
      courseId: course.id,
      name: course.title,
      image: course.thumbnail_url,
      unitPrice: Number(course.price),
      quantity: 1,
    });
  }

  function handleBuyNow() {
    handleAdd();
    openCart();
  }

  function openPreview(lesson) {
    if (lesson.video_url) setModalLesson(lesson);
  }

  const includes = [
    course.duration_hours && [
      "Video",
      `${course.duration_hours} hours on demand`,
    ],
    ["Lectures", String(course.lessons.length)],
    ["Access", "Full lifetime"],
    ["Devices", "Mobile and desktop"],
    ["Checkout", "Secure via Razorpay"],
  ].filter(Boolean);

  return (
    <>
      {/* Masthead. Full-bleed sheet band, ruled top and bottom, matching the
          plates-and-rules language used on the storefront. */}
      <div className="bg-dl-sheet border-y border-dl-rule -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop py-stack-lg mb-stack-lg">
        <div className="max-w-3xl">
          {course.category && (
            <p className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide mb-stack-xs">
              {course.category}
            </p>
          )}
          <h1 className="font-dl-sans text-dl-ink [font-stretch:110%] text-[clamp(1.75rem,2.5vw+1rem,2.25rem)] leading-[1.1]">
            {course.title}
          </h1>
          <p className="font-dl-sans text-dl-body-lg text-dl-charcoal mt-stack-sm max-w-prose">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-stack-sm gap-y-2 font-dl-sans text-dl-body text-dl-charcoal mt-stack-md">
            {course.rating.count > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-dl-ink tabular-nums">
                  {course.rating.average.toFixed(1)}
                </span>
                <StarRating average={course.rating.average} />
                <span className="tabular-nums">
                  ({course.rating.count} rating
                  {course.rating.count === 1 ? "" : "s"})
                </span>
              </span>
            ) : (
              <span>No ratings yet</span>
            )}
            {course.level && (
              <span>
                <span aria-hidden="true">· </span>
                {course.level}
              </span>
            )}
            {course.duration_hours && (
              <span className="tabular-nums">
                <span aria-hidden="true">· </span>
                {course.duration_hours} hours
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start mb-stack-xl">
        <div className="lg:col-span-2 flex flex-col gap-stack-lg order-2 lg:order-1">
          {learningOutcomes.length > 0 && (
            <Panel title="What you'll learn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-stack-lg gap-y-stack-sm">
                {learningOutcomes.map((title) => (
                  <div key={title} className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 shrink-0 mt-1 text-dl-ink" />
                    <span className="font-dl-sans text-dl-body text-dl-ink">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <details open className="group border border-dl-rule bg-dl-chalk">
            <summary
              className={`flex items-center justify-between gap-stack-sm p-stack-lg cursor-pointer list-none bg-dl-sheet ${FOCUS_RING}`}
            >
              <span className="text-left">
                <span className="block font-dl-sans text-dl-body-lg font-semibold text-dl-ink">
                  Course content
                </span>
                <span className="block font-dl-sans text-dl-body text-dl-charcoal tabular-nums">
                  {course.lessons.length} lectures
                  {course.duration_hours
                    ? ` · ${course.duration_hours} hours total`
                    : ""}
                  {previewLessons.length > 0 &&
                    ` · ${previewLessons.length} free preview${previewLessons.length > 1 ? "s" : ""}`}
                </span>
              </span>
              <ChevronIcon className="w-4 h-4 shrink-0 text-dl-charcoal transition-transform group-open:rotate-180" />
            </summary>
            <ol className="divide-y divide-dl-rule border-t border-dl-rule">
              {course.lessons.map((lesson, i) => (
                <li
                  key={lesson.id}
                  className="flex items-center justify-between gap-stack-sm px-stack-lg py-stack-sm"
                >
                  <span className="font-dl-sans text-dl-body text-dl-ink">
                    <span className="text-dl-charcoal tabular-nums">
                      {i + 1}.
                    </span>{" "}
                    {lesson.title}
                  </span>
                  {lesson.video_url ? (
                    <button
                      type="button"
                      onClick={() => openPreview(lesson)}
                      className={`shrink-0 font-dl-sans text-dl-spec uppercase tracking-wide text-dl-ink underline underline-offset-4 hover:text-dl-signal-ink transition-colors ${FOCUS_RING}`}
                    >
                      Preview
                    </button>
                  ) : (
                    <span className="shrink-0 flex items-center text-dl-charcoal">
                      <LockIcon className="w-4 h-4" />
                      <span className="sr-only">Locked</span>
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </details>

          <Panel title="Requirements">
            <p className="font-dl-sans text-dl-body text-dl-charcoal">
              {requirement}
            </p>
          </Panel>

          <Panel title="Description">
            <p className="font-dl-sans text-dl-body text-dl-charcoal max-w-prose">
              {course.description}
            </p>
          </Panel>

          <Panel title="Reviews">
            {course.rating.count > 0 && (
              <div className="flex items-center gap-1.5 font-dl-sans text-dl-body text-dl-charcoal mb-stack-md">
                <span className="font-semibold text-dl-ink tabular-nums">
                  {course.rating.average.toFixed(1)}
                </span>
                <StarRating average={course.rating.average} />
                <span className="tabular-nums">({course.rating.count})</span>
              </div>
            )}

            {course.rating.count > 0 && (
              <div className="flex flex-col gap-1 mb-stack-lg max-w-sm">
                {course.rating.breakdown.map(({ star, count }) => {
                  const pct = (count / course.rating.count) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="font-dl-sans text-dl-body text-dl-charcoal w-12 tabular-nums">
                        {star} star
                      </span>
                      <span className="flex-1 h-1.5 bg-dl-rule overflow-hidden">
                        <span
                          className="block h-full bg-dl-ink"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="font-dl-sans text-dl-body text-dl-charcoal w-8 text-right tabular-nums">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {isEnrolled && !myReview && (
              <div className="mb-stack-lg">
                <ReviewForm courseId={course.id} courseSlug={course.slug} />
              </div>
            )}
            {myReview && (
              <p className="font-dl-sans text-dl-body text-dl-charcoal mb-stack-lg">
                You have already reviewed this course.
              </p>
            )}

            <div className="flex flex-col gap-stack-md">
              {course.reviews.length === 0 ? (
                <p className="font-dl-sans text-dl-body text-dl-charcoal">
                  No reviews yet.
                </p>
              ) : (
                course.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-t border-dl-rule pt-stack-md first:border-t-0 first:pt-0"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-dl-sans text-dl-body font-semibold text-dl-ink">
                        {review.reviewer_name}
                      </span>
                      <StarRating average={review.rating} size={14} />
                      <span className="font-dl-sans text-dl-spec text-dl-charcoal">
                        {review.timeAgoLabel}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="font-dl-sans text-dl-body text-dl-charcoal max-w-prose">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>

        {/* Purchase rail. Bordered plate, no elevation: shadow is reserved for
            functional overlays in this system. */}
        <div className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="border border-dl-rule bg-dl-chalk">
            <button
              type="button"
              onClick={() =>
                previewLessons[0] && openPreview(previewLessons[0])
              }
              disabled={previewLessons.length === 0}
              aria-label={
                previewLessons.length > 0
                  ? `Play free preview of ${course.title}`
                  : `${course.title} thumbnail`
              }
              className={`relative aspect-video w-full bg-dl-sheet group block border-b border-dl-rule disabled:cursor-default ${FOCUS_RING}`}
            >
              {course.thumbnail_url && (
                <Image
                  src={course.thumbnail_url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
              )}
              {previewLessons.length > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-dl-ink/20 group-hover:bg-dl-ink/30 transition-colors">
                  <span className="w-14 h-14 bg-dl-chalk flex items-center justify-center">
                    <PlayIcon className="w-5 h-5 text-dl-ink translate-x-px" />
                  </span>
                </span>
              )}
            </button>

            <div className="p-stack-lg flex flex-col gap-stack-md">
              <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                <span className="font-dl-sans text-dl-headline font-semibold text-dl-ink tabular-nums">
                  {formatPrice(course.price)}
                </span>
                {course.compare_at_price && (
                  <>
                    <span className="font-dl-sans text-dl-body text-dl-charcoal line-through tabular-nums">
                      {formatPrice(course.compare_at_price)}
                    </span>
                    <span className="font-dl-sans text-dl-spec uppercase tracking-wide text-dl-signal-ink tabular-nums">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>

              {hasAccess ? (
                <div className="flex flex-col gap-stack-sm">
                  <Link
                    href={`/learn/${course.slug}`}
                    className={`w-full h-12 bg-dl-ink text-dl-chalk font-dl-sans text-dl-body-lg font-semibold flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
                  >
                    Go to course
                  </Link>
                  {isAdminPreview && (
                    <p className="font-dl-sans text-dl-spec text-dl-charcoal text-center">
                      Viewing as admin, not purchased
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-stack-sm">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className={`w-full h-12 bg-dl-ink text-dl-chalk font-dl-sans text-dl-body-lg font-semibold hover:opacity-90 active:scale-[0.98] transition ${FOCUS_RING}`}
                  >
                    Enroll now
                  </button>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`w-full h-12 border border-dl-rule font-dl-sans text-dl-body-lg font-semibold text-dl-ink hover:border-dl-ink active:scale-[0.98] transition ${FOCUS_RING}`}
                  >
                    Add to cart
                  </button>
                </div>
              )}

              {/* Spec table rather than an icon list: the icons were a second
                  family (Material Symbols) and this reads as the same
                  indexed-spec language used across the storefront. */}
              <dl className="border-t border-dl-rule divide-y divide-dl-rule">
                {includes.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-stack-sm py-2"
                  >
                    <dt className="font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide">
                      {label}
                    </dt>
                    <dd className="font-dl-sans text-dl-body text-dl-ink text-right tabular-nums">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is a
          pointer convenience only. The keyboard path is Escape, which the
          native <dialog> handles and which fires onClose below. Verified. */}
      <dialog
        ref={dialogRef}
        onClose={() => setModalLesson(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setModalLesson(null);
        }}
        aria-label={
          modalLesson ? `Preview: ${modalLesson.title}` : "Lesson preview"
        }
        className="m-auto w-full max-w-3xl bg-dl-chalk border border-dl-rule p-0 shadow-dl-overlay backdrop:bg-dl-ink backdrop:opacity-50"
      >
        {modalLesson && (
          <div className="relative">
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setModalLesson(null)}
              aria-label="Close preview"
              className={`absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center bg-dl-chalk border border-dl-rule text-dl-ink hover:border-dl-ink transition-colors ${FOCUS_RING}`}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
            {/* biome-ignore lint/a11y/useMediaCaption: instructor-uploaded preview clips have no caption track */}
            <video
              key={modalLesson.id}
              src={modalLesson.video_url}
              controls
              autoPlay
              className="w-full aspect-video bg-dl-ink"
            />
            <p className="px-stack-md py-stack-sm font-dl-sans text-dl-body text-dl-ink border-t border-dl-rule">
              Preview: {modalLesson.title}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
