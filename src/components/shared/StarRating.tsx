import { cn } from '@/lib/cn';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`${rating} out of ${maxRating} stars`}
      aria-readonly={!interactive}
    >
      {stars.map((star) => {
        let fill = 0;
        if (star <= fullStars) fill = 1;
        else if (star === fullStars + 1 && hasHalfStar) fill = 0.5;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && onChange?.(star - 0.5)}
            onMouseLeave={() => interactive && onChange?.(rating)}
            className={cn(
              'relative text-muted transition-colors',
              interactive && 'cursor-pointer hover:text-honey',
              sizeClasses[size]
            )}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            aria-checked={star <= rating}
            role={interactive ? 'radio' : undefined}
          >
            <Star className="text-line" fill="currentColor" />
            {fill > 0 && (
              <Star
                className="absolute left-0 top-0 text-honey"
                fill="currentColor"
                style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function StarRatingDisplay({ rating, maxRating = 5, size = 'md', className }: Omit<StarRatingProps, 'interactive' | 'onChange'>) {
  return <StarRating rating={rating} maxRating={maxRating} size={size} className={className} />;
}