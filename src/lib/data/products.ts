import { createClient } from "@/lib/supabase/server"
import type { Product, Category } from "@/lib/types/database"
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
        )
      `)

    // Apply filters
    if (options?.category) {
      // First get the category ID from slug
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
      // Return filtered fallback data
      return filterFallbackProducts(options)
    }

    return data || []
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    // Return filtered fallback data
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

  // Apply filters
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

  // Apply sorting
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
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product from Supabase:", error)
      // Return fallback product
      return fallbackProducts.find((p) => p.id === id) || null
    }

    return data
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    // Return fallback product
    return fallbackProducts.find((p) => p.id === id) || null
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
