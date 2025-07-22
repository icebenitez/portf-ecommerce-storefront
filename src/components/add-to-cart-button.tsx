"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export function AddToCartButton({ product, className, size = "default", disabled }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    try {
      await addItem(product)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      size={size}
      disabled={disabled || product.stock === 0 || isAdding}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
