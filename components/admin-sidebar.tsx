"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, FolderOpen, Settings, LogOut, Home, LayoutTemplate } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Contenido",
    href: "/admin/contenido",
    icon: LayoutTemplate,
  },
  {
    title: "Stock",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Proyectos",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-stone-50">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
          Casa Brota
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-stone-200 text-stone-900"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2 text-stone-500" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Ver Sitio
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
