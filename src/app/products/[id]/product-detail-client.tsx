"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProductQuantitySelector } from "@/components/product-quantity-selector"
import { ProductReviews } from "@/components/product-reviews"
import { ReviewForm } from "@/components/review-form"
import { StarRating } from "@/components/star-rating"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { WishlistButton } from "@/components/wishlist-button"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { user } = useAuth()
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const reviews = product.product_reviews || []
  const averageRating = product.average_rating || 0
  const reviewCount = product.review_count || 0

  const handleReviewSubmit = async (reviewData: { rating: number; title: string; comment: string }) => {
    if (!user) {
      alert("Please sign in to submit a review")
      return
    }

    setIsSubmittingReview(true)
    try {
      // await submitProductReview(product.id, user.id, reviewData)
      const supabase = createClient()

      const { error } = await supabase.from("product_reviews").insert({
        product_id: product.id,
        user_id: user.id,
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment || null,
        verified_purchase: false, // You can implement logic to check if user actually purchased
      })

      if (error) {
        console.error("Error submitting review:", error)
        throw error
      }
      alert("Review submitted successfully!")
      // In a real app, you'd refresh the reviews here or use optimistic updates
      window.location.reload()
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-muted-foreground">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
              <WishlistButton product={product} size="sm" />
            </div>
            <p className="text-2xl font-bold text-primary">${product.price}</p>
          </div>

          <div className="flex items-center gap-4">
            {product.stock > 0 ? (
              <Badge variant="secondary">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {product.stock < 5 && product.stock > 0 && <Badge variant="destructive">Low Stock</Badge>}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

          {/* Quantity Selector with Variants */}
          <ProductQuantitySelector product={product} />

          {/* Product Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="capitalize">{product.categories?.name || "Uncategorized"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span>{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span>SKU-{product.id.slice(0, 8)}</span>
                </div>
                {product.product_variants && product.product_variants.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Options:</span>
                    <span>{[...new Set(product.product_variants.map((v) => v.name))].join(", ")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductReviews reviews={reviews} averageRating={averageRating} totalReviews={reviewCount} />
        </div>

        <div>
          <ReviewForm productId={product.id} onSubmit={handleReviewSubmit} />
        </div>
      </div>
    </div>
  )
}
