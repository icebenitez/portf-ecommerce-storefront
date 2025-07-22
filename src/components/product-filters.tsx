"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name")

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    router.push(`/products?${newSearchParams.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    updateURL({ search: value, category: selectedCategory, sort: sortBy })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateURL({ search: searchTerm, category: value, sort: sortBy })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL({ search: searchTerm, category: selectedCategory, sort: value })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("name")
    router.push("/products")
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all"

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="md:w-64"
        />

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary">
              Search: {searchTerm}
              <button onClick={() => handleSearchChange("")} className="ml-2 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => handleCategoryChange("all")} className="ml-2 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
