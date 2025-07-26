import { notFound } from "next/navigation"
import { getProduct } from "@/lib/data/products"
import { ProductDetailClient } from "./product-detail-client"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // return <p>hello!</p>
  return <ProductDetailClient product={product} />
}
