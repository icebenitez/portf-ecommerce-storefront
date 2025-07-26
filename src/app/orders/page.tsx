"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Calendar, CreditCard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

// Mock order data - in a real app, this would come from your database
const mockOrders = [
  {
    id: "ORD-ABC123456",
    date: "2024-01-15",
    status: "delivered",
    total: 329.98,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 299.99 },
      { name: "Organic Cotton T-Shirt", quantity: 1, price: 29.99 },
    ],
  },
  {
    id: "ORD-DEF789012",
    date: "2024-01-10",
    status: "shipped",
    total: 159.99,
    items: [{ name: "Running Shoes", quantity: 1, price: 159.99 }],
  },
  {
    id: "ORD-GHI345678",
    date: "2024-01-05",
    status: "processing",
    total: 49.99,
    items: [{ name: "Yoga Mat", quantity: 1, price: 49.99 }],
  },
]

const statusColors = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {mockOrders.length > 0 ? (
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="ghost" size="sm">
                      Leave Review
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button variant="ghost" size="sm">
                      Track Package
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">When you place your first order, it will appear here.</p>
            <Button asChild>
              <Link href="/products">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
