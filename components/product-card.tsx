"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  price: number | null
  main_image_url: string | null
  category: string | null
  reference_code?: string | null
  status?: string | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const isSold = product.status === "sold"

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.price) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image_url,
      })
    }
  }

  return (
    <Link href={`/tienda/${product.id}`} className="group block h-full relative">
      {isSold && (
        <div className="absolute top-2 right-2 z-10 bg-stone-900 text-white text-xs font-medium px-2 py-1 rounded">
          VENDIDO
        </div>
      )}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-stone-200 mb-4">
        {product.main_image_url ? (
          <Image
            src={product.main_image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? "opacity-70 grayscale" : ""}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">Sin imagen</div>
        )}

        {/* Quick action overlay */}
        {!isSold && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-center">
            <Button
              size="sm"
              className="rounded-full bg-white/90 text-stone-900 hover:bg-white shadow-sm"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-lg text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="font-serif text-stone-900 whitespace-nowrap">
            {product.price ? `$${product.price}` : "Consultar"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          {product.category && <p className="text-xs text-stone-500 uppercase tracking-wider">{product.category}</p>}
          {product.reference_code && <p className="text-xs text-stone-400 font-mono">{product.reference_code}</p>}
        </div>
      </div>
    </Link>
  )
}
