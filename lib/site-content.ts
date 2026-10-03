/**
 * Contenido editable del sitio desde el panel /admin/contenido.
 *
 * Este módulo es seguro para clientes: no importa nada del servidor.
 * La función `getSiteContent()` vive en `lib/site-content.server.ts`.
 *
 * Cada clave es una fila en la tabla `site_content`. El valor puede ser texto
 * plano o la URL de una imagen subida a Storage.
 *
 * `SITE_CONTENT_DEFAULTS` funciona como red de seguridad: si todavía no hay fila
 * para una clave (o quedó vacía), el sitio usa el valor de acá. Así el front
 * nunca se rompe, y este archivo es la única fuente de verdad de los defaults.
 */
export const SITE_CONTENT_DEFAULTS = {
  hero_image: null,
  hero_text: "Diseño interior cálido, orgánico y funcional.",
  hero_secondary_text: null,

  philosophy_eyebrow: "Nuestra Filosofía",
  philosophy_title: "Creamos espacios que respiran",
  philosophy_text:
    "En Casa Brota creemos que el hogar es un refugio. Utilizamos materiales naturales, texturas orgánicas y una paleta de colores tierra para diseñar ambientes que promueven la calma y el bienestar.",

  cta_title: "¿Listo para transformar tu espacio?",
  cta_text:
    "Contactanos para agendar una visita o asesoría personalizada. Hacemos realidad el hogar que soñás.",
  cta_button_text: "Hablemos",

  about_image: "/images/simple0402.jpg",
  about_title: "Diseño con alma y propósito",
  about_p1: "En Casa Brota, no solo diseñamos espacios; creamos refugios. Nacimos de la necesidad de reconectar con lo esencial, de volver a los materiales nobles y a las formas orgánicas que nos hacen sentir en casa.",
  about_p2:
    "Nuestro enfoque es integral y humano. Entendemos que cada persona habita su espacio de manera única, por eso nuestros proyectos son un diálogo constante entre la funcionalidad y la estética.",
  about_p3:
    'Creemos en el "slow design": espacios pensados para ser vividos con calma, que envejecen con dignidad y que cuentan la historia de quienes los habitan.',

  contact_title: "Hablemos",
  contact_text: "¿Tenés un proyecto en mente? Escribinos y empecemos a darle forma.",
  contact_location: "Buenos Aires, Argentina",
  contact_email: "hola@casabrota.com",
  contact_instagram: "@casabrota",
  contact_instagram_url: "https://instagram.com/casa.brota",

  store_title: "Nuestra Tienda",
  store_text: "Objetos seleccionados y diseñados para aportar calidez y carácter a tus espacios.",

  footer_tagline: "Diseño interior que conecta con la naturaleza.",
  footer_address: "Buenos Aires, Argentina",
} as const

export type SiteContentKey = keyof typeof SITE_CONTENT_DEFAULTS
export type SiteContent = Record<SiteContentKey, string | null>

export const SITE_CONTENT_KEYS = Object.keys(SITE_CONTENT_DEFAULTS) as SiteContentKey[]

export function isSiteContentKey(key: string): key is SiteContentKey {
  return key in SITE_CONTENT_DEFAULTS
}

/** Número de WhatsApp con prefijo de país, sin + ni espacios. */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491140924211"

// -----------------------------------------------------------------------------
// Definición de los campos — la usa el formulario de /admin/contenido
// -----------------------------------------------------------------------------

export const SITE_CONTENT_GROUPS = [
  { id: "portada", title: "Portada", description: "La primera imagen y el texto grande que ve la gente al entrar." },
  { id: "filosofia", title: "Nuestra Filosofía", description: "Sección de texto sobre la portada." },
  { id: "cierre", title: "Cierre", description: "Bloque oscuro del final de la portada, con el botón de contacto." },
  { id: "nosotros", title: "Nosotros", description: "Contenido de la página /nosotros." },
  { id: "contacto", title: "Contacto", description: "Datos públicos de la página /contacto." },
  { id: "tienda", title: "Tienda", description: "Encabezado de la página /tienda." },
  { id: "pie", title: "Pie de página", description: "Texto del footer, en todas las páginas." },
] as const

export type SiteContentGroupId = (typeof SITE_CONTENT_GROUPS)[number]["id"]

export type SiteContentField = {
  key: SiteContentKey
  label: string
  group: SiteContentGroupId
  type: "image" | "text" | "textarea"
  placeholder?: string
  rows?: number
}

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  { key: "hero_image", label: "Foto de portada", group: "portada", type: "image" },
  { key: "hero_text", label: "Título principal", group: "portada", type: "textarea", rows: 2 },
  { key: "hero_secondary_text", label: "Bajada (opcional)", group: "portada", type: "textarea", rows: 2 },

  { key: "philosophy_eyebrow", label: "Antetítulo", group: "filosofia", type: "text" },
  { key: "philosophy_title", label: "Título", group: "filosofia", type: "text" },
  { key: "philosophy_text", label: "Párrafo", group: "filosofia", type: "textarea", rows: 4 },

  { key: "cta_title", label: "Título", group: "cierre", type: "text" },
  { key: "cta_text", label: "Párrafo", group: "cierre", type: "textarea", rows: 3 },
  { key: "cta_button_text", label: "Texto del botón", group: "cierre", type: "text" },

  { key: "about_image", label: "Foto del equipo", group: "nosotros", type: "image" },
  { key: "about_title", label: "Título", group: "nosotros", type: "text" },
  { key: "about_p1", label: "Párrafo 1", group: "nosotros", type: "textarea", rows: 5 },
  { key: "about_p2", label: "Párrafo 2", group: "nosotros", type: "textarea", rows: 5 },
  { key: "about_p3", label: "Párrafo 3", group: "nosotros", type: "textarea", rows: 5 },

  { key: "contact_title", label: "Título", group: "contacto", type: "text" },
  { key: "contact_text", label: "Bajada", group: "contacto", type: "textarea", rows: 2 },
  { key: "contact_location", label: "Ubicación", group: "contacto", type: "text" },
  { key: "contact_email", label: "Email", group: "contacto", type: "text" },
  { key: "contact_instagram", label: "Instagram (texto)", group: "contacto", type: "text" },
  { key: "contact_instagram_url", label: "Instagram (URL)", group: "contacto", type: "text" },

  { key: "store_title", label: "Título", group: "tienda", type: "text" },
  { key: "store_text", label: "Bajada", group: "tienda", type: "textarea", rows: 2 },

  { key: "footer_tagline", label: "Frase del pie", group: "pie", type: "text" },
  { key: "footer_address", label: "Ubicación", group: "pie", type: "text" },
]