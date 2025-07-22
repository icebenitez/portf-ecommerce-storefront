import type { Product } from "./types/database"

export type { Product, Category, DatabaseCartItem } from "./types/database"

export interface CartItem {
  product: Product
  quantity: number
}
