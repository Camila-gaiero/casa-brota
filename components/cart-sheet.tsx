"use client"

import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/cart-context"
import { WHATSAPP_NUMBER } from "@/lib/site-content"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export function CartSheet() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart()
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [error, setError] = useState("")

  const handleWhatsAppCheckout = () => {
    if (!name.trim() || !surname.trim()) {
      setError("Por favor completá tu nombre y apellido")
      return
    }

    const phoneNumber = WHATSAPP_NUMBER
    const message = `Hola! Soy ${name} ${surname}. Me gustaría comprar los siguientes productos:\n\n${items
      .map((item) => `- ${item.name} x${item.quantity} ($${item.price * item.quantity})`)
      .join("\n")}\n\nTotal: $${total}`

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
    setError("")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Tu Carrito</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-4 flex flex-col">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-stone-300" />
              <p className="text-stone-500">Tu carrito está vacío</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-stone-100 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <h4 className="font-medium text-stone-900 line-clamp-2">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-stone-100"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-stone-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-medium">${item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4 mt-auto">
                <Separator />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${total}</span>
                </div>

                <div className="space-y-3 bg-stone-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-stone-900">Completá tus datos para finalizar:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Juan"
                        className=""
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="surname" className="text-xs">
                        Apellido
                      </Label>
                      <Input
                        id="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Pérez"
                        className=""
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button variant="default" onClick={handleWhatsAppCheckout}>
                    Finalizar compra
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
