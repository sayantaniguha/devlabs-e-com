"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils/format";

export function CourseDetail({ course, isEnrolled }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [previewLesson, setPreviewLesson] = useState(
    course.lessons.find((l) => l.is_preview && l.video_url) ?? null,
  );

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-xl mb-stack-xl">
      <div className="flex flex-col space-y-stack-md">
        <div className="aspect-video bg-surface-container-low rounded-lg border border-outline-variant dark:border-outline overflow-hidden relative">
          {previewLesson?.video_url ? (
            // biome-ignore lint/a11y/useMediaCaption: instructor-uploaded preview clips have no caption track
            <video
              key={previewLesson.id}
              src={previewLesson.video_url}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            course.thumbnail_url && (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="font-headline-lg text-headline-lg md:text-[32px] text-primary dark:text-inverse-on-surface mb-stack-xs">
          {course.title}
        </h1>
        <div className="flex items-center gap-2 font-price-lg text-price-lg text-primary dark:text-inverse-on-surface mb-stack-md">
          <span>{formatPrice(course.price)}</span>
          {course.compare_at_price && (
            <span className="text-on-surface-variant dark:text-on-primary-container line-through text-price-sm font-price-sm">
              {formatPrice(course.compare_at_price)}
            </span>
          )}
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container mb-stack-lg border-b border-outline-variant dark:border-outline pb-stack-md">
          {course.description}
        </p>

        {isEnrolled ? (
          <Link
            href={`/learn/${course.slug}`}
            className="w-full h-12 bg-secondary text-on-secondary rounded font-body-lg text-body-lg font-medium shadow-[0_4px_12px_rgba(79,70,229,0.2)] flex items-center justify-center mb-stack-lg"
          >
            Go to course
          </Link>
        ) : (
          <div className="flex flex-col space-y-stack-sm mb-stack-lg">
            <button
              type="button"
              onClick={handleAdd}
              className="h-12 border border-outline-variant dark:border-outline rounded font-body-lg text-body-lg font-medium text-primary dark:text-inverse-on-surface hover:border-primary dark:hover:border-inverse-on-surface transition-colors flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full h-12 bg-secondary text-on-secondary rounded font-body-lg text-body-lg font-medium shadow-[0_4px_12px_rgba(79,70,229,0.2)]"
            >
              Enroll Now
            </button>
          </div>
        )}

        <div className="border-t border-outline-variant dark:border-outline pt-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary dark:text-inverse-on-surface mb-stack-sm">
            Syllabus
          </h2>
          <div className="flex flex-col divide-y divide-outline-variant dark:divide-outline">
            {course.lessons.map((lesson, i) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between py-3"
              >
                <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
                  {i + 1}. {lesson.title}
                </span>
                {lesson.is_preview && lesson.video_url ? (
                  <button
                    type="button"
                    onClick={() => setPreviewLesson(lesson)}
                    className="font-label-caps text-label-caps text-secondary uppercase hover:underline shrink-0 ml-stack-sm"
                  >
                    Preview
                  </button>
                ) : (
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-on-primary-container shrink-0 ml-stack-sm">
                    lock
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
