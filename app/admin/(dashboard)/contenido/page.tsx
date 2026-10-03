import { getSiteContent } from "@/lib/site-content.server"
import { SiteContentForm } from "@/components/site-content-form"

export const metadata = {
  title: "Contenido | Casa Brota Admin",
}

export default async function SiteContentPage() {
  const content = await getSiteContent()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Contenido del sitio</h1>
        <p className="text-muted-foreground">
          Editá los textos y las fotos de la web. Se publican al instante en la portada, /nosotros, /contacto y
          /tienda.
        </p>
      </div>

      <SiteContentForm initialContent={content} />
    </div>
  )
}