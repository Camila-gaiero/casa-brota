import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseConfig } from "@/lib/supabase/env"

/**
 * Cliente de Supabase para el navegador.
 *
 * Se usa solo dentro del panel de administración. Si la configuración está mal,
 * tira un error con un mensaje claro en vez de uno críptico de la librería.
 */
export function createClient() {
  const config = getSupabaseConfig()

  if (!config) {
    throw new Error(
      "Supabase no está configurado. Revisá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
    )
  }

  return createBrowserClient(config.url, config.anonKey)
}