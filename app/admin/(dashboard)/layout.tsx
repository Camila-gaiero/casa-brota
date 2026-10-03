import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SupabaseConfigError } from "@/components/supabase-config-error"

/**
 * El panel es una zona autenticada: siempre se renderiza en el servidor por
 * request, nunca se prerenderiza ni se cachea.
 */
export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null

  try {
    const supabase = await createClient()
    const result = await supabase.auth.getUser()
    user = result.data.user
  } catch (error) {
    // Sin Supabase configurado no se puede verificar la sesión: mostramos cómo
    // arreglarlo en vez de un error genérico.
    console.error("No se pudo verificar la sesión:", error)
    return <SupabaseConfigError />
  }

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-stone-50/50 p-8">{children}</main>
    </div>
  )
}
