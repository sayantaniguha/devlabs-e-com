"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ReviewForm } from "@/components/storefront/ReviewForm";
import { StarRating } from "@/components/storefront/StarRating";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils/format";

const REQUIREMENTS_BY_LEVEL = {
  Beginner: "No prior experience required.",
  Intermediate: "Basic familiarity with the subject is recommended.",
  Advanced: "Prior hands-on experience with the subject is expected.",
  "Beginner–Advanced":
    "No prior experience required — the course builds up to advanced material.",
};

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

export function CourseDetail({ course, isEnrolled, isAdminPreview, myReview }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const hasAccess = isEnrolled || isAdminPreview;

  const [modalLesson, setModalLesson] = useState(null);
  const [contentOpen, setContentOpen] = useState(true);

  const previewLessons = course.lessons.filter((l) => l.video_url);
  const discountPercent = course.compare_at_price
    ? Math.round(
        (1 - Number(course.price) / Number(course.compare_at_price)) * 100,
      )
    : null;

  const learningOutcomes = course.lessons.slice(0, 8).map((l) => l.title);
  const requirement =
    REQUIREMENTS_BY_LEVEL[course.level] ?? "No prior experience required.";

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

  return (
    <>
      {/* Hero */}
      <div className="bg-surface-container-low dark:bg-primary-container -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop py-stack-lg mb-stack-lg">
        <div className="max-w-3xl">
          {course.category && (
            <p className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim uppercase mb-stack-xs">
              {course.category}
            </p>
          )}
          <h1 className="font-headline-lg text-headline-lg md:text-[36px] text-on-background dark:text-inverse-on-surface mb-stack-sm">
            {course.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container mb-stack-sm">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-stack-sm font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
            {course.rating.count > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  {course.rating.average.toFixed(1)}
                </span>
                <StarRating average={course.rating.average} />
                <span>
                  ({course.rating.count} rating
                  {course.rating.count === 1 ? "" : "s"})
                </span>
              </span>
            ) : (
              <span>No ratings yet</span>
            )}
            {course.level && <span>· {course.level}</span>}
            {course.duration_hours && (
              <span>· {course.duration_hours} hours</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-xl items-start mb-stack-xl">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-stack-lg order-2 lg:order-1">
          {learningOutcomes.length > 0 && (
            <div className="border border-outline-variant dark:border-outline rounded-lg p-stack-lg">
              <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-sm">
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-stack-lg gap-y-2">
                {learningOutcomes.map((title) => (
                  <div key={title} className="flex items-start gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-on-tertiary-container mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      check
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-outline-variant dark:border-outline rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setContentOpen((o) => !o)}
              className="w-full flex items-center justify-between p-stack-md bg-surface-container-low dark:bg-primary-container"
            >
              <div className="text-left">
                <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface">
                  Course content
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                  {course.lessons.length} lectures
                  {course.duration_hours
                    ? ` · ${course.duration_hours} hours total`
                    : ""}
                  {previewLessons.length > 0 &&
                    ` · ${previewLessons.length} free preview${previewLessons.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <span
                className="material-symbols-outlined transition-transform shrink-0 ml-stack-sm"
                aria-hidden="true"
              >
                {contentOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
            {contentOpen && (
              <div className="divide-y divide-outline-variant dark:divide-outline">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between px-stack-md py-stack-sm"
                  >
                    <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
                      {i + 1}. {lesson.title}
                    </span>
                    {lesson.video_url ? (
                      <button
                        type="button"
                        onClick={() => openPreview(lesson)}
                        className="font-label-caps text-label-caps text-secondary uppercase hover:underline shrink-0 ml-stack-sm"
                      >
                        Preview
                      </button>
                    ) : (
                      <span
                        className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-on-primary-container shrink-0 ml-stack-sm"
                        aria-hidden="true"
                      >
                        lock
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-outline-variant dark:border-outline rounded-lg p-stack-lg">
            <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-sm">
              Requirements
            </h2>
            <ul className="list-disc pl-5 font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              <li>{requirement}</li>
            </ul>
          </div>

          <div className="border border-outline-variant dark:border-outline rounded-lg p-stack-lg">
            <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-sm">
              Description
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              {course.description}
            </p>
          </div>

          <div className="border border-outline-variant dark:border-outline rounded-lg p-stack-lg">
            <div className="flex items-center gap-stack-sm mb-stack-md">
              <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface">
                Reviews
              </h2>
              {course.rating.count > 0 && (
                <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">
                    {course.rating.average.toFixed(1)}
                  </span>
                  <StarRating average={course.rating.average} />
                  <span>({course.rating.count})</span>
                </span>
              )}
            </div>

            {course.rating.count > 0 && (
              <div className="flex flex-col gap-1 mb-stack-lg max-w-sm">
                {course.rating.breakdown.map(({ star, count }) => {
                  const pct = (count / course.rating.count) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container w-10">
                        {star} star
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container w-8 text-right">
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
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-lg italic">
                You've already reviewed this course.
              </p>
            )}

            <div className="flex flex-col gap-stack-md">
              {course.reviews.length === 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                  No reviews yet.
                </p>
              ) : (
                course.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-t border-outline-variant/50 dark:border-outline/50 pt-stack-md first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                        {review.reviewer_name}
                      </span>
                      <StarRating average={review.rating} size={14} />
                      <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                        {timeAgo(review.created_at)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Purchase sidebar */}
        <div className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="border border-outline-variant dark:border-outline rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <button
              type="button"
              onClick={() =>
                previewLessons[0] && openPreview(previewLessons[0])
              }
              disabled={previewLessons.length === 0}
              aria-label={`Preview ${course.title}`}
              className="relative aspect-video w-full bg-primary group"
            >
              {course.thumbnail_url && (
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
              )}
              {previewLessons.length > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-on-surface/20 group-hover:bg-on-surface/30 transition-colors">
                  <span className="w-14 h-14 rounded-full bg-surface-container-lowest/95 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-[32px] text-on-background"
                      aria-hidden="true"
                    >
                      play_arrow
                    </span>
                  </span>
                </span>
              )}
            </button>

            <div className="p-stack-lg flex flex-col gap-stack-md">
              <div className="flex items-center gap-2">
                <span className="font-price-lg text-price-lg text-on-background dark:text-inverse-on-surface font-bold">
                  {formatPrice(course.price)}
                </span>
                {course.compare_at_price && (
                  <>
                    <span className="font-price-sm text-price-sm text-on-surface-variant dark:text-on-primary-container line-through">
                      {formatPrice(course.compare_at_price)}
                    </span>
                    <span className="font-label-caps text-label-caps text-on-tertiary-container">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>

              {hasAccess ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/learn/${course.slug}`}
                    className="w-full h-12 bg-secondary text-on-secondary rounded font-body-lg text-body-lg font-medium shadow-[0_4px_12px_rgba(79,70,229,0.2)] flex items-center justify-center"
                  >
                    Go to course
                  </Link>
                  {isAdminPreview && (
                    <p className="text-xs text-on-surface-variant dark:text-on-primary-container text-center">
                      Viewing as admin — not purchased
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-stack-sm">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full h-12 bg-secondary text-on-secondary rounded font-body-lg text-body-lg font-medium shadow-[0_4px_12px_rgba(79,70,229,0.2)]"
                  >
                    Enroll Now
                  </button>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="h-12 border border-outline-variant dark:border-outline rounded font-body-lg text-body-lg font-medium text-on-background dark:text-inverse-on-surface hover:border-secondary transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      shopping_cart
                    </span>
                    Add to Cart
                  </button>
                </div>
              )}

              <div className="border-t border-outline-variant dark:border-outline pt-stack-sm">
                <p className="font-body-sm text-body-sm font-semibold text-on-surface dark:text-inverse-on-surface mb-2">
                  This course includes:
                </p>
                <ul className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
                  {course.duration_hours && (
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                        play_circle
                      </span>
                      {course.duration_hours} hours on-demand video
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      menu_book
                    </span>
                    {course.lessons.length} lectures
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      all_inclusive
                    </span>
                    Full lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      devices
                    </span>
                    Access on mobile and desktop
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      lock
                    </span>
                    Secure checkout via Razorpay
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalLesson && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile"
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 bg-on-surface/70"
            onClick={() => setModalLesson(null)}
          />
          <div className="relative w-full max-w-3xl bg-primary rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setModalLesson(null)}
              aria-label="Close preview"
              className="absolute top-2 right-2 z-10 bg-on-surface/50 text-white rounded-full p-1"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>
            {/* biome-ignore lint/a11y/useMediaCaption: instructor-uploaded preview clips have no caption track */}
            <video
              key={modalLesson.id}
              src={modalLesson.video_url}
              controls
              autoPlay
              className="w-full aspect-video"
            />
            <p className="p-stack-sm font-body-sm text-body-sm text-inverse-on-surface">
              Preview: {modalLesson.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
