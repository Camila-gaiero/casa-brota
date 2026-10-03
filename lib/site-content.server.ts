import { createClient } from "@/lib/supabase/server"
import { SITE_CONTENT_DEFAULTS, isSiteContentKey, type SiteContent, type SiteContentKey } from "@/lib/site-content"

function resolve(key: SiteContentKey, value: string | null | undefined): string | null {
  if (value === null || value === undefined || value.trim() === "") {
    return SITE_CONTENT_DEFAULTS[key]
  }
  return value
}

/**
 * Lee todo el contenido editable del sitio.
 * Las claves ausentes, vacías o ilegibles caen al default.
 *
 * Solo para Server Components: usa `next/headers` a través del cliente de Supabase.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const content = { ...SITE_CONTENT_DEFAULTS } as SiteContent

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("site_content").select("key, value")

    if (error) {
      // Tabla inexistente (script SQL sin correr), sin conexión, o RLS roto.
      // El sitio sigue online con los defaults.
      console.error("No se pudo leer site_content:", error.message)
      return content
    }

    for (const row of data ?? []) {
      if (isSiteContentKey(row.key)) {
        content[row.key] = resolve(row.key, row.value)
      }
    }
  } catch (error) {
    // Esta función corre en el pie de página, que está en todas las páginas
    // públicas: si tira, se cae el sitio entero. Nunca propagamos el error.
    console.error("Fallo crítico leyendo site_content:", error)
  }

  return content
}