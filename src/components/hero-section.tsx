import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Products</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Shop the latest trends with fast shipping and unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/products?featured=true">Featured Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
