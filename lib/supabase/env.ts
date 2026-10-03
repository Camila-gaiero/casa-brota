/**
 * Lectura y validación de las variables de Supabase.
 *
 * Un valor mal escrito (URL vacía, clave con formato raro, typo) no debe dejar
 * el sitio tirado con 500. Si algo no cuadra devolvemos `null`, y cada helper
 * degrada a un estado inofensivo en vez de romper.
 */

export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) return null

  let valid = false
  try {
    const parsed = new URL(url)
    valid = parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    valid = false
  }

  if (!valid) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL no es una URL válida. Debería verse como https://xxxx.supabase.co — revisa .env.local",
    )
    return null
  }

  // Las claves nuevas de Supabase empiezan con sb_publishable_ o sb_secret_.
  if (!anonKey.startsWith("sb_") && !anonKey.startsWith("eyJ")) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY tiene un formato inesperado — revisa .env.local")
    return null
  }

  return { url, anonKey }
}

export function hasSupabaseConfig(): boolean {
  return getSupabaseConfig() !== null
}