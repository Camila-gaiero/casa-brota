import type React from "react"
import { Toaster } from "@/components/ui/sonner"

/**
 * Layout de /admin.
 *
 * La verificación de sesión vive en app/admin/(dashboard)/layout.tsx, que solo
 * envuelve las páginas protegidas. Esta layout envuelve también /admin/login,
 * así que no debe intentar autenticar: si lo hiciera, no se podría mostrar el
 * formulario de acceso.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
      <Toaster />
    </div>
  )
}