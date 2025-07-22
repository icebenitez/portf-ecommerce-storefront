"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { addToCart, getCartItems, updateCartItemQuantity, removeFromCart, clearCart } from "@/lib/data/cart"
import type { Product, DatabaseCartItem } from "@/lib/types"

interface CartState {
  items: DatabaseCartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: DatabaseCartItem[] }
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (product: Product) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCartItems: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ITEMS": {
      const items = action.payload
      const total = items.length ? items.reduce((sum, item) => sum + item.products.price * item.quantity, 0) : 0
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items, total, itemCount, isLoading: false }
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0, itemCount: 0 }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: true,
  })

  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  // Get user and load cart
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await loadCart(user.id)
      } else {
        // Load from localStorage for anonymous users
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart)
            dispatch({ type: "SET_ITEMS", payload: cartItems })
          } catch (error) {
            console.error("Error loading cart from localStorage:", error)
          }
        }
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        await loadCart(session.user.id)
      } else {
        dispatch({ type: "CLEAR_CART" })
        dispatch({ type: "SET_LOADING", payload: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Save to localStorage for anonymous users
  useEffect(() => {
    if (!user && !state.isLoading) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items, user, state.isLoading])

  const loadCart = async (userId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const items = await getCartItems(userId)
      dispatch({ type: "SET_ITEMS", payload: items })
    } catch (error) {
      console.error("Error loading cart:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addItem = async (product: Product) => {
    if (user) {
      try {
        await addToCart(user.id, product.id)
        await loadCart(user.id)
      } catch (error) {
        console.error("Error adding item to cart:", error)
      }
    } else {
      // Handle anonymous cart (localStorage)
      const existingItemIndex = state.items.findIndex((item) => item.products.id === product.id)

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += 1
        dispatch({ type: "SET_ITEMS", payload: updatedItems })
      } else {
        const newItem: DatabaseCartItem = {
          id: `temp-${Date.now()}`,
          user_id: "anonymous",
          product_id: product.id,
          quantity: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          products: product,
        }
        dispatch({ type: "SET_ITEMS", payload: [...state.items, newItem] })
      }
    }
  }

  const removeItem = async (itemId: string) => {
    if (user) {
      try {
        await removeFromCart(itemId)
        await loadCart(user.id)
      } catch (error) {
        console.error("Error removing item from cart:", error)
      }
    } else {
      const updatedItems = state.items.filter((item) => item.id !== itemId)
      dispatch({ type: "SET_ITEMS", payload: updatedItems })
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (user) {
      try {
        await updateCartItemQuantity(itemId, quantity)
        await loadCart(user.id)
      } catch (error) {
        console.error("Error updating cart item quantity:", error)
      }
    } else {
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }

      const updatedItems = state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      dispatch({ type: "SET_ITEMS", payload: updatedItems })
    }
  }

  const clearCartItems = async () => {
    if (user) {
      try {
        await clearCart(user.id)
        dispatch({ type: "CLEAR_CART" })
      } catch (error) {
        console.error("Error clearing cart:", error)
      }
    } else {
      dispatch({ type: "CLEAR_CART" })
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
