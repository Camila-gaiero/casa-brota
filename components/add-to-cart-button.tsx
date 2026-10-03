"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { WHATSAPP_NUMBER } from "@/lib/site-content"
import { ShoppingBag } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number | null
  main_image_url: string | null
}

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (product.price) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image_url,
      })
    }
  }

  if (!product.price) {
    return (
      <Button size="lg" className="w-full" asChild>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa el producto: ${product.name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar por WhatsApp
        </a>
      </Button>
    )
  }

  return (
    <Button size="lg" className="w-full" onClick={handleAddToCart}>
      <ShoppingBag className="mr-2 h-5 w-5" />
      Agregar al carrito
    </Button>
  )
}
