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

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1,
  selectedVariants: Record<string, string> = {}
) {
  console.log('userId', userId);
  console.log('productId', productId);
  console.log('quantity', quantity);
  console.log('selectedVariants', selectedVariants);
  const supabase = createClient();
  ;
  // Check if the same item with the same variants exists
  const { data: existingItem, error: fetchError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("selected_variants", JSON.stringify(selectedVariants))
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.log('fetchError.code', fetchError.code)
    console.error("Error checking cart item:", fetchError);
    throw fetchError;
  }

  if (existingItem) {
    // Item with same variants exists: update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity, updated_at: new Date().toISOString() })
      .eq("id", existingItem.id);

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      throw updateError;
    }
  } else {
    // Insert new cart item with selected variants
    const { error: insertError } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity,
      selected_variants: selectedVariants,
    });

    if (insertError) {
      console.error("Error adding to cart:", insertError);
      throw insertError;
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
