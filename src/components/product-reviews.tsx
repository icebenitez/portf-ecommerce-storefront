"use client"

import { useState } from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { User, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "./star-rating"
import type { ProductReview } from "@/lib/types/database"

dayjs.extend(relativeTime)

interface ProductReviewsProps {
  reviews: ProductReview[]
  averageRating: number
  totalReviews: number
}

export function ProductReviews({ reviews, averageRating, totalReviews }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i
    const count = reviews.filter((review) => review.rating === rating).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Customer Reviews</h3>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <div className="flex gap-2">
          {[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "highest", label: "Highest Rated" },
            { value: "lowest", label: "Lowest Rated" },
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={sortBy === value ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(value as any)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      {review.verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {/* {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })} */}
                        {dayjs(review.created_at).fromNow()}
                      </span>
                    </div>

                    {review.title && <h4 className="font-semibold">{review.title}</h4>}

                    {review.comment && <p className="text-muted-foreground leading-relaxed">{review.comment}</p>}

                    <div className="flex items-center gap-4 pt-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
