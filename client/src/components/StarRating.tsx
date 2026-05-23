"use client";

interface StarRatingProps {
  rating: number;
  onRating?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ rating, onRating, readonly = false, size = 24 }: StarRatingProps) {
  const handleClick = (value: number) => {
    if (!readonly && onRating) {
      onRating(value);
    }
  };

  // Responsive size based on screen (if not explicitly provided)
  const getResponsiveSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        return Math.max(16, size * 0.7);
      }
      if (window.innerWidth < 768) {
        return Math.max(18, size * 0.8);
      }
    }
    return size;
  };

  const starSize = getResponsiveSize();

  return (
    <div className="flex gap-0.5 sm:gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} focus:outline-none transition-transform hover:scale-110 active:scale-95`}
          disabled={readonly}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill={star <= rating ? "#FFC107" : "none"}
            stroke="#FFC107"
            strokeWidth="1.5"
            className="transition-all duration-200"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={star <= rating ? "#FFC107" : "none"}
              stroke="#FFC107"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}