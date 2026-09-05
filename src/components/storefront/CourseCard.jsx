import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";

export function CourseCard({ course, priority = false }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col bg-dl-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
    >
      <div className="relative aspect-video bg-dl-sheet overflow-hidden">
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
      <div className="pt-4 flex flex-col gap-1 border-t border-dl-rule">
        {course.category && (
          <span className="font-dl-sans text-dl-spec text-dl-charcoal uppercase">
            {course.category}
          </span>
        )}
        <h3 className="font-dl-sans text-dl-body text-dl-ink font-semibold line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2 tabular-nums">
            <span className="font-dl-sans text-dl-body font-semibold text-dl-ink">
              {formatPrice(course.price)}
            </span>
            {course.compare_at_price && (
              <span className="font-dl-sans text-dl-body text-dl-charcoal line-through">
                {formatPrice(course.compare_at_price)}
              </span>
            )}
          </div>
          {course.level && (
            <span className="font-dl-sans text-dl-spec text-dl-charcoal uppercase">
              {course.level}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
