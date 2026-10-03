import Image from "next/image"
import { getSiteContent } from "@/lib/site-content.server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Nosotros | Casa Brota",
  description: "Diseño interior cálido, orgánico y funcional.",
}

export default async function AboutPage() {
  const content = await getSiteContent()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <Image src={content.about_image || "/images/simple0402.jpg"} alt="Equipo Casa Brota" fill className="object-cover" />
              </div>
              <div className="space-y-8">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">{content.about_title}</h1>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>{content.about_p1}</p>
                  <p>{content.about_p2}</p>
                  <p>{content.about_p3}</p>
                </div>
              </div>
            </div>
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
