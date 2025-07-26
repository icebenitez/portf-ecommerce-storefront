import Link from "next/link"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutErrorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
            <p className="text-muted-foreground">We encountered an issue processing your payment. Please try again.</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">Common issues:</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Insufficient funds</li>
                <li>• Incorrect card information</li>
                <li>• Card expired or blocked</li>
                <li>• Network connection issues</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/checkout">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/cart">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
