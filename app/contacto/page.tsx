import type React from "react"

import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content"
import { getSiteContent } from "@/lib/site-content.server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"

export const metadata = {
  title: "Contacto | Casa Brota",
  description: "Contanos sobre tu proyecto.",
}

export default async function ContactPage() {
  const content = await getSiteContent()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-8 max-w-4xl">
            <div className="text-center mb-16 space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">{content.contact_title}</h1>
              <p className="text-lg text-muted-foreground">{content.contact_text}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-xl font-medium mb-2">Ubicación</h3>
                  <p className="text-muted-foreground">{content.contact_location}</p>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium mb-2">Email</h3>
                  <a
                    href={`mailto:${content.contact_email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {content.contact_email}
                  </a>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium mb-2">Redes Sociales</h3>
                  <a
                    href={content.contact_instagram_url ?? SITE_CONTENT_DEFAULTS.contact_instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {content.contact_instagram}
                  </a>
                </div>
              </div>

              <ContactForm />
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
