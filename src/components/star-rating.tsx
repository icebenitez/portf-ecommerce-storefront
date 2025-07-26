"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating
        const isHalfFilled = starValue - 0.5 <= rating && starValue > rating

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={cn(
              "relative transition-colors",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isHalfFilled ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200",
              )}
            />
            {isHalfFilled && (
              <Star
                className={cn(sizeClasses[size], "absolute top-0 left-0 fill-yellow-400 text-yellow-400")}
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
