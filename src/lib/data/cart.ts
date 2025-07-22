import { createClient } from "@/lib/supabase/client"
import type { DatabaseCartItem } from "@/lib/types"

export async function getCartItems(userId: string): Promise<DatabaseCartItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products!cart_items_product_id_fkey (
        *,
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching cart items:", error)
    return []
  }

  return data || []
}

export async function addToCart(userId: string, productId: string, quantity = 1) {
  const supabase = createClient()

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (existingItem) {
    // Update existing item
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)

    if (error) {
      console.error("Error updating cart item:", error)
      throw error
    }
  } else {
    // Insert new item
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity,
    })

    if (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = createClient()

  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

  if (error) {
    console.error("Error updating cart item quantity:", error)
    throw error
  }
}

export async function removeFromCart(itemId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

  if (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export async function clearCart(userId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

  if (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}
