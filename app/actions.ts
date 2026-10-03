"use server"

import { createClient } from "@/lib/supabase/server"
import { isSiteContentKey } from "@/lib/site-content"
import { z } from "zod"

const leadSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  source: z.string().optional(),
  query: z.string().optional(),
})

export async function submitLead(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    source: formData.get("source"),
    query: formData.get("query"),
  }

  const validatedFields = leadSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error } = await supabase.from("leads").insert({
    first_name: validatedFields.data.firstName,
    last_name: validatedFields.data.lastName,
    email: validatedFields.data.email,
    phone: validatedFields.data.phone,
    source: validatedFields.data.source,
    query: validatedFields.data.query,
  })

  if (error) {
    console.error("Error submitting lead:", error)
    return {
      success: false,
      message: "Hubo un error al guardar tus datos. Por favor intentá nuevamente.",
    }
  }

  return { success: true }
}

const siteContentSchema = z.record(z.string(), z.string().max(20000).nullable())

/**
 * Guarda el contenido editable del sitio.
 *
 * Verifica la sesión en el servidor: aunque el RLS de Supabase ya bloquea a los
 * anónimos, chequear acá evita gastar una consulta y devuelve un error claro.
 */
export async function saveSiteContent(content: Record<string, string | null>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Tu sesión expiró. Volvé a iniciar sesión." }
  }

  const parsed = siteContentSchema.safeParse(content)

  if (!parsed.success) {
    return { success: false, message: "Hay campos con un formato inválido." }
  }

  // Solo se escriben claves conocidas del catálogo, nunca lo que mande el cliente.
  const rows = Object.entries(parsed.data)
    .filter(([key]) => isSiteContentKey(key))
    .map(([key, value]) => ({ key, value }))

  if (rows.length === 0) {
    return { success: false, message: "No hay nada para guardar." }
  }

  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" })

  if (error) {
    console.error("Error saving site content:", error)
    return { success: false, message: "No se pudo guardar. Revisá que la base de datos esté configurada." }
  }

  return { success: true }
}

/** Productos activos, para la generación masiva de códigos QR de precios. */
export async function getAllProducts() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, description, reference_code")
    .eq("is_active", true)
    .order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return { success: false, products: [] }
  }

  return { success: true, products: products ?? [] }
}