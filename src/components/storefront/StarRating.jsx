export function StarRating({ average, size = 16 }) {
  return (
    <span className="flex text-amber-500" style={{ fontSize: size }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < Math.round(average);
        return (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{
              fontSize: size,
              fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            star
          </span>
        );
      })}
    </span>
  );
}
