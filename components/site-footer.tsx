import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content"
import { getSiteContent } from "@/lib/site-content.server"

export async function SiteFooter() {
  const content = await getSiteContent()

  return (
    <footer className="bg-stone-100 border-t mt-32">
      <div className="container py-12 md:py-16 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-2">
            <Image
              src="/images/casa-brota-wordmark-transparent.png"
              alt="Casa Brota"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
            <p className="text-sm text-stone-600 max-w-xs">{content.footer_tagline}</p>
            <p className="text-xs text-stone-500">{content.footer_address}</p>
          </div>

          <div className="flex justify-center gap-6">
            <Link href="/proyectos" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Proyectos
            </Link>
            <Link href="/tienda" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Tienda
            </Link>
            <Link href="/nosotros" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Contacto
            </Link>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href={content.contact_instagram_url ?? SITE_CONTENT_DEFAULTS.contact_instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-900"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Casa Brota. Todos los derechos reservados.</p>
          <Link href="/admin/login" className="hover:text-stone-900 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}