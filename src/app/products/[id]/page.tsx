import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductQuantitySelector } from "@/components/product-quantity-selector"
import { getProduct } from "@/lib/data/products"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">${product.price}</p>
          </div>

          <div className="flex items-center gap-4">
            {product.stock > 0 ? (
              <Badge variant="secondary">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {product.stock < 5 && product.stock > 0 && <Badge variant="destructive">Low Stock</Badge>}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

          {/* Quantity Selector - Client Component */}
          <ProductQuantitySelector product={product} />

          {/* Product Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="capitalize">{product.categories?.name || "Uncategorized"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span>{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span>SKU-{product.id.slice(0, 8)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
