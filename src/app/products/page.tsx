import { Suspense } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { getProducts, getCategories } from "@/lib/data/products"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: "name" | "price-low" | "price-high"
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const [products, categories] = await Promise.all([
    getProducts({
      category: params.category,
      search: params.search,
      sortBy: params.sort,
    }),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>

        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No products found</p>
        </div>
      )}
    </div>
  )
}
