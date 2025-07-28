"use client"

import type React from "react"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/lib/types/database"

interface WishlistButtonProps {
  product: Product
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function WishlistButton({ product, className, size = "default" }: WishlistButtonProps) {
  const { user } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false) // In a real app, check if product is in user's wishlist
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert("Please sign in to add items to your wishlist")
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would add/remove from wishlist in database
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsInWishlist(!isInWishlist)
    } catch (error) {
      console.error("Error updating wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggleWishlist}
      variant={isInWishlist ? "default" : "outline"}
      size={size}
      className={className}
      disabled={isLoading}
    >
      <Heart className={`w-4 h-4 ${size !== "icon" ? "mr-2" : ""} ${isInWishlist ? "fill-current" : ""}`} />
      {size !== "icon" && (isLoading ? "..." : isInWishlist ? "In Wishlist" : "Add to Wishlist")}
    </Button>
  )
}
