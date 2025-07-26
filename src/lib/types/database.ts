export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image: string | null
          category_id: string | null
          stock: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image?: string | null
          category_id?: string | null
          stock?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image?: string | null
          category_id?: string | null
          stock?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          value: string
          price_modifier: number
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          value: string
          price_modifier?: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          value?: string
          price_modifier?: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          verified_purchase: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          selected_variants: Record<string, string>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          selected_variants?: Record<string, string>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          selected_variants?: Record<string, string>
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"]
export type ProductReview = Database["public"]["Tables"]["product_reviews"]["Row"]

export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories?: Database["public"]["Tables"]["categories"]["Row"] | null
  product_variants?: ProductVariant[]
  product_reviews?: ProductReview[]
  average_rating?: number
  review_count?: number
}

export type Category = Database["public"]["Tables"]["categories"]["Row"]

export type DatabaseCartItem = Database["public"]["Tables"]["cart_items"]["Row"] & {
  products: Product
}
