import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product) {
    notFound()
  }

  const isSold = product.status === "sold"

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 py-32 md:py-48">
        <div className="container max-w-7xl px-6 md:px-12 lg:px-24">
          <Link
            href="/tienda"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 items-start">
            {/* Product Images */}
            <div className="space-y-8">
              <div className="aspect-square relative overflow-hidden rounded-xl bg-stone-50">
                {isSold && (
                  <div className="absolute top-4 right-4 z-10 bg-stone-900 text-white text-sm font-medium px-3 py-1 rounded">
                    VENDIDO
                  </div>
                )}
                {product.main_image_url ? (
                  <Image
                    src={product.main_image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className={`object-cover ${isSold ? "grayscale" : ""}`}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400">Sin imagen</div>
                )}
              </div>

              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-6">
                  {product.gallery.map((img: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square relative overflow-hidden rounded-lg bg-stone-50 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} - vista ${index + 1}`}
                        fill
                        className={`object-cover ${isSold ? "grayscale" : ""}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-12 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                  <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">{product.category}</p>
                  {product.reference_code && (
                    <span className="text-sm font-mono text-stone-500">REF: {product.reference_code}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-3xl font-medium text-stone-900">
                    {product.price ? `$${product.price}` : "Consultar precio"}
                  </div>
                </div>
              </div>

              <div className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {product.materials && (
                <div className="space-y-3">
                  <h3 className="font-medium text-lg text-stone-900">Materiales</h3>
                  <p className="text-stone-600">{product.materials}</p>
                </div>
              )}

              <div className="space-y-6 pt-6 border-t border-stone-200">
                {isSold ? (
                  <Button size="lg" className="w-full h-14 text-lg" disabled>
                    Producto Vendido
                  </Button>
                ) : (
                  <div className="w-full">
                    <AddToCartButton product={product} />
                  </div>
                )}
                <p className="text-sm text-stone-500 text-center">* Los envíos se coordinan al momento de la compra</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <Truck className="h-6 w-6 text-stone-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-stone-900">Envíos a todo el país</h4>
                    <p className="text-sm text-stone-500 mt-1">Coordinamos la entrega a tu domicilio</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-stone-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-stone-900">Garantía de calidad</h4>
                    <p className="text-sm text-stone-500 mt-1">Materiales seleccionados y duraderos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
