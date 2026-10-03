import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content.server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata = {
  title: "Tienda | Casa Brota",
  description: "Descubre nuestra colección de objetos de diseño y mobiliario.",
}

type StoreProduct = {
  id: string
  name: string
  price: number | null
  main_image_url: string | null
  category: string | null
  reference_code?: string | null
  status?: string | null
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const content = await getSiteContent()
  const { q, category } = await searchParams

  let products: StoreProduct[] = []

  try {
    const supabase = await createClient()
    let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false })

    if (q) {
      query = query.ilike("name", `%${q}%`)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("No se pudieron cargar los productos:", error.message)
    }

    products = data ?? []
  } catch (error) {
    console.error("Fallo cargando el catálogo:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-8 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="text-center space-y-6 mb-20">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-stone-900">{content.store_title}</h1>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg leading-relaxed">{content.store_text}</p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <Button variant={!category ? "default" : "outline"} asChild className={!category ? "bg-stone-900" : ""}>
                <a href="/tienda">Todos</a>
              </Button>
              <Button
                variant={category === "Producto" ? "default" : "outline"}
                asChild
                className={category === "Producto" ? "bg-stone-900" : ""}
              >
                <a href="/tienda?category=Producto">Productos</a>
              </Button>
              <Button
                variant={category === "Interiorismo" ? "default" : "outline"}
                asChild
                className={category === "Interiorismo" ? "bg-stone-900" : ""}
              >
                <a href="/tienda?category=Interiorismo">Interiorismo</a>
              </Button>
            </div>

            <form className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="q" placeholder="Buscar productos..." className="pl-9 bg-white" defaultValue={q} />
            </form>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products && products.length > 0 ? (
              products.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-stone-500 text-lg">No se encontraron productos.</p>
                {(q || category) && (
                  <Button variant="link" asChild className="mt-2">
                    <a href="/tienda">Limpiar filtros</a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

// Estas páginas muestran contenido editable desde /admin/contenido.
// Se renderizan por request para que los cambios del panel se vean al instante.
export const dynamic = "force-dynamic"
