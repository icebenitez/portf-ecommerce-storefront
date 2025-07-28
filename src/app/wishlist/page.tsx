"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types/database"

// Mock wishlist data - in a real app, this would come from your database
const mockWishlistItems: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 299.99,
    image: "/placeholder.svg?height=400&width=400&text=Headphones",
    category_id: "1",
    stock: 15,
    featured: true,
    created_at: "",
    updated_at: "",
    categories: { id: "1", name: "Electronics", slug: "electronics", created_at: "", updated_at: "" },
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Advanced fitness tracking with heart rate monitor and GPS.",
    price: 399.99,
    image: "/placeholder.svg?height=400&width=400&text=Smart+Watch",
    category_id: "1",
    stock: 8,
    featured: true,
    created_at: "",
    updated_at: "",
    categories: { id: "1", name: "Electronics", slug: "electronics", created_at: "", updated_at: "" },
  },
  {
    id: "4",
    name: "Yoga Mat",
    description: "Non-slip yoga mat perfect for home workouts and studio classes.",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400&text=Yoga+Mat",
    category_id: "4",
    stock: 12,
    featured: true,
    created_at: "",
    updated_at: "",
    categories: { id: "4", name: "Sports", slug: "sports", created_at: "", updated_at: "" },
  },
]

export default function WishlistPage() {
  const { user, loading } = useAuth()
  const { addItem } = useCart()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<Product[]>(mockWishlistItems)
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleAddToCart = async (product: Product) => {
    setIsAddingToCart(product.id)
    try {
      await addItem(product)
      // Optionally remove from wishlist after adding to cart
      // handleRemoveFromWishlist(product.id)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(null)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "My Wishlist",
        text: "Check out my wishlist on ShopCraft!",
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Wishlist link copied to clipboard!")
    }
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button onClick={handleShare} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Wishlist
            </Button>
          )}
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>

              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <Badge variant="secondary">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                    {product.stock < 5 && product.stock > 0 && <Badge variant="destructive">Low Stock</Badge>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || isAddingToCart === product.id}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isAddingToCart === product.id ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist and come back to them later.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
