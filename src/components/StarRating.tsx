import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className={cn(
            "transition-transform",
            interactive && "hover:scale-110 cursor-pointer"
          )}
          aria-label={`Rate ${star} out of ${max}`}
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : star - 0.5 <= rating
                ? "fill-amber-200 text-amber-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}
