"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"

interface ProductQuantitySelectorProps {
  product: Product
}

export function ProductQuantitySelector({ product }: ProductQuantitySelectorProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      for (let i = 0; i < quantity; i++) {
        await addItem(product)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= product.stock}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button onClick={handleAddToCart} disabled={product.stock === 0 || isAdding} className="w-full" size="lg">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isAdding ? "Adding..." : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
