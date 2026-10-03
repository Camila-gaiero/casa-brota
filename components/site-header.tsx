"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ContactModal } from "@/components/contact-modal"
import { useCart } from "@/lib/cart-context"

export function SiteHeader() {
  const { setIsOpen, items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/casa-brota-wordmark-transparent.png"
            alt="Casa Brota"
            width={220}
            height={50}
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/proyectos" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Proyectos
          </Link>
          <Link href="/tienda" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Tienda
          </Link>
          <Link href="/nosotros" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Nosotros
          </Link>
          <ContactModal>
            <button className="transition-colors hover:text-foreground/80 text-foreground/60">Contacto</button>
          </ContactModal>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Carrito</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-stone-900 text-[10px] font-medium text-white flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Inicio
                </Link>
                <Link href="/proyectos" className="text-lg font-medium">
                  Proyectos
                </Link>
                <Link href="/tienda" className="text-lg font-medium">
                  Tienda
                </Link>
                <Link href="/nosotros" className="text-lg font-medium">
                  Nosotros
                </Link>
                <ContactModal>
                  <button className="text-lg font-medium text-left">Contacto</button>
                </ContactModal>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
