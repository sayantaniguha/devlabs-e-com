import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

export function CourseCard({ course, priority = false }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col bg-surface-container-lowest border border-outline-variant dark:border-outline rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
    >
      <div className="relative aspect-video bg-surface-container-low">
        {course.thumbnail_url && (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-stack-md flex flex-col gap-1">
        <h3 className="font-body-lg text-body-lg font-semibold text-on-surface dark:text-inverse-on-surface line-clamp-2">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-price-sm text-price-sm text-on-surface dark:text-inverse-on-surface">
            {formatPrice(course.price)}
          </span>
          {course.compare_at_price && (
            <span className="font-price-sm text-price-sm text-on-surface-variant dark:text-on-primary-container line-through">
              {formatPrice(course.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
