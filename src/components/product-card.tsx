"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price}</span>
          {product.stock < 5 && <Badge variant="destructive">Low Stock</Badge>}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" disabled={product.stock === 0}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
