"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductVariant } from "@/lib/types/database"

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  selectedVariants: Record<string, string>
  onVariantChange: (variantType: string, value: string) => void
}

export function ProductVariantSelector({ variants, selectedVariants, onVariantChange }: ProductVariantSelectorProps) {
  // Group variants by type (e.g., Color, Size)
  const variantGroups = variants.reduce(
    (groups, variant) => {
      if (!groups[variant.name]) {
        groups[variant.name] = []
      }
      groups[variant.name].push(variant)
      return groups
    },
    {} as Record<string, ProductVariant[]>,
  )

  if (Object.keys(variantGroups).length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(variantGroups).map(([variantType, variantOptions]) => (
          <div key={variantType}>
            <h4 className="font-medium mb-3">
              {variantType}:{" "}
              {selectedVariants[variantType] && <span className="text-primary">{selectedVariants[variantType]}</span>}
            </h4>
            <div className="flex flex-wrap gap-2">
              {variantOptions.map((variant) => {
                const isSelected = selectedVariants[variantType] === variant.value
                const isOutOfStock = variant.stock === 0

                return (
                  <Button
                    key={variant.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={isOutOfStock}
                    onClick={() => onVariantChange(variantType, variant.value)}
                    className="relative"
                  >
                    {variant.value}
                    {variant.price_modifier > 0 && <span className="ml-1 text-xs">+${variant.price_modifier}</span>}
                    {isOutOfStock && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs px-1">
                        Out
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
