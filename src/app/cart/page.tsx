"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart()

  if (state.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => {
            // Safely access product properties
            const product = item.products
            if (!product) {
              console.error("Product not found for cart item:", item)
              return null
            }

            const selectedVariants = item.selected_variants || {}
            const hasVariants = Object.keys(selectedVariants).length > 0

            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg?height=96&width=96&text=Product"}
                        alt={product.name || "Product"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>

                      {/* Show selected variants */}
                      {hasVariants && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(selectedVariants).map(([variantType, variantValue]) => (
                            <Badge key={variantType} variant="secondary" className="text-xs">
                              {variantType}: {variantValue}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {product.description || "No description available"}
                      </p>
                      <p className="font-bold text-lg">${product.price?.toFixed(2) || "0.00"}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (product.stock || 0)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {state.items.map((item) => {
                  const product = item.products
                  if (!product) return null

                  const selectedVariants = item.selected_variants || {}
                  const hasVariants = Object.keys(selectedVariants).length > 0

                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{product.name}</span>
                        {hasVariants && (
                          <span className="text-xs text-muted-foreground">
                            {Object.entries(selectedVariants)
                              .map(([type, value]) => `${type}: ${value}`)
                              .join(", ")}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                      <span className="ml-2 flex-shrink-0">${((product.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(state.total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(state.total * 1.1).toFixed(2)}</span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
