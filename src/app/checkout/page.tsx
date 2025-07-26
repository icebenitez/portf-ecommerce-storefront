"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function CheckoutPage() {
  const { state, clearCartItems } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (!state.isLoading && state.items.length === 0) {
      router.push("/cart")
    }
  }, [state.isLoading, state.items.length, router])

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email! }))
    }
  }, [user?.email])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would:
      // 1. Process payment with Stripe/PayPal
      // 2. Create order in database
      // 3. Send confirmation email
      // 4. Update inventory

      // Clear cart and redirect to success page
      await clearCartItems()
      router.push("/checkout/success")
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Redirect if cart is empty (this will happen after useEffect)
  if (state.items.length === 0) {
    return null
  }

  const subtotal = state.total
  const tax = subtotal * 0.1
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your order below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Authentication Notice */}
          {!user && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sign in for a better experience</p>
                    <p className="text-sm text-muted-foreground">Save your information and track your orders</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!user?.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nameOnCard">Name on Card *</Label>
                  <Input
                    id="nameOnCard"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Complete Order - $${total.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {state.items.map((item) => {
                  const product = item.products
                  if (!product) return null

                  const selectedVariants = item.selected_variants || {}
                  const hasVariants = Object.keys(selectedVariants).length > 0

                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg?height=64&width=64&text=Product"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        {hasVariants && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(selectedVariants).map(([type, value]) => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="font-medium">${((product.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping === 0 && subtotal < 50 && (
                  <div className="text-xs text-muted-foreground">Free shipping on orders over $50</div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Security Notice */}
              <div className="text-xs text-muted-foreground text-center pt-2">
                🔒 Your payment information is secure and encrypted
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
