import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseConfig } from "@/lib/supabase/env"
import { getSiteContent } from "@/lib/site-content.server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

export default async function Home() {
  const content = await getSiteContent()
  let products: Array<Parameters<typeof ProductCard>[0]["product"]> = []
  let projects: Array<{ id: string; name: string; location?: string | null; cover_image?: string | null }> = []

  // The public landing page remains visible in the preview even before Supabase is connected.
  try {
    if (hasSupabaseConfig()) {
      const supabase = await createClient()
      const productsResult = await supabase.from("products").select("*").eq("is_active", true).limit(3)
      const projectsResult = await supabase.from("projects").select("*").eq("is_active", true).limit(2)

      products = productsResult.data ?? []
      projects = projectsResult.data ?? []
    }
  } catch (error) {
    console.error("No se pudieron cargar productos/proyectos de la portada:", error)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden bg-muted">
          <Image
            src={content.hero_image || "/images/simple0190.jpg"}
            alt="Casa Brota Interior"
            fill
            className="object-cover"
            priority
          />
          {/* </CHANGE> */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="container text-center text-white space-y-8 mx-auto">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-lg max-w-5xl mx-auto leading-tight tracking-tight">
                {content.hero_text}
              </h1>
              {content.hero_secondary_text && (
                <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl drop-shadow-md">
                  {content.hero_secondary_text}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-stone-900 hover:bg-stone-100 border-none text-lg px-8 h-14"
                >
                  <Link href="/proyectos">Ver Proyectos</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white text-lg px-8 h-14"
                >
                  <Link href="/tienda">Ir a la Tienda</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-32 bg-background">
          <div className="container px-6 md:px-12 lg:px-24 max-w-5xl text-center space-y-8 mx-auto">
            <span className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
              {content.philosophy_eyebrow}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
              {content.philosophy_title}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">{content.philosophy_text}</p>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-32 bg-secondary/30">
          <div className="container px-6 md:px-12 lg:px-24">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Tienda</h2>
              <Link
                href="/tienda"
                className="group flex items-center text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todo <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {products && products.length > 0 ? (
                products.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground text-lg">Próximamente nuevos productos en la tienda.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-32 bg-background">
          <div className="container px-6 md:px-12 lg:px-24">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Proyectos Recientes</h2>
              <Link
                href="/proyectos"
                className="group flex items-center text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver portafolio <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/proyectos/${project.id}`}
                    className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                  >
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Proyecto</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <h3 className="text-white font-serif text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {project.name}
                      </h3>
                      <p className="text-white/90 text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        {project.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Próximamente nuevos proyectos</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-foreground text-background text-center">
          <div className="container px-6 md:px-12 lg:px-24 max-w-4xl space-y-10 mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">{content.cta_title}</h2>
            <p className="text-background/80 text-xl font-light leading-relaxed">{content.cta_text}</p>
            <ContactModal>
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-10 h-14">
                {content.cta_button_text}
              </Button>
            </ContactModal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

// Estas páginas muestran contenido editable desde /admin/contenido.
// Se renderizan por request para que los cambios del panel se vean al instante.
export const dynamic = "force-dynamic"
