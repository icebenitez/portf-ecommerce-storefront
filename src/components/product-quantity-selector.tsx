"use client"

import { useState, useMemo } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { ProductVariantSelector } from "./product-variant-selector"
import type { Product } from "@/lib/types/database"

interface ProductQuantitySelectorProps {
  product: Product
}

export function ProductQuantitySelector({ product }: ProductQuantitySelectorProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  const variants = product.product_variants || []

  // Calculate the final price including variant modifiers
  const finalPrice = useMemo(() => {
    let price = product.price

    variants.forEach((variant) => {
      if (selectedVariants[variant.name] === variant.value) {
        price += variant.price_modifier
      }
    })

    return price
  }, [product.price, variants, selectedVariants])

  // Check if all required variants are selected
  const variantTypes = [...new Set(variants.map((v) => v.name))]
  const allVariantsSelected = variantTypes.every((type) => selectedVariants[type])

  // Check stock availability for selected variants
  const availableStock = useMemo(() => {
    if (variants.length === 0) return product.stock

    // Find the minimum stock among selected variants
    let minStock = product.stock

    Object.entries(selectedVariants).forEach(([variantType, variantValue]) => {
      const variant = variants.find((v) => v.name === variantType && v.value === variantValue)
      if (variant) {
        minStock = Math.min(minStock, variant.stock)
      }
    })

    return minStock
  }, [product.stock, variants, selectedVariants])

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: value,
    }))
  }

  const handleAddToCart = async () => {
    if (variants.length > 0 && !allVariantsSelected) {
      alert("Please select all options before adding to cart")
      return
    }

    setIsAdding(true)
    try {
      const productWithVariants = {
        ...product,
        price: finalPrice, // Use the calculated price with variants
        selectedVariants,
      }

      for (let i = 0; i < quantity; i++) {
        await addItem(productWithVariants)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const isOutOfStock = availableStock === 0
  const canAddToCart = !isOutOfStock && (variants.length === 0 || allVariantsSelected)

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      {variants.length > 0 && (
        <ProductVariantSelector
          variants={variants}
          selectedVariants={selectedVariants}
          onVariantChange={handleVariantChange}
        />
      )}

      {/* Quantity and Add to Cart */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Price Display */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                ${finalPrice.toFixed(2)}
                {finalPrice !== product.price && (
                  <span className="text-lg text-muted-foreground line-through ml-2">${product.price.toFixed(2)}</span>
                )}
              </span>
              <span className="text-sm text-muted-foreground">{availableStock} in stock</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= availableStock}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} disabled={!canAddToCart || isAdding} className="w-full" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAdding
                ? "Adding..."
                : isOutOfStock
                  ? "Out of Stock"
                  : `Add to Cart - $${(finalPrice * quantity).toFixed(2)}`}
            </Button>

            {/* Variant Selection Warning */}
            {variants.length > 0 && !allVariantsSelected && (
              <p className="text-sm text-muted-foreground text-center">Please select all options above</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
