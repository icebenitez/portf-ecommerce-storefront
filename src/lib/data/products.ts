import { createClient } from "@/lib/supabase/server"
import type { Product, Category, ProductReview } from "@/lib/types/database"
import { products as fallbackProducts, categories as fallbackCategories } from "./fallback"

export async function getProducts(options?: {
  category?: string
  featured?: boolean
  search?: string
  sortBy?: "name" | "price-low" | "price-high"
  limit?: number
}): Promise<Product[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("products").select(`
        *,
        categories!products_category_id_fkey (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          name,
          value,
          price_modifier,
          stock
        ),
        product_reviews (
          rating
        )
      `)

    // Apply filters
    if (options?.category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.category)
        .single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    if (options?.featured) {
      query = query.eq("featured", true)
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    // Apply sorting
    if (options?.sortBy) {
      switch (options.sortBy) {
        case "price-low":
          query = query.order("price", { ascending: true })
          break
        case "price-high":
          query = query.order("price", { ascending: false })
          break
        case "name":
          query = query.order("name", { ascending: true })
          break
      }
    } else {
      query = query.order("created_at", { ascending: false })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching products from Supabase:", error)
      return filterFallbackProducts(options)
    }

    // Calculate average ratings
    const productsWithRatings = (data || []).map((product) => {
      const reviews = product.product_reviews || []
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, review: ProductReview) => sum + review.rating, 0) / reviews.length
          : 0

      return {
        ...product,
        average_rating: averageRating,
        review_count: reviews.length,
      }
    })

    return productsWithRatings
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return filterFallbackProducts(options)
  }
}

function filterFallbackProducts(options?: {
  category?: string
  featured?: boolean
  search?: string
  sortBy?: "name" | "price-low" | "price-high"
  limit?: number
}): Product[] {
  let filtered = [...fallbackProducts]

  if (options?.category) {
    filtered = filtered.filter((product) => product.categories?.slug === options.category)
  }

  if (options?.featured) {
    filtered = filtered.filter((product) => product.featured)
  }

  if (options?.search) {
    const searchLower = options.search.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) || product.description?.toLowerCase().includes(searchLower),
    )
  }

  if (options?.sortBy) {
    switch (options.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
  }

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit)
  }

  return filtered
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories!products_category_id_fkey (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          name,
          value,
          price_modifier,
          stock
        ),
        product_reviews (
          id,
          user_id,
          rating,
          title,
          comment,
          verified_purchase,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (error || !data) {
      console.error("Error fetching product from Supabase:", error)
      const fallback = fallbackProducts.find((p) => p.id === id)
      return fallback ? {
        ...fallback,
        average_rating: 0,
        review_count: 0,
      } : null
    }

    // Calculate average rating
    const reviews = data.product_reviews || []
    const averageRating =
      reviews.length > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
      : 0

    return {
      ...data,
      // average_rating: averageRating,
      // review_count: reviews.length,
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    const fallback = fallbackProducts.find((p) => p.id === id)
    return fallback ? {
      ...fallback,
      average_rating: 0,
      review_count: 0,
    } : null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories from Supabase:", error)
      return fallbackCategories
    }

    return data || fallbackCategories
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return fallbackCategories
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true, limit: 8 })
}

export async function submitProductReview(
  productId: string,
  userId: string,
  review: { rating: number; title: string; comment: string },
) {
  const supabase = await createClient()

  const { error } = await supabase.from("product_reviews").insert({
    product_id: productId,
    user_id: userId,
    rating: review.rating,
    title: review.title || null,
    comment: review.comment || null,
    verified_purchase: false, // You can implement logic to check if user actually purchased
  })

  if (error) {
    console.error("Error submitting review:", error)
    throw error
  }
}
