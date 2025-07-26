"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { UserMenu } from "@/components/auth/user-menu"

// Static categories for navigation - you can make this dynamic later
const navigationCategories = [
  { id: "1", name: "Electronics", slug: "electronics" },
  { id: "2", name: "Clothing", slug: "clothing" },
  { id: "3", name: "Home & Garden", slug: "home-garden" },
  { id: "4", name: "Sports", slug: "sports" },
]

export function Header() {
  const { state } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span className="text-xl font-bold">ShopCraft</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            All Products
          </Link>
          {navigationCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Search, Cart, and User Menu */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Input type="search" placeholder="Search products..." className="w-64" />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {state.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {state.itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          <UserMenu />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/products" className="text-lg font-medium">
                  All Products
                </Link>
                {navigationCategories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.slug}`} className="text-lg font-medium">
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
