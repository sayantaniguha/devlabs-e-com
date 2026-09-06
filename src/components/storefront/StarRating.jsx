import { StarIcon } from "@/components/ui/icons";

// Achromatic by design: filled stars are ink, empty ones are rule. The amber
// fill this used to carry was the only warm colour on the site and it fought
// the signal red. Every caller renders the numeric value alongside, so the
// row itself stays decorative.
export function StarRating({ average, size = 16 }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < Math.round(average);
        return (
          <StarIcon
            key={i}
            filled={filled}
            className={filled ? "text-dl-ink" : "text-dl-rule"}
            style={{ width: size, height: size }}
          />
        );
      })}
    </span>
  );
}
