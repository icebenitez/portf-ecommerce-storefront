"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export default function CheckoutSuccessPage() {
  const { user } = useAuth()
  const [orderNumber] = useState(() => `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Order Number</span>
                <span className="font-mono text-sm">{orderNumber}</span>
              </div>
              {user?.email && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email</span>
                  <span className="text-sm">{user.email}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* What's Next */}
            <div className="space-y-4">
              <h3 className="font-semibold">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email confirmation with your order details shortly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Processing & Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      Your order will be processed within 1-2 business days and shipped to your address.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tracking Information</p>
                    <p className="text-sm text-muted-foreground">
                      Once shipped, you'll receive tracking information to monitor your delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>

              {user ? (
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/orders">View Order History</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/register">Create Account to Track Orders</Link>
                </Button>
              )}

              <Button asChild variant="ghost" className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Need help with your order?{" "}
                <Link href="/support" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
